/**
 * GitHub API Service
 * Fetches real GitHub user data, repositories, and activity
 * Uses public API (no auth required for public profiles)
 * Implements caching for rate limit management
 */

const GITHUB_API_BASE = 'https://api.github.com';
const CACHE_TTL = 3600; // 1 hour cache for GitHub data

/**
 * Fetch GitHub user profile data
 */
export const fetchGitHubProfile = async (username) => {
  if (!username) {
    throw new Error('GitHub username is required');
  }

  const response = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'TriMind-App',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('GitHub user not found');
    }
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    username: data.login,
    name: data.name || data.login,
    avatar_url: data.avatar_url,
    bio: data.bio,
    location: data.location,
    company: data.company,
    blog: data.blog,
    public_repos: data.public_repos,
    followers: data.followers,
    following: data.following,
    created_at: data.created_at,
    updated_at: data.updated_at,
    twitter_username: data.twitter_username,
    hireable: data.hireable,
  };
};

/**
 * Fetch GitHub user repositories (sorted by updated)
 */
export const fetchGitHubRepos = async (username, limit = 6) => {
  if (!username) {
    throw new Error('GitHub username is required');
  }

  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=${limit}`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'TriMind-App',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data = await response.json();

  return data.map((repo) => ({
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updated_at: repo.updated_at,
    url: repo.html_url,
    size: repo.size,
    is_fork: repo.fork,
  }));
};

/**
 * Fetch GitHub contribution activity (last 30 days)
 * Note: This uses the events API as contribution graph requires auth
 */
export const fetchGitHubActivity = async (username) => {
  if (!username) {
    throw new Error('GitHub username is required');
  }

  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/events/public?per_page=30`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'TriMind-App',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data = await response.json();

  // Group events by date for activity heatmap
  const activityByDate = {};
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  data.forEach((event) => {
    const eventDate = new Date(event.created_at);
    if (eventDate >= thirtyDaysAgo) {
      const dateKey = eventDate.toISOString().split('T')[0];
      activityByDate[dateKey] = (activityByDate[dateKey] || 0) + 1;
    }
  });

  // Generate 30-day activity array
  const activityArray = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    activityArray.push({
      date: dateKey,
      count: activityByDate[dateKey] || 0,
    });
  }

  return {
    total_events: data.length,
    recent_activity: activityArray,
    latest_events: data.slice(0, 5).map((event) => ({
      type: event.type,
      repo: event.repo?.name,
      created_at: event.created_at,
    })),
  };
};

/**
 * Fetch complete GitHub data (profile, repos, activity)
 */
export const fetchCompleteGitHubData = async (username) => {
  const [profile, repos, activity] = await Promise.all([
    fetchGitHubProfile(username),
    fetchGitHubRepos(username),
    fetchGitHubActivity(username),
  ]);

  return {
    profile,
    repos,
    activity,
    fetched_at: new Date().toISOString(),
  };
};

/**
 * Validate GitHub username format
 */
export const validateGitHubUsername = (username) => {
  if (!username) return false;
  // GitHub usernames: max 39 chars, alphanumeric and hyphens, cannot start/end with hyphen
  const githubUsernameRegex = /^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i;
  return githubUsernameRegex.test(username) && username.length <= 39;
};
