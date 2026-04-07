import { Router } from 'express';
import { body } from 'express-validator';
import authMiddleware from '../middleware/auth.js';
import {
  getProfile,
  updateGitHubUsername,
  updateLeetCodeUsername,
  refreshGitHubData,
  refreshLeetCodeData,
  removeGitHubUsername,
  removeLeetCodeUsername,
  getPublicProfile,
} from '../controllers/profile.controller.js';

const router = Router();

router.use(authMiddleware);

const githubUsernameRules = [
  body('github_username')
    .optional()
    .trim()
    .isLength({ min: 1, max: 39 })
    .withMessage('GitHub username must be between 1 and 39 characters.')
    .matches(/^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i)
    .withMessage('Invalid GitHub username format.'),
];

const leetcodeUsernameRules = [
  body('leetcode_username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('LeetCode username must be between 3 and 20 characters.')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Invalid LeetCode username format.'),
];

// Profile endpoints
router.get('/', getProfile);

// GitHub endpoints
router.patch('/github', githubUsernameRules, updateGitHubUsername);
router.post('/github/refresh', refreshGitHubData);
router.delete('/github', removeGitHubUsername);

// LeetCode endpoints
router.patch('/leetcode', leetcodeUsernameRules, updateLeetCodeUsername);
router.post('/leetcode/refresh', refreshLeetCodeData);
router.delete('/leetcode', removeLeetCodeUsername);

// Public profile (no auth required)
export const publicRouter = Router();
publicRouter.get('/public/:username', getPublicProfile);

export default router;
