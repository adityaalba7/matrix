import api from './api';

// TypeScript interfaces for reward types
export interface User {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  trimindScore: number;
  xpForNextLevel: number;
  xpProgress: number;
}

export interface RewardStats {
  achievementsUnlocked: number;
  rewardsEarned: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  xp_reward: number;
  type: string;
  status: string;
  progress: any;
}

export interface DailyTask {
  id: string;
  name: string;
  description: string;
  xp_reward: number;
  category: string;
  status: string;
  task_date: string;
}

export interface RewardSummary {
  user: User;
  stats: RewardStats;
  challenges: Challenge[];
  dailyTasks: DailyTask[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  category: string;
  xp_reward: number;
  earned_at: string;
  progress: any;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  category: string;
  xp_cost: number;
  earned_at: string;
  is_equipped: boolean;
}

export interface AvailableReward {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  category: string;
  xp_cost: number;
  is_active: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  total_xp: number;
  level: number;
  current_streak: number;
  score: number;
  rank: number;
}

export interface FriendChallenge {
  id: string;
  challenger_id: string;
  challenged_id: string;
  status: string;
  challenger_score?: number;
  challenged_score?: number;
  winner_id?: string;
  xp_reward: number;
  created_at: string;
  completed_at?: string;
  challenger_name?: string;
  challenged_name?: string;
}

// Reward API functions
export const rewardApi = {
  // Get user's reward summary
  getRewardSummary: async (): Promise<RewardSummary> => {
    const response = await api.get('/rewards/summary');
    return response.data.data;
  },

  // Get user's achievements
  getAchievements: async (): Promise<Achievement[]> => {
    const response = await api.get('/rewards/achievements');
    return response.data.data;
  },

  // Get user's rewards
  getUserRewards: async (): Promise<Reward[]> => {
    const response = await api.get('/rewards/my-rewards');
    return response.data.data;
  },

  // Get available rewards
  getAvailableRewards: async (category?: string): Promise<AvailableReward[]> => {
    const params = category ? { category } : {};
    const response = await api.get('/rewards/available', { params });
    return response.data.data;
  },

  // Purchase a reward
  purchaseReward: async (rewardId: string): Promise<any> => {
    const response = await api.post('/rewards/purchase', { rewardId });
    return response.data.data;
  },

  // Equip a reward
  equipReward: async (rewardId: string): Promise<any> => {
    const response = await api.post('/rewards/equip', { rewardId });
    return response.data;
  },

  // Get leaderboard
  getLeaderboard: async (type: string = 'overall', limit: number = 10): Promise<LeaderboardEntry[]> => {
    const response = await api.get('/rewards/leaderboard', {
      params: { type, limit }
    });
    return response.data.data;
  },

  // Get user's rank
  getUserRank: async (type: string = 'overall'): Promise<{ rank: number }> => {
    const response = await api.get('/rewards/my-rank', {
      params: { type }
    });
    return response.data.data;
  },

  // Get user's challenges
  getChallenges: async (): Promise<Challenge[]> => {
    const response = await api.get('/rewards/challenges');
    return response.data.data;
  },

  // Get daily tasks
  getDailyTasks: async (): Promise<DailyTask[]> => {
    const response = await api.get('/rewards/daily-tasks');
    return response.data.data;
  },

  // Complete a daily task
  completeDailyTask: async (dailyTaskId: string): Promise<any> => {
    const response = await api.post('/rewards/daily-tasks/complete', { dailyTaskId });
    return response.data.data;
  },

  // Create a friend challenge
  createFriendChallenge: async (challengedUsername: string, quizSessionId?: string): Promise<FriendChallenge> => {
    const response = await api.post('/rewards/friend-challenge', {
      challengedUsername,
      quizSessionId
    });
    return response.data.data;
  },

  // Accept a friend challenge
  acceptFriendChallenge: async (challengeId: string): Promise<FriendChallenge> => {
    const response = await api.post('/rewards/friend-challenge/accept', { challengeId });
    return response.data.data;
  },

  // Complete a friend challenge
  completeFriendChallenge: async (challengeId: string, challengerScore: number, challengedScore: number): Promise<FriendChallenge> => {
    const response = await api.post('/rewards/friend-challenge/complete', {
      challengeId,
      challengerScore,
      challengedScore
    });
    return response.data.data;
  },

  // Get pending friend challenges
  getPendingFriendChallenges: async (): Promise<FriendChallenge[]> => {
    const response = await api.get('/rewards/friend-challenge/pending');
    return response.data.data;
  },

  // Get recent friend challenges
  getRecentFriendChallenges: async (): Promise<FriendChallenge[]> => {
    const response = await api.get('/rewards/friend-challenge/recent');
    return response.data.data;
  },

  // Award XP (internal endpoint)
  awardXP: async (amount: number, sourceType: string, sourceId?: string, description?: string): Promise<any> => {
    const response = await api.post('/rewards/award-xp', {
      amount,
      sourceType,
      sourceId,
      description
    });
    return response.data.data;
  },

  // Update streak (internal endpoint)
  updateStreak: async (): Promise<any> => {
    const response = await api.post('/rewards/update-streak');
    return response.data.data;
  },

  // Check achievements (internal endpoint)
  checkAchievements: async (category: string, userData: any): Promise<any[]> => {
    const response = await api.post('/rewards/check-achievements', {
      category,
      userData
    });
    return response.data.data;
  }
};

export default rewardApi;
