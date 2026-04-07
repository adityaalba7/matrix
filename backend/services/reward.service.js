const { Pool } = require('pg');
const redis = require('../redis');

/**
 * Reward Service - Handles all reward-related business logic
 */
class RewardService {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  /**
   * Award XP to a user
   * @param {string} userId - User ID
   * @param {number} amount - XP amount to award
   * @param {string} sourceType - Source type (quiz, interview, challenge, etc.)
   * @param {string} sourceId - Source ID
   * @param {string} description - Description of the XP award
   */
  async awardXP(userId, amount, sourceType, sourceId = null, description = '') {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Add XP transaction
      const xpResult = await client.query(
        `INSERT INTO xp_transactions (user_id, amount, transaction_type, source_type, source_id, description)
         VALUES ($1, $2, 'earned', $3, $4, $5)
         RETURNING id`,
        [userId, amount, sourceType, sourceId, description]
      );

      // Update user's total XP
      await client.query(
        `UPDATE users
         SET total_xp = total_xp + $1
         WHERE id = $2`,
        [amount, userId]
      );

      // Calculate and update level
      const userResult = await client.query(
        `SELECT total_xp, level FROM users WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length > 0) {
        const { total_xp, level } = userResult.rows[0];
        const newLevel = this.calculateLevel(total_xp);

        if (newLevel > level) {
          await client.query(
            `UPDATE users SET level = $1 WHERE id = $2`,
            [newLevel, userId]
          );
        }
      }

      await client.query('COMMIT');

      // Cache user XP in Redis
      const cacheKey = `user:${userId}:xp`;
      await redis.setex(cacheKey, 3600, amount.toString());

      return { success: true, xpTransactionId: xpResult.rows[0].id };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error awarding XP:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Spend XP from a user
   * @param {string} userId - User ID
   * @param {number} amount - XP amount to spend
   * @param {string} sourceType - Source type
   * @param {string} sourceId - Source ID
   * @param {string} description - Description
   */
  async spendXP(userId, amount, sourceType, sourceId = null, description = '') {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Check if user has enough XP
      const userResult = await client.query(
        `SELECT total_xp FROM users WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length === 0 || userResult.rows[0].total_xp < amount) {
        throw new Error('Insufficient XP');
      }

      // Add XP transaction
      await client.query(
        `INSERT INTO xp_transactions (user_id, amount, transaction_type, source_type, source_id, description)
         VALUES ($1, $2, 'spent', $3, $4, $5)`,
        [userId, amount, sourceType, sourceId, description]
      );

      // Update user's total XP
      await client.query(
        `UPDATE users
         SET total_xp = total_xp - $1
         WHERE id = $2`,
        [amount, userId]
      );

      await client.query('COMMIT');

      // Update cache
      const cacheKey = `user:${userId}:xp`;
      await redis.del(cacheKey);

      return { success: true };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error spending XP:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Calculate level based on total XP
   * Level formula: Level = floor(sqrt(XP / 100)) + 1
   * @param {number} totalXP - Total XP
   * @returns {number} Level
   */
  calculateLevel(totalXP) {
    return Math.floor(Math.sqrt(totalXP / 100)) + 1;
  }

  /**
   * Get XP required for next level
   * @param {number} currentLevel - Current level
   * @returns {number} XP required
   */
  getXPForNextLevel(currentLevel) {
    return Math.pow(currentLevel, 2) * 100;
  }

  /**
   * Check and unlock achievements
   * @param {string} userId - User ID
   * @param {string} category - Achievement category
   * @param {object} userData - User data for achievement checking
   */
  async checkAchievements(userId, category, userData) {
    try {
      // Get all active achievements for the category
      const achievementsResult = await this.pool.query(
        `SELECT * FROM achievements
         WHERE category = $1 AND is_active = true`,
        [category]
      );

      const unlockedAchievements = [];

      for (const achievement of achievementsResult.rows) {
        // Check if user already has this achievement
        const hasAchievement = await this.pool.query(
          `SELECT id FROM user_achievements
           WHERE user_id = $1 AND achievement_id = $2`,
          [userId, achievement.id]
        );

        if (hasAchievement.rows.length > 0) {
          continue;
        }

        // Check if achievement requirements are met
        if (this.checkAchievementRequirements(achievement, userData)) {
          // Unlock achievement
          const unlockResult = await this.pool.query(
            `INSERT INTO user_achievements (user_id, achievement_id, progress)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [userId, achievement.id, JSON.stringify(userData)]
          );

          // Award XP for achievement
          if (achievement.xp_reward > 0) {
            await this.awardXP(
              userId,
              achievement.xp_reward,
              'achievement',
              achievement.id,
              `Achievement unlocked: ${achievement.name}`
            );
          }

          unlockedAchievements.push({
            id: unlockResult.rows[0].id,
            achievement: achievement,
          });
        }
      }

      return unlockedAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  }

  /**
   * Check if achievement requirements are met
   * @param {object} achievement - Achievement object
   * @param {object} userData - User data
   * @returns {boolean} Whether requirements are met
   */
  checkAchievementRequirements(achievement, userData) {
    const { requirement_type, requirement_value } = achievement;

    switch (requirement_type) {
      case 'quiz_score':
        return userData.quizScore >= requirement_value.min_score;
      case 'quiz_count':
        return userData.quizCount >= requirement_value.min_count;
      case 'streak_days':
        return userData.streakDays >= requirement_value.min_days;
      case 'interview_score':
        return userData.interviewScore >= requirement_value.min_score;
      case 'budget_adherence':
        return userData.budgetAdherence >= requirement_value.min_percentage;
      case 'total_xp':
        return userData.totalXP >= requirement_value.min_xp;
      default:
        return false;
    }
  }

  /**
   * Update user streak
   * @param {string} userId - User ID
   */
  async updateStreak(userId) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const today = new Date().toISOString().split('T')[0];

      // Get user's current streak data
      const userResult = await client.query(
        `SELECT current_streak, longest_streak, last_activity_date FROM users WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const { current_streak, longest_streak, last_activity_date } = userResult.rows[0];
      let newStreak = current_streak;
      let newLongestStreak = longest_streak;

      if (last_activity_date) {
        const lastDate = new Date(last_activity_date);
        const todayDate = new Date(today);
        const diffTime = Math.abs(todayDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day
          newStreak = current_streak + 1;
        } else if (diffDays > 1) {
          // Streak broken
          newStreak = 1;
        }
        // If diffDays === 0, same day, no change
      } else {
        // First activity
        newStreak = 1;
      }

      if (newStreak > newLongestStreak) {
        newLongestStreak = newStreak;
      }

      // Update user
      await client.query(
        `UPDATE users
         SET current_streak = $1, longest_streak = $2, last_activity_date = $3
         WHERE id = $4`,
        [newStreak, newLongestStreak, today, userId]
      );

      await client.query('COMMIT');

      return {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating streak:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get user's reward summary
   * @param {string} userId - User ID
   */
  async getUserRewardSummary(userId) {
    try {
      // Get user data
      const userResult = await this.pool.query(
        `SELECT total_xp, level, current_streak, longest_streak, trimind_score FROM users WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const userData = userResult.rows[0];

      // Get achievements count
      const achievementsResult = await this.pool.query(
        `SELECT COUNT(*) as count FROM user_achievements WHERE user_id = $1`,
        [userId]
      );

      // Get rewards count
      const rewardsResult = await this.pool.query(
        `SELECT COUNT(*) as count FROM user_rewards WHERE user_id = $1`,
        [userId]
      );

      // Get active challenges
      const challengesResult = await this.pool.query(
        `SELECT uc.*, c.name, c.description, c.xp_reward, c.type
         FROM user_challenges uc
         JOIN challenges c ON uc.challenge_id = c.id
         WHERE uc.user_id = $1 AND uc.status = 'in_progress'
         ORDER BY c.created_at DESC`,
        [userId]
      );

      // Get today's daily tasks
      const today = new Date().toISOString().split('T')[0];
      const dailyTasksResult = await this.pool.query(
        `SELECT udt.*, dt.name, dt.description, dt.xp_reward, dt.category
         FROM user_daily_tasks udt
         JOIN daily_tasks dt ON udt.daily_task_id = dt.id
         WHERE udt.user_id = $1 AND udt.task_date = $2
         ORDER BY dt.created_at`,
        [userId, today]
      );

      // Get XP for next level
      const xpForNextLevel = this.getXPForNextLevel(userData.level);
      const xpProgress = (userData.total_xp / xpForNextLevel) * 100;

      return {
        user: {
          totalXP: userData.total_xp,
          level: userData.level,
          currentStreak: userData.current_streak,
          longestStreak: userData.longest_streak,
          trimindScore: userData.trimind_score,
          xpForNextLevel,
          xpProgress: Math.min(xpProgress, 100),
        },
        stats: {
          achievementsUnlocked: parseInt(achievementsResult.rows[0].count),
          rewardsEarned: parseInt(rewardsResult.rows[0].count),
        },
        challenges: challengesResult.rows,
        dailyTasks: dailyTasksResult.rows,
      };
    } catch (error) {
      console.error('Error getting user reward summary:', error);
      throw error;
    }
  }

  /**
   * Get leaderboard
   * @param {string} type - Leaderboard type (daily, weekly, monthly, overall)
   * @param {number} limit - Number of entries to return
   */
  async getLeaderboard(type = 'overall', limit = 10) {
    try {
      let query;
      let params = [limit];

      switch (type) {
        case 'daily':
          query = `
            SELECT u.id, u.name, u.total_xp, u.level, u.current_streak,
                   COALESCE(l.score, 0) as score, COALESCE(l.rank, 0) as rank
            FROM users u
            LEFT JOIN leaderboard l ON u.id = l.user_id AND l.leaderboard_type = 'daily'
            ORDER BY l.score DESC NULLS LAST, u.total_xp DESC
            LIMIT $1
          `;
          break;
        case 'weekly':
          query = `
            SELECT u.id, u.name, u.total_xp, u.level, u.current_streak,
                   COALESCE(l.score, 0) as score, COALESCE(l.rank, 0) as rank
            FROM users u
            LEFT JOIN leaderboard l ON u.id = l.user_id AND l.leaderboard_type = 'weekly'
            ORDER BY l.score DESC NULLS LAST, u.total_xp DESC
            LIMIT $1
          `;
          break;
        case 'monthly':
          query = `
            SELECT u.id, u.name, u.total_xp, u.level, u.current_streak,
                   COALESCE(l.score, 0) as score, COALESCE(l.rank, 0) as rank
            FROM users u
            LEFT JOIN leaderboard l ON u.id = l.user_id AND l.leaderboard_type = 'monthly'
            ORDER BY l.score DESC NULLS LAST, u.total_xp DESC
            LIMIT $1
          `;
          break;
        default: // overall
          query = `
            SELECT u.id, u.name, u.total_xp, u.level, u.current_streak,
                   u.trimind_score as score
            FROM users u
            WHERE u.total_xp > 0
            ORDER BY u.total_xp DESC
            LIMIT $1
          `;
          break;
      }

      const result = await this.pool.query(query, params);

      // Add rank if not present
      const leaderboard = result.rows.map((row, index) => ({
        ...row,
        rank: row.rank || index + 1,
      }));

      return leaderboard;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }

  /**
   * Get user's rank on leaderboard
   * @param {string} userId - User ID
   * @param {string} type - Leaderboard type
   */
  async getUserRank(userId, type = 'overall') {
    try {
      let query;
      let params = [userId];

      switch (type) {
        case 'daily':
          query = `
            SELECT COALESCE(l.rank, 0) as rank
            FROM leaderboard l
            WHERE l.user_id = $1 AND l.leaderboard_type = 'daily'
          `;
          break;
        case 'weekly':
          query = `
            SELECT COALESCE(l.rank, 0) as rank
            FROM leaderboard l
            WHERE l.user_id = $1 AND l.leaderboard_type = 'weekly'
          `;
          break;
        case 'monthly':
          query = `
            SELECT COALESCE(l.rank, 0) as rank
            FROM leaderboard l
            WHERE l.user_id = $1 AND l.leaderboard_type = 'monthly'
          `;
          break;
        default: // overall
          query = `
            SELECT COUNT(*) + 1 as rank
            FROM users u
            WHERE u.total_xp > (SELECT total_xp FROM users WHERE id = $1)
          `;
          break;
      }

      const result = await this.pool.query(query, params);

      return result.rows[0]?.rank || 0;
    } catch (error) {
      console.error('Error getting user rank:', error);
      throw error;
    }
  }

  /**
   * Complete a daily task
   * @param {string} userId - User ID
   * @param {string} dailyTaskId - Daily task ID
   */
  async completeDailyTask(userId, dailyTaskId) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const today = new Date().toISOString().split('T')[0];

      // Check if task exists and is not already completed
      const taskResult = await client.query(
        `SELECT udt.*, dt.xp_reward
         FROM user_daily_tasks udt
         JOIN daily_tasks dt ON udt.daily_task_id = dt.id
         WHERE udt.user_id = $1 AND udt.daily_task_id = $2 AND udt.task_date = $3`,
        [userId, dailyTaskId, today]
      );

      if (taskResult.rows.length === 0) {
        throw new Error('Task not found or already completed');
      }

      const task = taskResult.rows[0];

      if (task.status === 'completed') {
        throw new Error('Task already completed');
      }

      // Update task status
      await client.query(
        `UPDATE user_daily_tasks
         SET status = 'completed', completed_at = NOW()
         WHERE id = $1`,
        [task.id]
      );

      // Award XP
      if (task.xp_reward > 0) {
        await this.awardXP(
          userId,
          task.xp_reward,
          'daily_task',
          dailyTaskId,
          `Daily task completed`
        );
      }

      await client.query('COMMIT');

      return { success: true, xpAwarded: task.xp_reward };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error completing daily task:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Create a friend challenge
   * @param {string} challengerId - Challenger user ID
   * @param {string} challengedId - Challenged user ID
   * @param {string} quizSessionId - Quiz session ID
   */
  async createFriendChallenge(challengerId, challengedId, quizSessionId = null) {
    try {
      const result = await this.pool.query(
        `INSERT INTO friend_challenges (challenger_id, challenged_id, quiz_session_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [challengerId, challengedId, quizSessionId]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating friend challenge:', error);
      throw error;
    }
  }

  /**
   * Accept a friend challenge
   * @param {string} challengeId - Challenge ID
   * @param {string} userId - User ID (the challenged user)
   */
  async acceptFriendChallenge(challengeId, userId) {
    try {
      const result = await this.pool.query(
        `UPDATE friend_challenges
         SET status = 'accepted'
         WHERE id = $1 AND challenged_id = $2 AND status = 'pending'
         RETURNING *`,
        [challengeId, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Challenge not found or cannot be accepted');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error accepting friend challenge:', error);
      throw error;
    }
  }

  /**
   * Complete a friend challenge
   * @param {string} challengeId - Challenge ID
   * @param {object} scores - Scores for both users
   */
  async completeFriendChallenge(challengeId, scores) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const { challengerScore, challengedScore } = scores;

      // Determine winner
      let winnerId = null;
      if (challengerScore > challengedScore) {
        const challenge = await this.pool.query(
          `SELECT challenger_id FROM friend_challenges WHERE id = $1`,
          [challengeId]
        );
        winnerId = challenge.rows[0]?.challenger_id;
      } else if (challengedScore > challengerScore) {
        const challenge = await this.pool.query(
          `SELECT challenged_id FROM friend_challenges WHERE id = $1`,
          [challengeId]
        );
        winnerId = challenge.rows[0]?.challenged_id;
      }

      // Update challenge
      const result = await this.pool.query(
        `UPDATE friend_challenges
         SET status = 'completed',
             challenger_score = $1,
             challenged_score = $2,
             winner_id = $3,
             completed_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [challengerScore, challengedScore, winnerId, challengeId]
      );

      const challenge = result.rows[0];

      // Award XP to winner
      if (winnerId && challenge.xp_reward > 0) {
        await this.awardXP(
          winnerId,
          challenge.xp_reward,
          'friend_challenge',
          challengeId,
          'Won friend challenge'
        );
      }

      await client.query('COMMIT');

      return challenge;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error completing friend challenge:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get user's achievements
   * @param {string} userId - User ID
   */
  async getUserAchievements(userId) {
    try {
      const result = await this.pool.query(
        `SELECT ua.*, a.name, a.description, a.icon_name, a.category, a.xp_reward
         FROM user_achievements ua
         JOIN achievements a ON ua.achievement_id = a.id
         WHERE ua.user_id = $1
         ORDER BY ua.earned_at DESC`,
        [userId]
      );

      return result.rows;
    } catch (error) {
      console.error('Error getting user achievements:', error);
      throw error;
    }
  }

  /**
   * Get user's rewards
   * @param {string} userId - User ID
   */
  async getUserRewards(userId) {
    try {
      const result = await this.pool.query(
        `SELECT ur.*, r.name, r.description, r.icon_name, r.category, r.xp_cost
         FROM user_rewards ur
         JOIN rewards r ON ur.reward_id = r.id
         WHERE ur.user_id = $1
         ORDER BY ur.earned_at DESC`,
        [userId]
      );

      return result.rows;
    } catch (error) {
      console.error('Error getting user rewards:', error);
      throw error;
    }
  }

  /**
   * Get available rewards
   * @param {string} category - Optional category filter
   */
  async getAvailableRewards(category = null) {
    try {
      let query = `SELECT * FROM rewards WHERE is_active = true`;
      let params = [];

      if (category) {
        query += ` AND category = $1`;
        params.push(category);
      }

      query += ` ORDER BY xp_cost ASC`;

      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting available rewards:', error);
      throw error;
    }
  }

  /**
   * Purchase a reward
   * @param {string} userId - User ID
   * @param {string} rewardId - Reward ID
   */
  async purchaseReward(userId, rewardId) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Get reward details
      const rewardResult = await this.pool.query(
        `SELECT * FROM rewards WHERE id = $1 AND is_active = true`,
        [rewardId]
      );

      if (rewardResult.rows.length === 0) {
        throw new Error('Reward not found');
      }

      const reward = rewardResult.rows[0];

      // Check if user already has this reward
      const hasReward = await client.query(
        `SELECT id FROM user_rewards WHERE user_id = $1 AND reward_id = $2`,
        [userId, rewardId]
      );

      if (hasReward.rows.length > 0) {
        throw new Error('Reward already owned');
      }

      // Spend XP
      await this.spendXP(
        userId,
        reward.xp_cost,
        'reward_purchase',
        rewardId,
        `Purchased reward: ${reward.name}`
      );

      // Add reward to user
      const userRewardResult = await client.query(
        `INSERT INTO user_rewards (user_id, reward_id)
         VALUES ($1, $2)
         RETURNING *`,
        [userId, rewardId]
      );

      await client.query('COMMIT');

      return userRewardResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error purchasing reward:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Equip a reward
   * @param {string} userId - User ID
   * @param {string} rewardId - Reward ID
   */
  async equipReward(userId, rewardId) {
    try {
      // Check if user owns this reward
      const userReward = await this.pool.query(
        `SELECT * FROM user_rewards WHERE user_id = $1 AND reward_id = $2`,
        [userId, rewardId]
      );

      if (userReward.rows.length === 0) {
        throw new Error('Reward not owned');
      }

      // Unequip all rewards of the same category
      const reward = await this.pool.query(
        `SELECT category FROM rewards WHERE id = $1`,
        [rewardId]
      );

      if (reward.rows.length > 0) {
        await this.pool.query(
          `UPDATE user_rewards
           SET is_equipped = false
           WHERE user_id = $1 AND reward_id IN (
             SELECT ur.reward_id FROM user_rewards ur
             JOIN rewards r ON ur.reward_id = r.id
             WHERE ur.user_id = $1 AND r.category = $2
           )`,
          [userId, reward.rows[0].category]
        );
      }

      // Equip the selected reward
      await this.pool.query(
        `UPDATE user_rewards
         SET is_equipped = true
         WHERE user_id = $1 AND reward_id = $2`,
        [userId, rewardId]
      );

      return { success: true };
    } catch (error) {
      console.error('Error equipping reward:', error);
      throw error;
    }
  }
}

module.exports = new RewardService();
