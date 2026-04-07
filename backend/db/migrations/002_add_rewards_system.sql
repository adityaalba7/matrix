-- Rewards System Migration
-- This migration creates tables for the gamification/rewards system

-- Rewards table - defines available rewards
CREATE TABLE IF NOT EXISTS rewards (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                VARCHAR(100) NOT NULL,
  description         TEXT,
  icon_name           VARCHAR(50),
  category            VARCHAR(30) CHECK (category IN ('badge', 'title', 'theme', 'feature', 'xp_boost')),
  xp_cost             INTEGER DEFAULT 0,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- User rewards table - tracks rewards earned by users
CREATE TABLE IF NOT EXISTS user_rewards (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id           UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  earned_at           TIMESTAMPTZ DEFAULT NOW(),
  is_equipped         BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, reward_id)
);

-- Achievements table - defines available achievements
CREATE TABLE IF NOT EXISTS achievements (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                VARCHAR(100) NOT NULL,
  description         TEXT,
  icon_name           VARCHAR(50),
  category            VARCHAR(30) CHECK (category IN ('study', 'finance', 'interview', 'social', 'milestone')),
  xp_reward           INTEGER DEFAULT 0,
  requirement_type    VARCHAR(50) NOT NULL,
  requirement_value   JSONB NOT NULL,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements table - tracks achievements earned by users
CREATE TABLE IF NOT EXISTS user_achievements (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id      UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at           TIMESTAMPTZ DEFAULT NOW(),
  progress            JSONB DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

-- Challenges table - defines available challenges
CREATE TABLE IF NOT EXISTS challenges (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                VARCHAR(100) NOT NULL,
  description         TEXT,
  type                VARCHAR(30) CHECK (type IN ('daily', 'weekly', 'special')),
  xp_reward           INTEGER DEFAULT 0,
  requirement_type    VARCHAR(50) NOT NULL,
  requirement_value   JSONB NOT NULL,
  start_date          TIMESTAMPTZ,
  end_date            TIMESTAMPTZ,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- User challenges table - tracks challenge participation and completion
CREATE TABLE IF NOT EXISTS user_challenges (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id        UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  status              VARCHAR(20) CHECK (status IN ('in_progress', 'completed', 'failed')) DEFAULT 'in_progress',
  progress            JSONB DEFAULT '{}',
  completed_at        TIMESTAMPTZ,
  started_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- Daily tasks table - defines daily tasks
CREATE TABLE IF NOT EXISTS daily_tasks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                VARCHAR(100) NOT NULL,
  description         TEXT,
  category            VARCHAR(30) CHECK (category IN ('study', 'finance', 'interview', 'social')),
  xp_reward           INTEGER DEFAULT 0,
  requirement_type    VARCHAR(50) NOT NULL,
  requirement_value   JSONB NOT NULL,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- User daily tasks table - tracks daily task completion
CREATE TABLE IF NOT EXISTS user_daily_tasks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  daily_task_id       UUID NOT NULL REFERENCES daily_tasks(id) ON DELETE CASCADE,
  task_date           DATE NOT NULL,
  status              VARCHAR(20) CHECK (status IN ('pending', 'completed')) DEFAULT 'pending',
  completed_at        TIMESTAMPTZ,
  UNIQUE(user_id, daily_task_id, task_date)
);

-- XP transactions table - tracks all XP earned/spent
CREATE TABLE IF NOT EXISTS xp_transactions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount              INTEGER NOT NULL,
  transaction_type    VARCHAR(30) CHECK (transaction_type IN ('earned', 'spent')) NOT NULL,
  source_type         VARCHAR(50) NOT NULL,
  source_id           UUID,
  description         TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard table - tracks leaderboard rankings
CREATE TABLE IF NOT EXISTS leaderboard (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  leaderboard_type    VARCHAR(30) CHECK (leaderboard_type IN ('daily', 'weekly', 'monthly', 'overall')) NOT NULL,
  score               INTEGER NOT NULL,
  rank                INTEGER,
  period_start        TIMESTAMPTZ NOT NULL,
  period_end          TIMESTAMPTZ NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, leaderboard_type, period_start)
);

-- Friend challenges table - tracks challenges between friends
CREATE TABLE IF NOT EXISTS friend_challenges (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenged_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_session_id     UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  status              VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'completed', 'declined')) DEFAULT 'pending',
  challenger_score    INTEGER,
  challenged_score    INTEGER,
  winner_id           UUID REFERENCES users(id) ON DELETE SET NULL,
  xp_reward           INTEGER DEFAULT 50,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  completed_at        TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_reward_id ON user_rewards(reward_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge_id ON user_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_status ON user_challenges(status);
CREATE INDEX IF NOT EXISTS idx_user_daily_tasks_user_id ON user_daily_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_tasks_task_date ON user_daily_tasks(task_date);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created_at ON xp_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_type_period ON leaderboard(leaderboard_type, period_start);
CREATE INDEX IF NOT EXISTS idx_friend_challenges_challenger_id ON friend_challenges(challenger_id);
CREATE INDEX IF NOT EXISTS idx_friend_challenges_challenged_id ON friend_challenges(challenged_id);
CREATE INDEX IF NOT EXISTS idx_friend_challenges_status ON friend_challenges(status);

-- Add total_xp column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'total_xp'
  ) THEN
    ALTER TABLE users ADD COLUMN total_xp INTEGER DEFAULT 0;
  END IF;
END $$;

-- Add level column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'level'
  ) THEN
    ALTER TABLE users ADD COLUMN level INTEGER DEFAULT 1;
  END IF;
END $$;

-- Add current_streak column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'current_streak'
  ) THEN
    ALTER TABLE users ADD COLUMN current_streak INTEGER DEFAULT 0;
  END IF;
END $$;

-- Add longest_streak column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'longest_streak'
  ) THEN
    ALTER TABLE users ADD COLUMN longest_streak INTEGER DEFAULT 0;
  END IF;
END $$;

-- Add last_activity_date column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'last_activity_date'
  ) THEN
    ALTER TABLE users ADD COLUMN last_activity_date DATE;
  END IF;
END $$;
