import { Router } from 'express';
import { body } from 'express-validator';
import authMiddleware from '../middleware/auth.js';
import {
  startSession,
  submitAnswer,
  endSession,
  listSessions,
  getSessionDetail,
  getPerformance,
  getFillerStats,
  transcribeAudio,
  jdAnalyze,
  salaryRoleplay,
} from '../controllers/interview.controller.js';

const router = Router();

// Wrap every async handler — prevents "Network Error" from unhandled promise rejections
const ca = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(authMiddleware);

const startSessionRules = [
  body('domain').notEmpty().withMessage('domain is required.').isString(),
  body('round_type').notEmpty().withMessage('round_type is required.').isString(),
  body('company_target')
    .optional().trim().isLength({ max: 100 }).withMessage('company_target must be at most 100 characters.'),
  body('total_questions')
    .optional().isInt({ min: 1, max: 20 }).withMessage('total_questions must be between 1 and 20.'),
];

const submitAnswerRules = [
  body('answer_text').notEmpty().withMessage('answer_text is required.'),
  body('question_text').notEmpty().withMessage('question_text is required.'),
  body('question_index')
    .notEmpty().withMessage('question_index is required.')
    .isInt({ min: 0 }).withMessage('question_index must be a non-negative integer.'),
  body('audio_s3_key').optional().isString(),
];

const salaryRules = [
  body('message').notEmpty().withMessage('message is required.'),
];

router.post('/sessions',                startSessionRules,  ca(startSession));
router.post('/sessions/:id/answer',     submitAnswerRules,  ca(submitAnswer));
router.post('/sessions/:id/end',                            ca(endSession));
router.get('/sessions',                                     ca(listSessions));
router.get('/sessions/:id',                                 ca(getSessionDetail));
router.get('/performance',                                  ca(getPerformance));
router.get('/filler-stats',                                 ca(getFillerStats));
router.post('/voice/transcribe',                            ca(transcribeAudio));
router.post('/salary-roleplay/message', salaryRules,        ca(salaryRoleplay));
router.post('/jd-analyze',              [body('jd_text').notEmpty()], ca(jdAnalyze));

export default router;
