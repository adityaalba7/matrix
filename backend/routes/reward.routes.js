const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/reward.controller');
const authMiddleware = require('../middleware/auth');

// All reward routes require authentication
router.use(authMiddleware);

// Reward summary and stats
router.get('/summary', rewardController.getRewardSummary);
router.get('/achievements', rewardController.getUserAchievements);
router.get('/my-rewards', rewardController.getUserRewards);
router.get('/available', rewardController.getAvailableRewards);

// Reward actions
router.post('/purchase', rewardController.purchaseReward);
router.post('/equip', rewardController.equipReward);

// Leaderboard
router.get('/leaderboard', rewardController.getLeaderboard);
router.get('/my-rank', rewardController.getUserRank);

// Challenges
router.get('/challenges', rewardController.getUserChallenges);

// Daily tasks
router.get('/daily-tasks', rewardController.getDailyTasks);
router.post('/daily-tasks/complete', rewardController.completeDailyTask);

// Friend challenges
router.post('/friend-challenge', rewardController.createFriendChallenge);
router.post('/friend-challenge/accept', rewardController.acceptFriendChallenge);
router.post('/friend-challenge/complete', rewardController.completeFriendChallenge);
router.get('/friend-challenge/pending', rewardController.getPendingFriendChallenges);
router.get('/friend-challenge/recent', rewardController.getRecentFriendChallenges);

// Internal endpoints (called by other controllers)
router.post('/award-xp', rewardController.awardXP);
router.post('/update-streak', rewardController.updateStreak);
router.post('/check-achievements', rewardController.checkAchievements);

module.exports = router;
