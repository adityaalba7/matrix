import { validationResult } from 'express-validator';
import { query } from '../db/index.js';
import redisClient from '../db/redis.js';
import { sendSuccess, sendError } from '../utils/response.js';
import {
  fetchCompleteGitHubData,
  validateGitHubUsername,
} from '../utils/github.js';
import {
  fetchCompleteLeetCodeData,
  validateLeetCodeUsername,
  calculateLeetCodeSkillLevel,
} from '../utils/leetcode.js';

const CACHE_TTL_GITHUB = 3600; // 1 hour
const CACHE_TTL_LEETCODE = 1800; // 30 minutes

const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    sendError(res, 'VALIDATION_ERROR', first.msg, 422);
    return false;
  }
  return true;
};

/**
 * Get user profile with GitHub and LeetCode data
 */
export const getProfile = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT
         id, name, email, college, monthly_budget, language_pref,
         trimind_score, streak_days, exam_date, onboarding_goal,
         github_username, leetcode_username,
         github_data, leetcode_data,
         github_fetched_at, leetcode_fetched_at,
         created_at, last_active_at
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return sendError(res, 'USER_NOT_FOUND', 'User not found.', 404);
    }

    const user = rows[0];

    // Parse cached data if exists (postgres JSONB returns object directly)
    const githubData = typeof user.github_data === 'string' ? JSON.parse(user.github_data) : user.github_data;
    const leetcodeData = typeof user.leetcode_data === 'string' ? JSON.parse(user.leetcode_data) : user.leetcode_data;

    // Check if data needs refresh
    const githubNeedsRefresh =
      !githubData ||
      !user.github_fetched_at ||
      new Date(user.github_fetched_at) < new Date(Date.now() - CACHE_TTL_GITHUB * 1000);

    const leetcodeNeedsRefresh =
      !leetcodeData ||
      !user.leetcode_fetched_at ||
      new Date(user.leetcode_fetched_at) < new Date(Date.now() - CACHE_TTL_LEETCODE * 1000);

    return sendSuccess(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        monthly_budget: user.monthly_budget,
        language_pref: user.language_pref,
        trimind_score: user.trimind_score,
        streak_days: user.streak_days,
        exam_date: user.exam_date,
        onboarding_goal: user.onboarding_goal,
        created_at: user.created_at,
        last_active_at: user.last_active_at,
      },
      github: {
        username: user.github_username,
        data: githubData,
        needs_refresh: githubNeedsRefresh && user.github_username,
        fetched_at: user.github_fetched_at,
      },
      leetcode: {
        username: user.leetcode_username,
        data: leetcodeData,
        needs_refresh: leetcodeNeedsRefresh && user.leetcode_username,
        fetched_at: user.leetcode_fetched_at,
      },
    });
  } catch (err) {
    console.error('[Profile] getProfile error:', err);
    return sendError(res, 'INTERNAL_ERROR', 'Failed to fetch profile.', 500);
  }
};

/**
 * Update GitHub username
 */
export const updateGitHubUsername = async (req, res) => {
  if (!checkValidation(req, res)) return;

  const { github_username } = req.body;

  if (!validateGitHubUsername(github_username)) {
    return sendError(res, 'INVALID_USERNAME', 'Invalid GitHub username format.', 400);
  }

  try {
    // Validate username exists on GitHub and fetch data
    const data = await fetchCompleteGitHubData(github_username);

    // Update user record with username and data
    const { rows } = await query(
      `UPDATE users
       SET github_username = $1, github_data = $2, github_fetched_at = NOW(), last_active_at = NOW()
       WHERE id = $3
       RETURNING github_username`,
      [github_username, JSON.stringify(data), req.user.id]
    );

    // Also cache in Redis for faster access
    await redisClient.setEx(
      `user:${req.user.id}:github_data`,
      CACHE_TTL_GITHUB,
      JSON.stringify(data)
    );

    return sendSuccess(res, {
      github_username: rows[0].github_username,
      message: 'GitHub username updated successfully.',
    });
  } catch (err) {
    console.error('[Profile] updateGitHubUsername error:', err);
    if (err.message.includes('not found')) {
      return sendError(res, 'USER_NOT_FOUND', 'GitHub user not found.', 404);
    }
    if (err.message.includes('rate limit')) {
      return sendError(res, 'RATE_LIMITED', 'GitHub API rate limit exceeded. Please try again later.', 429);
    }
    return sendError(res, 'INTERNAL_ERROR', 'Failed to update GitHub username.', 500);
  }
};

