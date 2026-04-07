import { Router } from 'express';
import { body } from 'express-validator';
import authMiddleware from '../middleware/auth.js';
import {
  startQuiz,
  answerQuestion,
  endQuiz,
  getPerformance,
  getWeakTopics,
  getStreak,
  getSpacedRepDue,
  getRoadmap,
  createUpload,
  listUploads,
  youtubeStub,
  generateRoadmapStub,
  parseWhatsappStub,
} from '../controllers/study.controller.js';

const router = Router();

router.use(authMiddleware);

const VALID_SOURCE_TYPES = ['pdf', 'youtube', 'text', 'topic'];
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];
const VALID_FILE_TYPES = ['pdf', 'image', 'text'];

const startQuizRules = [
  body('source_type')
    .notEmpty().withMessage('source_type is required.')
    .isIn(VALID_SOURCE_TYPES).withMessage(`source_type must be one of: ${VALID_SOURCE_TYPES.join(', ')}.`),
  body('total_questions')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('total_questions must be between 1 and 50.'),
  body('difficulty')
    .optional()
    .isIn(VALID_DIFFICULTIES).withMessage(`difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}.`),
  body('subject')
    .optional().trim().isLength({ max: 100 }).withMessage('subject must be at most 100 characters.'),
];

const answerRules = [
  body('question_text').notEmpty().withMessage('question_text is required.'),
  body('correct_answer').notEmpty().withMessage('correct_answer is required.'),
  body('user_answer').notEmpty().withMessage('user_answer is required.'),
  body('is_correct')
    .isBoolean().withMessage('is_correct must be a boolean.'),
  body('concept_tag')
    .optional().trim().isLength({ max: 100 }),
];

const endQuizRules = [
  body('time_taken_seconds')
    .optional()
    .isInt({ min: 0 }).withMessage('time_taken_seconds must be a non-negative integer.'),
];

const uploadRules = [
  body('file_name').notEmpty().withMessage('file_name is required.').trim(),
  body('file_type')
    .notEmpty().withMessage('file_type is required.')
    .isIn(VALID_FILE_TYPES).withMessage(`file_type must be one of: ${VALID_FILE_TYPES.join(', ')}.`),
];

router.post('/quiz/start',              startQuizRules,   startQuiz);
router.post('/quiz/:id/answer',         answerRules,      answerQuestion);
router.post('/quiz/:id/end',            endQuizRules,     endQuiz);
router.get('/performance',                                getPerformance);
router.get('/weak-topics',                                getWeakTopics);
router.get('/streak',                                     getStreak);
router.get('/spaced-rep/due',                             getSpacedRepDue);
router.get('/roadmap',                                    getRoadmap);
router.post('/uploads',                 uploadRules,      createUpload);
router.get('/uploads',                                    listUploads);
router.post('/youtube',                                   youtubeStub);
router.post('/roadmap/generate',                          generateRoadmapStub);
router.post('/parse/whatsapp',                            parseWhatsappStub);

export default router;
