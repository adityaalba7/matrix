-- Migration: Add GitHub and LeetCode integration columns
-- This migration adds support for storing GitHub and LeetCode usernames
-- and caching their API responses

-- Add GitHub columns
ALTER TABLE users
ADD COLUMN IF NOT EXISTS github_username VARCHAR(39),
ADD COLUMN IF NOT EXISTS github_data JSONB,
ADD COLUMN IF NOT EXISTS github_fetched_at TIMESTAMPTZ;

-- Add LeetCode columns
ALTER TABLE users
ADD COLUMN IF NOT EXISTS leetcode_username VARCHAR(20),
ADD COLUMN IF NOT EXISTS leetcode_data JSONB,
ADD COLUMN IF NOT EXISTS leetcode_fetched_at TIMESTAMPTZ;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_github_username ON users(github_username) WHERE github_username IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_leetcode_username ON users(leetcode_username) WHERE leetcode_username IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN users.github_username IS 'GitHub username for fetching profile data';
COMMENT ON COLUMN users.github_data IS 'Cached GitHub API response (profile, repos, activity)';
COMMENT ON COLUMN users.github_fetched_at IS 'Timestamp when GitHub data was last fetched';
COMMENT ON COLUMN users.leetcode_username IS 'LeetCode username for fetching profile data';
COMMENT ON COLUMN users.leetcode_data IS 'Cached LeetCode API response (profile, stats, contests)';
COMMENT ON COLUMN users.leetcode_fetched_at IS 'Timestamp when LeetCode data was last fetched';