/**
 * Update LeetCode username
 */
export const updateLeetCodeUsername = async (req, res) => {
  if (!checkValidation(req, res)) return;

  const { leetcode_username } = req.body;

  if (!validateLeetCodeUsername(leetcode_username)) {
    return sendError(res, 'INVALID_USERNAME', 'Invalid LeetCode username format.', 400);
  }

  try {
    // Validate username exists on LeetCode and fetch data
    const data = await fetchCompleteLeetCodeData(leetcode_username);
    const skillLevel = calculateLeetCodeSkillLevel(data.profile);

    // Update user record with username and data
    const leetcodeData = { ...data, profile: { ...data.profile, skill_level: skillLevel } };
    const { rows } = await query(
      `UPDATE users
       SET leetcode_username = $1, leetcode_data = $2, leetcode_fetched_at = NOW(), last_active_at = NOW()
       WHERE id = $3
       RETURNING leetcode_username`,
      [leetcode_username, JSON.stringify(leetcodeData), req.user.id]
    );

    // Also cache in Redis for faster access
    await redisClient.setEx(
      `user:${req.user.id}:leetcode_data`,
      CACHE_TTL_LEETCODE,
      JSON.stringify(leetcodeData)
    );

    return sendSuccess(res, {
      leetcode_username: rows[0].leetcode_username,
      message: 'LeetCode username updated successfully.',
    });
  } catch (err) {
    console.error('[Profile] updateLeetCodeUsername error:', err);
    if (err.message.includes('not found')) {
      return sendError(res, 'USER_NOT_FOUND', 'LeetCode user not found.', 404);
    }
    return sendError(res, 'INTERNAL_ERROR', 'Failed to update LeetCode username.', 500);
  }
};

/**
 * Refresh GitHub data
 */
export const refreshGitHubData = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT github_username FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (rows.length === 0 || !rows[0].github_username) {
      return sendError(res, 'NO_USERNAME', 'GitHub username not set.', 400);
    }

    const githubUsername = rows[0].github_username;
    const data = await fetchCompleteGitHubData(githubUsername);

    // Update cached data in database
    await query(
      `UPDATE users
       SET github_data = $1, github_fetched_at = NOW(), last_active_at = NOW()
       WHERE id = $2`,
      [JSON.stringify(data), req.user.id]
    );

    // Also cache in Redis for faster access
    await redisClient.setEx(
      `user:${req.user.id}:github_data`,
      CACHE_TTL_GITHUB,
      JSON.stringify(data)
    );

    return sendSuccess(res, {
      data,
      message: 'GitHub data refreshed successfully.',
    });
  } catch (err) {
    console.error('[Profile] refreshGitHubData error:', err);
    if (err.message.includes('not found')) {
      return sendError(res, 'USER_NOT_FOUND', 'GitHub user not found.', 404);
    }
    if (err.message.includes('rate limit')) {
      return sendError(res, 'RATE_LIMITED', 'GitHub API rate limit exceeded. Please try again later.', 429);
    }
    return sendError(res, 'INTERNAL_ERROR', 'Failed to refresh GitHub data.', 500);
  }
};

/**
 * Refresh LeetCode data
 */
