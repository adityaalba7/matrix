import { Router } from 'express';
import { body, query as qv } from 'express-validator';
import authMiddleware from '../middleware/auth.js';
import {
  logExpense,
  listExpenses,
  editExpense,
  deleteExpense,
  getSummary,
  getPrediction,
  listGoals,
  createGoal,
  updateGoalProgress,
  parseSms,
  parseReceipt,
  parseVoice,
  roast,
} from '../controllers/finance.controller.js';

const router = Router();

router.use(authMiddleware);

const VALID_CATEGORIES = ['food', 'transport', 'study', 'fun', 'bills', 'other'];
const VALID_SOURCES = ['manual', 'voice', 'receipt_scan', 'upi_sms'];

const expenseCreateRules = [
  body('amount_paise')
    .notEmpty().withMessage('amount_paise is required.')
    .isInt({ min: 1 }).withMessage('amount_paise must be a positive integer.'),
  body('category')
    .optional()
    .isIn(VALID_CATEGORIES).withMessage(`category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('source')
    .optional()
    .isIn(VALID_SOURCES).withMessage(`source must be one of: ${VALID_SOURCES.join(', ')}`),
  body('merchant')
    .optional().trim().isLength({ max: 200 }).withMessage('merchant must be at most 200 characters.'),
  body('upi_ref')
    .optional().trim().isLength({ max: 100 }).withMessage('upi_ref must be at most 100 characters.'),
  body('logged_at')
    .optional().isISO8601().withMessage('logged_at must be a valid ISO 8601 datetime.'),
];

const expenseEditRules = [
  body('amount_paise')
    .optional()
    .isInt({ min: 1 }).withMessage('amount_paise must be a positive integer.'),
  body('category')
    .optional()
    .isIn(VALID_CATEGORIES).withMessage(`category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('merchant')
    .optional().trim().isLength({ max: 200 }),
];

const goalCreateRules = [
  body('title')
    .trim().notEmpty().withMessage('title is required.')
    .isLength({ max: 200 }).withMessage('title must be at most 200 characters.'),
  body('target_amount_paise')
    .notEmpty().withMessage('target_amount_paise is required.')
    .isInt({ min: 1 }).withMessage('target_amount_paise must be a positive integer.'),
  body('target_date')
    .optional().isISO8601().withMessage('target_date must be a valid date.'),
];

const goalProgressRules = [
  body('saved_amount_paise')
    .notEmpty().withMessage('saved_amount_paise is required.')
    .isInt({ min: 0 }).withMessage('saved_amount_paise must be a non-negative integer.'),
];

router.post('/expenses',              expenseCreateRules,  logExpense);
router.get('/expenses',                                    listExpenses);
router.patch('/expenses/:id',         expenseEditRules,    editExpense);
router.delete('/expenses/:id',                             deleteExpense);
router.get('/summary',                                     getSummary);
router.get('/prediction',                                  getPrediction);
router.get('/goals',                                       listGoals);
router.post('/goals',                 goalCreateRules,     createGoal);
router.patch('/goals/:id/progress',   goalProgressRules,   updateGoalProgress);
router.post('/parse/sms',                                  parseSms);
router.post('/parse/receipt',                              parseReceipt);
router.post('/parse/voice',                                parseVoice);
router.get('/roast',                                       roast);

export default router;
