import { validationResult } from 'express-validator';
import { query } from '../db/index.js';
import redisClient from '../db/redis.js';
import { sendSuccess, sendError } from '../utils/response.js';

const QUIZ_TTL = 2 * 60 * 60;

const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    sendError(res, 'VALIDATION_ERROR', first.msg, 422);
    return false;
  }
  return true;
};

const generateStubQuestions = (subject, total, difficulty) => {
  return Array.from({ length: total || 5 }, (_, i) => ({
    index: i + 1,
    question_text: `Stub question ${i + 1} on ${subject || 'General'} (${difficulty})`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correct_answer: 'Option A',
    concept_tag: subject || 'general',
    explanation: 'This is a stub explanation. AI will fill this.',
  }));
};

export const startQuiz = async (req, res) => {
  if (!checkValidation(req, res)) return;

  const { source_type, source_ref, subject, total_questions = 5, difficulty = 'medium' } = req.body;

  const { rows } = await query(
    `INSERT INTO quiz_sessions (user_id, source_type, source_ref, subject, total_questions, difficulty)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [req.user.id, source_type, source_ref || null, subject || null, total_questions, difficulty]
  );

  const session = rows[0];
  const questions = generateStubQuestions(subject, total_questions, difficulty);

  await redisClient.setEx(
    `session:${session.id}:questions`,
    QUIZ_TTL,
    JSON.stringify(questions)
  );

  return sendSuccess(res, { session_id: session.id, questions }, {}, 201);
};

export const answerQuestion = async (req, res) => {
  if (!checkValidation(req, res)) return;

  const { id: sessionId } = req.params;
  const { question_text, correct_answer, user_answer, is_correct, concept_tag } = req.body;

  const sessionCheck = await query(
    `SELECT id FROM quiz_sessions WHERE id = $1 AND user_id = $2 AND completed_at IS NULL`,
    [sessionId, req.user.id]
  );

  if (sessionCheck.rowCount === 0) {
    return sendError(res, 'NOT_FOUND', 'Session not found or already completed.', 404);
  }

  const spacedRepDueAt = !is_correct
    ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const { rows } = await query(
    `INSERT INTO quiz_answers (session_id, question_text, correct_answer, user_answer, is_correct, concept_tag, spaced_rep_due_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [sessionId, question_text, correct_answer, user_answer, is_correct, concept_tag || null, spacedRepDueAt]
  );

  return sendSuccess(res, {
    answer: rows[0],
    is_correct,
    explanation: 'Stub explanation — AI will fill this.',
  });
};

export const endQuiz = async (req, res) => {
  const { id: sessionId } = req.params;
  const { time_taken_seconds } = req.body;

  const sessionCheck = await query(
    `SELECT id FROM quiz_sessions WHERE id = $1 AND user_id = $2 AND completed_at IS NULL`,
    [sessionId, req.user.id]
  );

  if (sessionCheck.rowCount === 0) {
    return sendError(res, 'NOT_FOUND', 'Session not found or already completed.', 404);
  }

  const answersResult = await query(
    `SELECT COUNT(*) FILTER (WHERE is_correct = TRUE) AS correct_count, COUNT(*) AS total_count
     FROM quiz_answers WHERE session_id = $1`,
    [sessionId]
  );

  const { correct_count, total_count } = answersResult.rows[0];
  const score = total_count > 0 ? Math.round((correct_count / total_count) * 100) : 0;

  const { rows } = await query(
    `UPDATE quiz_sessions
     SET completed_at = NOW(), score = $1, time_taken_seconds = $2
     WHERE id = $3
     RETURNING *`,
    [score, time_taken_seconds || null, sessionId]
  );

  await redisClient.del(`session:${sessionId}:questions`);

  const answersDetail = await query(
    `SELECT * FROM quiz_answers WHERE session_id = $1 ORDER BY asked_at`,
    [sessionId]
  );

  return sendSuccess(res, {
    session: rows[0],
    score,
    correct: parseInt(correct_count),
    total: parseInt(total_count),
    answers: answersDetail.rows,
  });
};

export const getPerformance = async (req, res) => {
  const { rows } = await query(
    `SELECT
       qa.concept_tag,
       COUNT(*)::INTEGER AS total_answered,
       COUNT(*) FILTER (WHERE qa.is_correct = TRUE)::INTEGER AS correct_count,
       ROUND(
         COUNT(*) FILTER (WHERE qa.is_correct = TRUE)::NUMERIC / NULLIF(COUNT(*), 0) * 100
       )::INTEGER AS accuracy_pct
     FROM quiz_answers qa
     JOIN quiz_sessions qs ON qs.id = qa.session_id
     WHERE qs.user_id = $1 AND qa.concept_tag IS NOT NULL
     GROUP BY qa.concept_tag
     ORDER BY accuracy_pct DESC`,
    [req.user.id]
  );

  return sendSuccess(res, { performance: rows });
};

export const getWeakTopics = async (req, res) => {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { rows } = await query(
    `SELECT
       qa.concept_tag,
       COUNT(*)::INTEGER AS total_answered,
       COUNT(*) FILTER (WHERE qa.is_correct = TRUE)::INTEGER AS correct_count,
       ROUND(
         COUNT(*) FILTER (WHERE qa.is_correct = TRUE)::NUMERIC / NULLIF(COUNT(*), 0) * 100
       )::INTEGER AS accuracy_pct
     FROM quiz_answers qa
     JOIN quiz_sessions qs ON qs.id = qa.session_id
     WHERE qs.user_id = $1
       AND qa.concept_tag IS NOT NULL
       AND qa.asked_at >= $2
     GROUP BY qa.concept_tag
     HAVING COUNT(*) >= 2
     ORDER BY accuracy_pct ASC
     LIMIT 5`,
    [req.user.id, cutoff]
  );

  return sendSuccess(res, { weak_topics: rows });
};

export const getStreak = async (req, res) => {
  const userResult = await query(
    `SELECT streak_days FROM users WHERE id = $1`,
    [req.user.id]
  );

  const currentStreak = userResult.rows[0]?.streak_days ?? 0;

  const last7Result = await query(
    `SELECT DISTINCT DATE(completed_at) AS day
     FROM quiz_sessions
     WHERE user_id = $1
       AND completed_at IS NOT NULL
       AND completed_at >= NOW() - INTERVAL '7 days'`,
    [req.user.id]
  );

  const activeDays = new Set(last7Result.rows.map(r => r.day.toISOString().split('T')[0]));

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return activeDays.has(d.toISOString().split('T')[0]);
  });

  return sendSuccess(res, { current_streak: currentStreak, last_7_days: last7Days });
};

