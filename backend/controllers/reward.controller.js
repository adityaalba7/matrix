const rewardService = require('../services/reward.service');

/**
 * Reward Controller - Handles all reward-related HTTP requests
 */
class RewardController {
  /**
   * Get user's reward summary
   * GET /api/rewards/summary
   */
  async getRewardSummary(req, res) {
    try {
      const userId = req.user.id;

      const summary = await rewardService.getUserRewardSummary(userId);

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      console.error('Error getting reward summary:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get reward summary',
        error: error.message,
      });
    }
  }

  /**
   * Get user's achievements
   * GET /api/rewards/achievements
   */
  async getUserAchievements(req, res) {
    try {
      const userId = req.user.id;

      const achievements = await rewardService.getUserAchievements(userId);

      res.json({
        success: true,
        data: achievements,
      });
    } catch (error) {
      console.error('Error getting user achievements:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get achievements',
        error: error.message,
      });
    }
  }

  /**
   * Get user's rewards
   * GET /api/rewards/my-rewards
   */
  async getUserRewards(req, res) {
    try {
      const userId = req.user.id;

      const rewards = await rewardService.getUserRewards(userId);

      res.json({
        success: true,
        data: rewards,
      });
    } catch (error) {
      console.error('Error getting user rewards:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get rewards',
        error: error.message,
      });
    }
  }

  /**
   * Get available rewards
   * GET /api/rewards/available
   */
  async getAvailableRewards(req, res) {
    try {
      const { category } = req.query;

      const rewards = await rewardService.getAvailableRewards(category);

      res.json({
        success: true,
        data: rewards,
      });
    } catch (error) {
      console.error('Error getting available rewards:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get available rewards',
        error: error.message,
      });
    }
  }

  /**
   * Purchase a reward
   * POST /api/rewards/purchase
   */
  async purchaseReward(req, res) {
    try {
      const userId = req.user.id;
      const { rewardId } = req.body;

      if (!rewardId) {
        return res.status(400).json({
          success: false,
          message: 'Reward ID is required',
        });
      }

      const result = await rewardService.purchaseReward(userId, rewardId);

      res.json({
        success: true,
        data: result,
        message: 'Reward purchased successfully',
      });
    } catch (error) {
      console.error('Error purchasing reward:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to purchase reward',
      });
    }
  }

  /**
   * Equip a reward
   * POST /api/rewards/equip
   */
  async equipReward(req, res) {
    try {
      const userId = req.user.id;
      const { rewardId } = req.body;

      if (!rewardId) {
        return res.status(400).json({
          success: false,
          message: 'Reward ID is required',
        });
      }

      await rewardService.equipReward(userId, rewardId);

      res.json({
        success: true,
        message: 'Reward equipped successfully',
      });
    } catch (error) {
      console.error('Error equipping reward:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to equip reward',
      });
    }
  }

  /**
   * Get leaderboard
   * GET /api/rewards/leaderboard
   */
  async getLeaderboard(req, res) {
    try {
      const { type = 'overall', limit = 10 } = req.query;

      const leaderboard = await rewardService.getLeaderboard(type, parseInt(limit));

      res.json({
        success: true,
        data: leaderboard,
      });
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get leaderboard',
        error: error.message,
      });
    }
  }

  /**
   * Get user's rank on leaderboard
   * GET /api/rewards/my-rank
   */
  async getUserRank(req, res) {
    try {
      const userId = req.user.id;
      const { type = 'overall' } = req.query;

      const rank = await rewardService.getUserRank(userId, type);

      res.json({
        success: true,
        data: { rank },
      });
    } catch (error) {
      console.error('Error getting user rank:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user rank',
        error: error.message,
      });
    }
  }

  /**
   * Get user's challenges
   * GET /api/rewards/challenges
   */
  async getUserChallenges(req, res) {
    try {
      const userId = req.user.id;

      const summary = await rewardService.getUserRewardSummary(userId);

      res.json({
        success: true,
        data: summary.challenges,
      });
    } catch (error) {
      console.error('Error getting user challenges:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get challenges',
        error: error.message,
      });
    }
  }

  /**
   * Get today's daily tasks
   * GET /api/rewards/daily-tasks
   */
  async getDailyTasks(req, res) {
    try {
      const userId = req.user.id;

      const summary = await rewardService.getUserRewardSummary(userId);

      res.json({
        success: true,
        data: summary.dailyTasks,
      });
    } catch (error) {
      console.error('Error getting daily tasks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get daily tasks',
        error: error.message,
      });
    }
  }

  /**
   * Complete a daily task
   * POST /api/rewards/daily-tasks/complete
   */
  async completeDailyTask(req, res) {
    try {
      const userId = req.user.id;
      const { dailyTaskId } = req.body;

      if (!dailyTaskId) {
        return res.status(400).json({
          success: false,
          message: 'Daily task ID is required',
        });
      }

      const result = await rewardService.completeDailyTask(userId, dailyTaskId);

      res.json({
        success: true,
        data: result,
        message: 'Daily task completed successfully',
      });
    } catch (error) {
      console.error('Error completing daily task:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to complete daily task',
      });
    }
  }

  /**
   * Create a friend challenge
   * POST /api/rewards/friend-challenge
   */
  async createFriendChallenge(req, res) {
    try {
      const userId = req.user.id;
      const { challengedUsername, quizSessionId } = req.body;

      if (!challengedUsername) {
        return res.status(400).json({
          success: false,
          message: 'Challenged username is required',
        });
      }

      // Find challenged user by username
      const { pool } = require('../db');
      const userResult = await pool.query(
        'SELECT id FROM users WHERE name = $1',
        [challengedUsername]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const challengedId = userResult.rows[0].id;

      const challenge = await rewardService.createFriendChallenge(
        userId,
        challengedId,
        quizSessionId
      );

      res.json({
        success: true,
        data: challenge,
        message: 'Friend challenge created successfully',
      });
    } catch (error) {
      console.error('Error creating friend challenge:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create friend challenge',
        error: error.message,
      });
    }
  }

  /**
   * Accept a friend challenge
   * POST /api/rewards/friend-challenge/accept
   */
  async acceptFriendChallenge(req, res) {
    try {
      const userId = req.user.id;
      const { challengeId } = req.body;

      if (!challengeId) {
        return res.status(400).json({
          success: false,
          message: 'Challenge ID is required',
        });
      }

      const challenge = await rewardService.acceptFriendChallenge(
        challengeId,
        userId
      );

      res.json({
        success: true,
        data: challenge,
        message: 'Friend challenge accepted',
      });
    } catch (error) {
      console.error('Error accepting friend challenge:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to accept friend challenge',
      });
    }
  }

  /**
   * Complete a friend challenge
   * POST /api/rewards/friend-challenge/complete
   */
  async completeFriendChallenge(req, res) {
    try {
      const { challengeId, challengerScore, challengedScore } = req.body;

      if (!challengeId || challengerScore === undefined || challengedScore === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Challenge ID and both scores are required',
        });
      }

      const challenge = await rewardService.completeFriendChallenge(challengeId, {
        challengerScore,
        challengedScore,
      });

      res.json({
        success: true,
        data: challenge,
        message: 'Friend challenge completed',
      });
    } catch (error) {
      console.error('Error completing friend challenge:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to complete friend challenge',
        error: error.message,
      });
    }
  }

  /**
   * Get pending friend challenges
   * GET /api/rewards/friend-challenge/pending
   */
  async getPendingFriendChallenges(req, res) {
    try {
      const userId = req.user.id;

      const { pool } = require('../db');
      const result = await pool.query(
        `SELECT fc.*, u.name as challenger_name
         FROM friend_challenges fc
         JOIN users u ON fc.challenger_id = u.id
         WHERE fc.challenged_id = $1 AND fc.status = 'pending'
         ORDER BY fc.created_at DESC`,
        [userId]
      );

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error('Error getting pending friend challenges:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get pending friend challenges',
        error: error.message,
      });
    }
  }

  /**
   * Get recent friend challenges
   * GET /api/rewards/friend-challenge/recent
   */
  async getRecentFriendChallenges(req, res) {
    try {
      const userId = req.user.id;

      const { pool } = require('../db');
      const result = await pool.query(
        `SELECT fc.*,
           u1.name as challenger_name,
           u2.name as challenged_name
         FROM friend_challenges fc
         JOIN users u1 ON fc.challenger_id = u1.id
         JOIN users u2 ON fc.challenged_id = u2.id
         WHERE (fc.challenger_id = $1 OR fc.challenged_id = $1)
           AND fc.status IN ('completed', 'accepted')
         ORDER BY fc.created_at DESC
         LIMIT 10`,
        [userId]
      );

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error('Error getting recent friend challenges:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get recent friend challenges',
        error: error.message,
      });
    }
  }

  /**
   * Award XP (internal endpoint, called by other controllers)
   * POST /api/rewards/award-xp
   */
  async awardXP(req, res) {
    try {
      const { amount, sourceType, sourceId, description } = req.body;

      if (!amount || !sourceType) {
        return res.status(400).json({
          success: false,
          message: 'Amount and source type are required',
        });
      }

      const userId = req.user.id;

      const result = await rewardService.awardXP(
        userId,
        amount,
        sourceType,
        sourceId,
        description
      );

      res.json({
        success: true,
        data: result,
        message: 'XP awarded successfully',
      });
    } catch (error) {
      console.error('Error awarding XP:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to award XP',
        error: error.message,
      });
    }
  }

  /**
   * Update streak (internal endpoint)
   * POST /api/rewards/update-streak
   */
  async updateStreak(req, res) {
    try {
      const userId = req.user.id;

      const result = await rewardService.updateStreak(userId);

      res.json({
        success: true,
        data: result,
        message: 'Streak updated successfully',
      });
    } catch (error) {
      console.error('Error updating streak:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update streak',
        error: error.message,
      });
    }
  }

  /**
   * Check and unlock achievements (internal endpoint)
   * POST /api/rewards/check-achievements
   */
  async checkAchievements(req, res) {
    try {
      const { category, userData } = req.body;

      if (!category || !userData) {
        return res.status(400).json({
          success: false,
          message: 'Category and user data are required',
        });
      }

      const userId = req.user.id;

      const unlockedAchievements = await rewardService.checkAchievements(
        userId,
        category,
        userData
      );

      res.json({
        success: true,
        data: unlockedAchievements,
        message: `${unlockedAchievements.length} achievement(s) unlocked`,
      });
    } catch (error) {
      console.error('Error checking achievements:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check achievements',
        error: error.message,
      });
    }
  }
}

module.exports = new RewardController();
