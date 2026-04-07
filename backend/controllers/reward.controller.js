import rewardService from '../services/reward.service.js';
import { query } from '../db/index.js';

// All methods are standalone exported functions (ESM-compatible)

export const getRewardSummary = async (req, res) => {
  try {
    const summary = await rewardService.getUserRewardSummary(req.user.id);
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error getting reward summary:', error);
    res.status(500).json({ success: false, message: 'Failed to get reward summary' });
  }
};

export const getUserAchievements = async (req, res) => {
  try {
    const achievements = await rewardService.getUserAchievements(req.user.id);
    res.json({ success: true, data: achievements });
  } catch (error) {
    console.error('Error getting achievements:', error);
    res.status(500).json({ success: false, message: 'Failed to get achievements' });
  }
};

export const getUserRewards = async (req, res) => {
  try {
    const rewards = await rewardService.getUserRewards(req.user.id);
    res.json({ success: true, data: rewards });
  } catch (error) {
    console.error('Error getting rewards:', error);
    res.status(500).json({ success: false, message: 'Failed to get rewards' });
  }
};

export const getAvailableRewards = async (req, res) => {
  try {
    const rewards = await rewardService.getAvailableRewards(req.query.category);
    res.json({ success: true, data: rewards });
  } catch (error) {
    console.error('Error getting available rewards:', error);
    res.status(500).json({ success: false, message: 'Failed to get available rewards' });
  }
};

export const purchaseReward = async (req, res) => {
  try {
    const { rewardId } = req.body;
    if (!rewardId) return res.status(400).json({ success: false, message: 'Reward ID is required' });
    const result = await rewardService.purchaseReward(req.user.id, rewardId);
    res.json({ success: true, data: result, message: 'Reward purchased successfully' });
  } catch (error) {
    console.error('Error purchasing reward:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to purchase reward' });
  }
};

export const equipReward = async (req, res) => {
  try {
    const { rewardId } = req.body;
    if (!rewardId) return res.status(400).json({ success: false, message: 'Reward ID is required' });
    await rewardService.equipReward(req.user.id, rewardId);
    res.json({ success: true, message: 'Reward equipped successfully' });
  } catch (error) {
    console.error('Error equipping reward:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to equip reward' });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { type = 'overall', limit = 10 } = req.query;
    const leaderboard = await rewardService.getLeaderboard(type, parseInt(limit));
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({ success: false, message: 'Failed to get leaderboard' });
  }
};

export const getUserRank = async (req, res) => {
  try {
    const rank = await rewardService.getUserRank(req.user.id, req.query.type || 'overall');
    res.json({ success: true, data: { rank } });
  } catch (error) {
    console.error('Error getting user rank:', error);
    res.status(500).json({ success: false, message: 'Failed to get user rank' });
  }
};

export const getUserChallenges = async (req, res) => {
  try {
    const summary = await rewardService.getUserRewardSummary(req.user.id);
    res.json({ success: true, data: summary.challenges });
  } catch (error) {
    console.error('Error getting challenges:', error);
    res.status(500).json({ success: false, message: 'Failed to get challenges' });
  }
};

export const getDailyTasks = async (req, res) => {
  try {
    const summary = await rewardService.getUserRewardSummary(req.user.id);
    res.json({ success: true, data: summary.dailyTasks });
  } catch (error) {
    console.error('Error getting daily tasks:', error);
    res.status(500).json({ success: false, message: 'Failed to get daily tasks' });
  }
};

export const completeDailyTask = async (req, res) => {
  try {
    const { dailyTaskId } = req.body;
    if (!dailyTaskId) return res.status(400).json({ success: false, message: 'Daily task ID is required' });
    const result = await rewardService.completeDailyTask(req.user.id, dailyTaskId);
    res.json({ success: true, data: result, message: 'Daily task completed' });
  } catch (error) {
    console.error('Error completing daily task:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to complete daily task' });
  }
};

