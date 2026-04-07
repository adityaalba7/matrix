/**
 * LeetCode API Service
 * Fetches real LeetCode user statistics using GraphQL
 * LeetCode doesn't have an official public API, so we use their GraphQL endpoint
 */

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';
const CACHE_TTL = 1800; // 30 minutes cache for LeetCode data

/**
 * GraphQL query for user profile and stats
 */
const USER_PROFILE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      profile {
        realName
        userAvatar
        reputation
        ranking
      }
      badges {
        id
        name
        icon
        creationDate
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
    }
  }
`;

/**
 * GraphQL query for user's recent submissions
 */
const RECENT_SUBMISSIONS_QUERY = `
  query recentSubmissions($username: String!, $limit: Int!) {
    recentSubmissionList(username: $username, limit: $limit) {
      title
      titleSlug
      statusDisplay
      lang
      timestamp
    }
  }
`;

/**
 * GraphQL query for user's solved problems
 */
const SOLVED_PROBLEMS_QUERY = `
  query solvedProblems($username: String!) {
    matchedUser(username: $username) {
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

/**
 * GraphQL query for user's contest history
 */
const CONEST_HISTORY_QUERY = `
  query userContestRanking($username: String!) {
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
    }
    userContestRankingHistory(username: $username) {
      attended
      trendDirection
      problemsSolved
      totalProblems
      finishTimeInSeconds
      rating
      ranking
      contest {
        title
        startTime
      }
    }
  }
`;

/**
 * Execute GraphQL query
 */
const executeGraphQL = async (query, variables) => {
  const response = await fetch(LEETCODE_GRAPHQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`LeetCode API error: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors[0]?.message || 'LeetCode API error');
  }

  return data.data;
};

/**
 * Fetch LeetCode user profile and stats
 */
export const fetchLeetCodeProfile = async (username) => {
  if (!username) {
    throw new Error('LeetCode username is required');
  }

  const data = await executeGraphQL(USER_PROFILE_QUERY, { username });

  if (!data.matchedUser) {
    throw new Error('LeetCode user not found');
  }

  const user = data.matchedUser;
  const contest = data.userContestRanking;

  // Extract submission stats by difficulty
  const submissionStats = {};
  user.submitStats.acSubmissionNum.forEach((stat) => {
    submissionStats[stat.difficulty.toLowerCase()] = stat.count;
  });

  return {
    username: user.username,
    real_name: user.profile.realName,
    avatar: user.profile.userAvatar,
    reputation: user.profile.reputation,
    ranking: user.profile.ranking,
    total_solved: submissionStats.all || 0,
    easy_solved: submissionStats.easy || 0,
    medium_solved: submissionStats.medium || 0,
    hard_solved: submissionStats.hard || 0,
    acceptance_rate: user.submitStats.acSubmissionNum.find((s) => s.difficulty === 'All')?.count || 0,
    badges: user.badges || [],
    contest_rating: contest?.rating || null,
    contest_ranking: contest?.globalRanking || null,
    contest_top_percentage: contest?.topPercentage || null,
    attended_contests: contest?.attendedContestsCount || 0,
  };
};

/**
 * Fetch LeetCode recent submissions
 */
export const fetchLeetCodeRecentSubmissions = async (username, limit = 10) => {
  if (!username) {
    throw new Error('LeetCode username is required');
  }

  const data = await executeGraphQL(RECENT_SUBMISSIONS_QUERY, { username, limit });

  return {
    username,
    submissions: data.recentSubmissionList || [],
  };
};

/**
 * Fetch LeetCode contest history
 */
export const fetchLeetCodeContestHistory = async (username) => {
  if (!username) {
    throw new Error('LeetCode username is required');
  }

  const data = await executeGraphQL(CONEST_HISTORY_QUERY, { username });

  const ranking = data.userContestRanking;
  const history = data.userContestRankingHistory || [];

  return {
    username,
    current_rating: ranking?.rating || null,
    global_ranking: ranking?.globalRanking || null,
    top_percentage: ranking?.topPercentage || null,
    attended_contests: ranking?.attendedContestsCount || 0,
    history: history.map((contest) => ({
      title: contest.contest.title,
      rating: contest.rating,
      ranking: contest.ranking,
      problems_solved: contest.problemsSolved,
      total_problems: contest.totalProblems,
      finish_time: contest.finishTimeInSeconds,
      start_time: contest.contest.startTime,
    })),
  };
};

/**
 * Fetch complete LeetCode data
 */
export const fetchCompleteLeetCodeData = async (username) => {
  const [profile, recentSubmissions, contestHistory] = await Promise.all([
    fetchLeetCodeProfile(username),
    fetchLeetCodeRecentSubmissions(username, 10),
    fetchLeetCodeContestHistory(username),
  ]);

  return {
    profile,
    recent_submissions: recentSubmissions.submissions,
    contest_history: contestHistory,
    fetched_at: new Date().toISOString(),
  };
};

/**
 * Validate LeetCode username format
 */
export const validateLeetCodeUsername = (username) => {
  if (!username) return false;
  // LeetCode usernames: alphanumeric and hyphens, 3-20 chars
  const leetcodeUsernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return leetcodeUsernameRegex.test(username);
};

/**
 * Calculate LeetCode skill level based on stats
 */
export const calculateLeetCodeSkillLevel = (profile) => {
  const { total_solved, hard_solved, contest_rating } = profile;

  if (total_solved < 10) return 'Beginner';
  if (total_solved < 50) return 'Intermediate';
  if (total_solved < 150) return 'Advanced';
  if (total_solved < 300) return 'Expert';
  if (hard_solved > 50 || (contest_rating && contest_rating > 2000)) return 'Master';
  return 'Grandmaster';
};