export const refreshLeetCodeData = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT leetcode_username FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (rows.length === 0 || !rows[0].leetcode_username) {
      return sendError(res, 'NO_USERNAME', 'LeetCode username not set.', 400);
    }

    const leetcodeUsername = rows[0].leetcode_username;
    const data = await fetchCompleteLeetCodeData(leetcodeUsername);

    // Calculate skill level
    const skillLevel = calculateLeetCodeSkillLevel(data.profile);
    const leetcodeData = { ...data, profile: { ...data.profile, skill_level: skillLevel } };

    // Update cached data in database
    await query(
      `UPDATE users
       SET leetcode_data = $1, leetcode_fetched_at = NOW(), last_active_at = NOW()
       WHERE id = $2`,
      [JSON.stringify(leetcodeData), req.user.id]
    );

    // Also cache in Redis for faster access
    await redisClient.setEx(
      `user:${req.user.id}:leetcode_data`,
      CACHE_TTL_LEETCODE,
      JSON.stringify(leetcodeData)
    );

    return sendSuccess(res, {
      data: leetcodeData,
      message: 'LeetCode data refreshed successfully.',
    });
  } catch (err) {
    console.error('[Profile] refreshLeetCodeData error:', err);
    if (err.message.includes('not found')) {
      return sendError(res, 'USER_NOT_FOUND', 'LeetCode user not found.', 404);
    }
    return sendError(res, 'INTERNAL_ERROR', 'Failed to refresh LeetCode data.', 500);
  }
};

/**
 * Remove GitHub username
 */
export const removeGitHubUsername = async (req, res) => {
  try {
    await query(
      `UPDATE users
       SET github_username = NULL, github_data = NULL, github_fetched_at = NULL, last_active_at = NOW()
       WHERE id = $1`,
      [req.user.id]
    );

    // Clear Redis cache
    await redisClient.del(`user:${req.user.id}:github_data`);

    return sendSuccess(res, { message: 'GitHub username removed successfully.' });
  } catch (err) {
    console.error('[Profile] removeGitHubUsername error:', err);
    return sendError(res, 'INTERNAL_ERROR', 'Failed to remove GitHub username.', 500);
  }
};

/**
 * Remove LeetCode username
 */
export const removeLeetCodeUsername = async (req, res) => {
  try {
    await query(
      `UPDATE users
       SET leetcode_username = NULL, leetcode_data = NULL, leetcode_fetched_at = NULL, last_active_at = NOW()
       WHERE id = $1`,
      [req.user.id]
    );

    // Clear Redis cache
    await redisClient.del(`user:${req.user.id}:leetcode_data`);

    return sendSuccess(res, { message: 'LeetCode username removed successfully.' });
  } catch (err) {
    console.error('[Profile] removeLeetCodeUsername error:', err);
    return sendError(res, 'INTERNAL_ERROR', 'Failed to remove LeetCode username.', 500);
  }
};

/**
 * Get public profile (for sharing)
 */
export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    // Find user by GitHub or LeetCode username
    const { rows } = await query(
      `SELECT
         id, name, college, trimind_score, streak_days,
         github_username, leetcode_username,
         github_data, leetcode_data
       FROM users
       WHERE github_username = $1 OR leetcode_username = $1
       LIMIT 1`,
      [username]
    );

    if (rows.length === 0) {
      return sendError(res, 'USER_NOT_FOUND', 'User not found.', 404);
    }

    const user = rows[0];

    // Parse cached data if exists (postgres JSONB returns object directly)
    const githubData = typeof user.github_data === 'string' ? JSON.parse(user.github_data) : user.github_data;
    const leetcodeData = typeof user.leetcode_data === 'string' ? JSON.parse(user.leetcode_data) : user.leetcode_data;

    // Return only public data
    return sendSuccess(res, {
      user: {
        name: user.name,
        college: user.college,
        trimind_score: user.trimind_score,
        streak_days: user.streak_days,
      },
      github: {
        username: user.github_username,
        data: githubData ? {
          profile: githubData.profile,
          repos: githubData.repos,
        } : null,
      },
      leetcode: {
        username: user.leetcode_username,
        data: leetcodeData ? {
          profile: leetcodeData.profile,
          contest_history: leetcodeData.contest_history,
        } : null,
      },
    });
  } catch (err) {
    console.error('[Profile] getPublicProfile error:', err);
    return sendError(res, 'INTERNAL_ERROR', 'Failed to fetch public profile.', 500);
  }
};