export const createFriendChallenge = async (req, res) => {
  try {
    const { challengedUsername, quizSessionId } = req.body;
    if (!challengedUsername) return res.status(400).json({ success: false, message: 'Challenged username is required' });

    const userResult = await query('SELECT id FROM users WHERE name = $1', [challengedUsername]);
    if (userResult.rowCount === 0) return res.status(404).json({ success: false, message: 'User not found' });

    const challenge = await rewardService.createFriendChallenge(req.user.id, userResult.rows[0].id, quizSessionId);
    res.json({ success: true, data: challenge, message: 'Friend challenge created' });
  } catch (error) {
    console.error('Error creating friend challenge:', error);
    res.status(500).json({ success: false, message: 'Failed to create friend challenge' });
  }
};

export const acceptFriendChallenge = async (req, res) => {
  try {
    const { challengeId } = req.body;
    if (!challengeId) return res.status(400).json({ success: false, message: 'Challenge ID is required' });
    const challenge = await rewardService.acceptFriendChallenge(challengeId, req.user.id);
    res.json({ success: true, data: challenge, message: 'Challenge accepted' });
  } catch (error) {
    console.error('Error accepting challenge:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to accept challenge' });
  }
};

export const completeFriendChallenge = async (req, res) => {
  try {
    const { challengeId, challengerScore, challengedScore } = req.body;
    if (!challengeId || challengerScore === undefined || challengedScore === undefined) {
      return res.status(400).json({ success: false, message: 'Challenge ID and both scores are required' });
    }
    const challenge = await rewardService.completeFriendChallenge(challengeId, { challengerScore, challengedScore });
    res.json({ success: true, data: challenge, message: 'Challenge completed' });
  } catch (error) {
    console.error('Error completing challenge:', error);
    res.status(500).json({ success: false, message: 'Failed to complete challenge' });
  }
};

export const getPendingFriendChallenges = async (req, res) => {
  try {
    const result = await query(
      `SELECT fc.*, u.name as challenger_name FROM friend_challenges fc
       JOIN users u ON fc.challenger_id = u.id
       WHERE fc.challenged_id = $1 AND fc.status = 'pending'
       ORDER BY fc.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error getting pending challenges:', error);
    res.status(500).json({ success: false, message: 'Failed to get pending challenges' });
  }
};

export const getRecentFriendChallenges = async (req, res) => {
  try {
    const result = await query(
      `SELECT fc.*, u1.name as challenger_name, u2.name as challenged_name
       FROM friend_challenges fc
       JOIN users u1 ON fc.challenger_id = u1.id
       JOIN users u2 ON fc.challenged_id = u2.id
       WHERE (fc.challenger_id = $1 OR fc.challenged_id = $1)
         AND fc.status IN ('completed', 'accepted')
       ORDER BY fc.created_at DESC LIMIT 10`,
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error getting recent challenges:', error);
    res.status(500).json({ success: false, message: 'Failed to get recent challenges' });
  }
};

export const awardXP = async (req, res) => {
  try {
    const { amount, sourceType, sourceId, description } = req.body;
    if (!amount || !sourceType) return res.status(400).json({ success: false, message: 'Amount and source type are required' });
    const result = await rewardService.awardXP(req.user.id, amount, sourceType, sourceId, description);
    res.json({ success: true, data: result, message: 'XP awarded' });
  } catch (error) {
    console.error('Error awarding XP:', error);
    res.status(500).json({ success: false, message: 'Failed to award XP' });
  }
};

export const updateStreak = async (req, res) => {
  try {
    const result = await rewardService.updateStreak(req.user.id);
    res.json({ success: true, data: result, message: 'Streak updated' });
  } catch (error) {
    console.error('Error updating streak:', error);
    res.status(500).json({ success: false, message: 'Failed to update streak' });
  }
};

export const checkAchievements = async (req, res) => {
  try {
    const { category, userData } = req.body;
    if (!category || !userData) return res.status(400).json({ success: false, message: 'Category and user data are required' });
    const unlocked = await rewardService.checkAchievements(req.user.id, category, userData);
    res.json({ success: true, data: unlocked, message: `${unlocked.length} achievement(s) unlocked` });
  } catch (error) {
    console.error('Error checking achievements:', error);
    res.status(500).json({ success: false, message: 'Failed to check achievements' });
  }
};
