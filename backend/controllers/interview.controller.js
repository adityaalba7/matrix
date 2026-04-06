import { validationResult } from 'express-validator';
import { query } from '../db/index.js';
import redisClient from '../db/redis.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { detectFillerWords } from '../utils/fillerWords.js';

const INTERVIEW_TTL = 2 * 60 * 60;

const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    sendError(res, 'VALIDATION_ERROR', first.msg, 422);
    return false;
  }
  return true;
};

const generateStubQuestions = (domain, roundType, total) => {
  return Array.from({ length: total }, (_, i) => ({
    index: i,
    question_text: `Stub Q${i + 1}: Tell me about your experience in ${domain} (${roundType} round).`,
  }));
};

const stubEvaluate = () => ({
  feedback: 'Stub AI feedback — AI engineer will replace this with Claude evaluation.',
  clarity_score: Math.floor(Math.random() * 30) + 70,
  depth_score: Math.floor(Math.random() * 30) + 70,
  confidence_score: Math.floor(Math.random() * 30) + 70,
  structure_score: Math.floor(Math.random() * 30) + 70,
});

export const startSession = async (req, res) => {
  if (!checkValidation(req, res)) return;

  const { domain, round_type, company_target, total_questions = 5 } = req.body;

  const { rows } = await query(
    `INSERT INTO interview_sessions (user_id, domain, round_type, company_target, total_questions)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [req.user.id, domain, round_type, company_target || null, total_questions]
  );

  const session = rows[0];
  const questions = generateStubQuestions(domain, round_type, total_questions);

  await redisClient.setEx(
    `interview:${session.id}:questions`,
    INTERVIEW_TTL,
    JSON.stringify(questions)
  );

  return sendSuccess(res, {
    session_id: session.id,
    first_question: questions[0],
    total_questions,
  }, {}, 201);
};

export const submitAnswer = async (req, res) => {
  if (!checkValidation(req, res)) return;

  const { id: sessionId } = req.params;
  const { answer_text, question_text, question_index, audio_s3_key } = req.body;

  const sessionResult = await query(
    `SELECT id, total_questions FROM interview_sessions
     WHERE id = $1 AND user_id = $2 AND completed_at IS NULL`,
    [sessionId, req.user.id]
  );

  if (sessionResult.rowCount === 0) {
    return sendError(res, 'NOT_FOUND', 'Session not found or already completed.', 404);
  }

  const { total_questions } = sessionResult.rows[0];
  const fillerResult = detectFillerWords(answer_text);
  const evaluation = stubEvaluate();

  const { rows } = await query(
    `INSERT INTO interview_answers
       (session_id, question_text, answer_text, audio_s3_key, ai_feedback, filler_words_detected, question_index)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      sessionId,
      question_text,
      answer_text,
      audio_s3_key || null,
      evaluation.feedback,
      JSON.stringify(fillerResult.breakdown),
      question_index,
    ]
  );

  const nextIndex = question_index + 1;
  const isLast = nextIndex >= total_questions;

  let nextQuestion = null;
  if (!isLast) {
    const cachedRaw = await redisClient.get(`interview:${sessionId}:questions`);
    if (cachedRaw) {
      const questions = JSON.parse(cachedRaw);
      nextQuestion = questions[nextIndex] || null;
    }
  }

  return sendSuccess(res, {
    answer: rows[0],
    feedback: evaluation.feedback,
    filler_words: fillerResult,
    next_question: nextQuestion,
    is_last: isLast,
  });
};

export const endSession = async (req, res) => {
  const { id: sessionId } = req.params;

  const sessionResult = await query(
    `SELECT id, total_questions FROM interview_sessions
     WHERE id = $1 AND user_id = $2 AND completed_at IS NULL`,
    [sessionId, req.user.id]
  );

  if (sessionResult.rowCount === 0) {
    return sendError(res, 'NOT_FOUND', 'Session not found or already completed.', 404);
  }

  const answersResult = await query(
    `SELECT filler_words_detected FROM interview_answers WHERE session_id = $1`,
    [sessionId]
  );

  const evaluation = stubEvaluate();

  const totalFillers = answersResult.rows.reduce((sum, row) => {
    const breakdown = row.filler_words_detected || {};
    return sum + Object.values(breakdown).reduce((s, n) => s + n, 0);
  }, 0);

  const { rows } = await query(
    `UPDATE interview_sessions
     SET
       completed_at      = NOW(),
       clarity_score     = $1,
       depth_score       = $2,
       confidence_score  = $3,
       structure_score   = $4,
       filler_word_count = $5
     WHERE id = $6
     RETURNING *`,
    [
      evaluation.clarity_score,
      evaluation.depth_score,
      evaluation.confidence_score,
      evaluation.structure_score,
      totalFillers,
      sessionId,
    ]
  );

  await redisClient.del(`interview:${sessionId}:questions`);

  const allAnswers = await query(
    `SELECT * FROM interview_answers WHERE session_id = $1 ORDER BY question_index`,
    [sessionId]
  );

  return sendSuccess(res, {
    session: rows[0],
    answers: allAnswers.rows,
    total_filler_words: totalFillers,
  });
};