export const getSpacedRepDue = async (req, res) => {
  const { rows } = await query(
    `SELECT qa.*
     FROM quiz_answers qa
     JOIN quiz_sessions qs ON qs.id = qa.session_id
     WHERE qs.user_id = $1
       AND qa.spaced_rep_due_at IS NOT NULL
       AND qa.spaced_rep_due_at <= NOW()
     ORDER BY qa.spaced_rep_due_at ASC`,
    [req.user.id]
  );

  return sendSuccess(res, { due_count: rows.length, items: rows });
};

export const getRoadmap = async (req, res) => {
  const cacheKey = `user:${req.user.id}:roadmap`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    return sendSuccess(res, { roadmap: JSON.parse(cached), cached: true });
  }

  return sendSuccess(res, { roadmap: null, cached: false });
};

export const createUpload = async (req, res) => {
  const { file_name, file_type } = req.body;

  const stubS3Key = `uploads/${req.user.id}/${Date.now()}_${file_name}`;

  const { rows } = await query(
    `INSERT INTO study_uploads (user_id, file_name, s3_key, file_type)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [req.user.id, file_name, stubS3Key, file_type]
  );

  return sendSuccess(res, { upload: rows[0] }, {}, 201);
};

export const listUploads = async (req, res) => {
  const { rows } = await query(
    `SELECT id, file_name, file_type, processed, created_at FROM study_uploads
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [req.user.id]
  );

  return sendSuccess(res, { uploads: rows });
};

export const youtubeStub = async (req, res) => {
  return sendSuccess(res, { transcript: 'stub transcript text' });
};

export const generateRoadmapStub = async (req, res) => {
  return sendSuccess(res, {
    plan: Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      focus: `Day ${i + 1} — Stub Topic`,
      tasks: ['Read chapter', 'Practice problems', 'Review notes'],
    })),
  });
};

export const parseWhatsappStub = async (req, res) => {
  return sendSuccess(res, {
    exams: [{ subject: 'OS', date: '2025-04-08' }],
  });
};
