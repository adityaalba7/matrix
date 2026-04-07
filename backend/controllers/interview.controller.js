import { validationResult } from 'express-validator';
import { query } from '../db/index.js';
import redisClient from '../db/redis.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { detectFillerWords } from '../utils/fillerWords.js';
import { askAI } from '../utils/ai.js';

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

const generateAIQuestions = async (domain, roundType, total) => {
  const prompt = `Generate exactly ${total} technical interview questions for a ${roundType} round targeting the ${domain} domain. 
Return only a JSON array of objects with a "question_text" field.`;
  
  try {
    const raw = await askAI(prompt, 'You are an expert technical interviewer.', true);
    const parsed = JSON.parse(raw);
    let questions = Array.isArray(parsed) ? parsed : parsed.questions || [];
    
    // Fallback if AI messes up the format
    if (questions.length === 0) throw new Error('AI returned empty');
    
    return questions.map((q, i) => ({
      index: i,
      question_text: q.question_text || q,
    })).slice(0, total);
  } catch (err) {
    console.error('Question generation failed', err);
    // Fallback to stubs if it completely fails
    return Array.from({ length: total }, (_, i) => ({
      index: i,
      question_text: `Fallback Q${i + 1}: Explain a challenging concept you learned in ${domain}.`,
    }));
  }
};

const evaluateAnswer = async (question, answer) => {
  const prompt = `Question: "${question}"
Candidate's Answer: "${answer}"

Evaluate the answer. Return ONLY a JSON object with these exactly named keys:
- "feedback" (string, max 2 sentences constructive feedback)
- "clarity_score" (number 0-100)
- "depth_score" (number 0-100)
- "confidence_score" (number 0-100)
- "structure_score" (number 0-100)`;

  try {
    const raw = await askAI(prompt, 'You are an elite Silicon Valley interviewer rating candidate answers strictly.', true);
    return JSON.parse(raw);
  } catch (err) {
    console.error('Evaluation failed', err);
    return {
      feedback: 'Could not generate detailed AI feedback right now. Keep practicing!',
      clarity_score: 50, depth_score: 50, confidence_score: 50, structure_score: 50
    };
  }
};

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
  const questions = await generateAIQuestions(domain, round_type, total_questions);

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
  
  // AI Evaluation
  const evaluation = await evaluateAnswer(question_text, answer_text);

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
      JSON.stringify(evaluation),                          // store FULL object so endSession can extract scores
      JSON.stringify(fillerResult.breakdown || {}),        // ensure valid JSON object
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
    scores: {
      clarity: evaluation.clarity_score,
      depth: evaluation.depth_score,
      confidence: evaluation.confidence_score,
      structure: evaluation.structure_score
    },
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
    `SELECT filler_words_detected,
            (ai_feedback::json->>'clarity_score')::INTEGER as c_score,
            (ai_feedback::json->>'depth_score')::INTEGER as d_score,
            (ai_feedback::json->>'confidence_score')::INTEGER as conf_score,
            (ai_feedback::json->>'structure_score')::INTEGER as s_score
     FROM interview_answers WHERE session_id = $1`,
    [sessionId]
  );

  let totalC = 0, totalD = 0, totalConf = 0, totalS = 0;
  const count = answersResult.rowCount || 1; // prevent divide by zero

  const totalFillers = answersResult.rows.reduce((sum, row) => {
    // Also accumulate scores (fallback to 70 if missing JSON field)
    totalC += row.c_score || 70;
    totalD += row.d_score || 70;
    totalConf += row.conf_score || 70;
    totalS += row.s_score || 70;

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
      Math.round(totalC / count),
      Math.round(totalD / count),
      Math.round(totalConf / count),
      Math.round(totalS / count),
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
    transcript: 'Whisper transcription stub — use Web Speech API on the frontend.',
  });
};

export const jdAnalyze = async (req, res) => {
  if (!checkValidation(req, res)) return;
  const { jd_text } = req.body;

  const prompt = `Analyze this Job Description and extract:
1. A list of specific technical and soft skills required (max 12 skills, short names only like "React", "System Design", "SQL")
2. A concise 7-day preparation plan tailored to these skills

Job Description:
${jd_text.slice(0, 2000)}

Return ONLY a JSON object with:
- "skills": array of skill name strings
- "plan": a single short paragraph (2-3 sentences) describing the 7-day plan`;

  try {
    const raw = await askAI(prompt, 'You are a senior technical recruiter and career coach.', true);
    const parsed = JSON.parse(raw);
    return sendSuccess(res, {
      skills: parsed.skills || [],
      plan: parsed.plan || '',
    });
  } catch (err) {
    console.error('JD Analyze failed', err);
    return sendError(res, 'AI_ERROR', 'JD analysis failed. Try again.', 500);
  }
};

export const salaryRoleplay = async (req, res) => {
  if (!checkValidation(req, res)) return;

  const { message } = req.body;
  const historyKey = `user:${req.user.id}:salary_history`;

  await redisClient.rPush(historyKey, JSON.stringify({ role: 'user', content: message }));
  await redisClient.expire(historyKey, 24 * 60 * 60);
  
  const historyRaw = await redisClient.lRange(historyKey, 0, -1);
  const history = historyRaw.map(h => JSON.parse(h));

  const promptHistory = history.map(h => `${h.role === 'user' ? 'Candidate' : 'HR'}: ${h.content}`).join('\n');
  const prompt = `Conversation so far:\n${promptHistory}\n\nAs the HR rep, reply to the candidate. Keep it realistic, push back a little if they ask for too much. Do not include prefix "HR:". Keep it under 2 sentences.`;

  try {
    const aiReply = await askAI(prompt, 'You are an HR representative at a top tech company negotiating salary.');
    await redisClient.rPush(historyKey, JSON.stringify({ role: 'assistant', content: aiReply }));
    
    const finalHistoryRaw = await redisClient.lRange(historyKey, 0, -1);
    const finalHistory = finalHistoryRaw.map(h => JSON.parse(h));
    
    return sendSuccess(res, { reply: aiReply, history: finalHistory });
  } catch (err) {
    console.error('Salary Roleplay failed', err);
    return sendError(res, 'AI_ERROR', 'HR is currently unavailable.', 500);
  }
};