export const listSessions = async (req, res) => {
  const { page = 1 } = req.query;
  const LIMIT = 20;
  const OFFSET = (parseInt(page) - 1) * LIMIT;

  const [dataResult, countResult] = await Promise.all([
    query(
      `SELECT id, domain, round_type, company_target, total_questions,
              clarity_score, depth_score, confidence_score, structure_score,
              filler_word_count, completed_at
       FROM interview_sessions
       WHERE user_id = $1
       ORDER BY completed_at DESC NULLS FIRST
       LIMIT $2 OFFSET $3`,
      [req.user.id, LIMIT, OFFSET]
    ),
    query(`SELECT COUNT(*) FROM interview_sessions WHERE user_id = $1`, [req.user.id]),
  ]);

  const total = parseInt(countResult.rows[0].count);

  return sendSuccess(res, { sessions: dataResult.rows }, {
    total,
    page: parseInt(page),
    pages: Math.ceil(total / LIMIT),
  });
};

export const getSessionDetail = async (req, res) => {
  const { id: sessionId } = req.params;

  const sessionResult = await query(
    `SELECT * FROM interview_sessions WHERE id = $1 AND user_id = $2`,
    [sessionId, req.user.id]
  );

  if (sessionResult.rowCount === 0) {
    return sendError(res, 'NOT_FOUND', 'Session not found.', 404);
  }

  const answersResult = await query(
    `SELECT * FROM interview_answers WHERE session_id = $1 ORDER BY question_index`,
    [sessionId]
  );

  return sendSuccess(res, {
    session: sessionResult.rows[0],
    answers: answersResult.rows,
  });
};

export const getPerformance = async (req, res) => {
  const { rows } = await query(
    `SELECT
       ROUND(AVG(clarity_score))::INTEGER    AS avg_clarity,
       ROUND(AVG(depth_score))::INTEGER      AS avg_depth,
       ROUND(AVG(confidence_score))::INTEGER AS avg_confidence,
       ROUND(AVG(structure_score))::INTEGER  AS avg_structure,
       COUNT(*)::INTEGER                     AS total_sessions,
       SUM(filler_word_count)::INTEGER       AS total_filler_words
     FROM interview_sessions
     WHERE user_id = $1 AND completed_at IS NOT NULL`,
    [req.user.id]
  );

  return sendSuccess(res, { performance: rows[0] });
};

export const getFillerStats = async (req, res) => {
  const { rows } = await query(
    `SELECT ia.filler_words_detected
     FROM interview_answers ia
     JOIN interview_sessions iss ON iss.id = ia.session_id
     WHERE iss.user_id = $1`,
    [req.user.id]
  );

  const aggregate = {};

  for (const row of rows) {
    const breakdown = row.filler_words_detected || {};
    for (const [word, count] of Object.entries(breakdown)) {
      aggregate[word] = (aggregate[word] || 0) + count;
    }
  }

  const total = Object.values(aggregate).reduce((s, n) => s + n, 0);
  const sorted = Object.entries(aggregate)
    .sort(([, a], [, b]) => b - a)
    .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {});

  return sendSuccess(res, { total_filler_count: total, breakdown: sorted });
};

export const transcribeAudio = async (req, res) => {
  return sendSuccess(res, {
    transcript: 'Stub — Whisper transcription will replace this.',
  });
};

export const salaryRoleplay = async (req, res) => {
  if (!checkValidation(req, res)) return;

  const { message } = req.body;
  const historyKey = `user:${req.user.id}:salary_history`;

  await redisClient.rPush(historyKey, JSON.stringify({ role: 'user', content: message }));
  await redisClient.expire(historyKey, 24 * 60 * 60);

  const aiReply = 'Stub negotiation advice — Claude will fill this. You asked: ' + message;

  await redisClient.rPush(historyKey, JSON.stringify({ role: 'assistant', content: aiReply }));

  const historyRaw = await redisClient.lRange(historyKey, 0, -1);
  const history = historyRaw.map(h => JSON.parse(h));

  return sendSuccess(res, { reply: aiReply, history });
};
