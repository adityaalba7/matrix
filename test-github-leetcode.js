/**
 * GitHub & LeetCode Integration Tests
 * Run with: node test-github-leetcode.js
 */

import {
  fetchGitHubProfile,
  fetchGitHubRepos,
  fetchGitHubActivity,
  fetchCompleteGitHubData,
  validateGitHubUsername,
} from './backend/utils/github.js';

import {
  fetchLeetCodeProfile,
  fetchLeetCodeRecentSubmissions,
  fetchLeetCodeContestHistory,
  fetchCompleteLeetCodeData,
  validateLeetCodeUsername,
  calculateLeetCodeSkillLevel,
} from './backend/utils/leetcode.js';

// Test configuration
const TEST_GITHUB_USERNAME = 'octocat'; // GitHub's official mascot
const TEST_LEETCODE_USERNAME = 'leetcode_user'; // LeetCode's official account

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logTest(name, passed) {
  const status = passed ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
  console.log(`  ${status} ${name}`);
}

function logSection(title) {
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}${title}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

// Test suite
async function runTests() {
  let totalTests = 0;
  let passedTests = 0;

  // GitHub Tests
  logSection('GitHub Integration Tests');

  log('Testing GitHub Username Validation...');
  totalTests++;
  const validGithub = validateGitHubUsername('octocat');
  const invalidGithub = validateGitHubUsername('invalid-username-');
  logTest('Valid GitHub username', validGithub === true);
  if (validGithub === true) passedTests++;
  totalTests++;
  logTest('Invalid GitHub username (ends with hyphen)', invalidGithub === false);
  if (invalidGithub === false) passedTests++;

  log('\nFetching GitHub Profile...');
  try {
    const profile = await fetchGitHubProfile(TEST_GITHUB_USERNAME);
    totalTests++;
    logTest('GitHub profile fetched', profile && profile.username === TEST_GITHUB_USERNAME);
    if (profile && profile.username === TEST_GITHUB_USERNAME) passedTests++;
    totalTests++;
    logTest('Profile has required fields', profile.name && profile.avatar_url && profile.public_repos !== undefined);
    if (profile.name && profile.avatar_url && profile.public_repos !== undefined) passedTests++;

    log(`\n  Profile Data:`);
    log(`    Username: ${profile.username}`);
    log(`    Name: ${profile.name}`);
    log(`    Repos: ${profile.public_repos}`);
    log(`    Followers: ${profile.followers}`);
  } catch (error) {
    log(`  Error fetching GitHub profile: ${error.message}`, colors.red);
  }

  log('\nFetching GitHub Repositories...');
  try {
    const repos = await fetchGitHubRepos(TEST_GITHUB_USERNAME, 3);
    totalTests++;
    logTest('GitHub repos fetched', Array.isArray(repos) && repos.length > 0);
    if (Array.isArray(repos) && repos.length > 0) passedTests++;
    totalTests++;
    logTest('Repo has required fields', repos[0].name && repos[0].stars !== undefined);
    if (repos[0].name && repos[0].stars !== undefined) passedTests++;

    log(`\n  Top Repositories:`);
    repos.slice(0, 3).forEach((repo, i) => {
      log(`    ${i + 1}. ${repo.name} (${repo.stars} ⭐)`);
    });
  } catch (error) {
    log(`  Error fetching GitHub repos: ${error.message}`, colors.red);
  }

  log('\nFetching GitHub Activity...');
  try {
    const activity = await fetchGitHubActivity(TEST_GITHUB_USERNAME);
    totalTests++;
    logTest('GitHub activity fetched', activity && activity.recent_activity);
    if (activity && activity.recent_activity) passedTests++;
    totalTests++;
    logTest('Activity has 30 days', activity.recent_activity.length === 30);
    if (activity.recent_activity.length === 30) passedTests++;

    const activeDays = activity.recent_activity.filter((a) => a.count > 0).length;
    log(`\n  Activity: ${activeDays} active days in last 30 days`);
  } catch (error) {
    log(`  Error fetching GitHub activity: ${error.message}`, colors.red);
  }

  log('\nFetching Complete GitHub Data...');
  try {
    const completeData = await fetchCompleteGitHubData(TEST_GITHUB_USERNAME);
    totalTests++;
    logTest('Complete data fetched', completeData.profile && completeData.repos && completeData.activity);
    if (completeData.profile && completeData.repos && completeData.activity) passedTests++;
  } catch (error) {
    log(`  Error fetching complete GitHub data: ${error.message}`, colors.red);
  }

  // LeetCode Tests
  logSection('LeetCode Integration Tests');

  log('Testing LeetCode Username Validation...');
  totalTests++;
  const validLeetcode = validateLeetCodeUsername('leetcode_user');
  const invalidLeetcode = validateLeetCodeUsername('ab');
  logTest('Valid LeetCode username', validLeetcode === true);
  if (validLeetcode === true) passedTests++;
  totalTests++;
  logTest('Invalid LeetCode username (too short)', invalidLeetcode === false);
  if (invalidLeetcode === false) passedTests++;

  log('\nFetching LeetCode Profile...');
  try {
    const profile = await fetchLeetCodeProfile(TEST_LEETCODE_USERNAME);
    totalTests++;
    logTest('LeetCode profile fetched', profile && profile.username === TEST_LEETCODE_USERNAME);
    if (profile && profile.username === TEST_LEETCODE_USERNAME) passedTests++;
    totalTests++;
    logTest('Profile has required fields', profile.total_solved !== undefined && profile.easy_solved !== undefined);
    if (profile.total_solved !== undefined && profile.easy_solved !== undefined) passedTests++;

    log(`\n  Profile Data:`);
    log(`    Username: ${profile.username}`);
    log(`    Total Solved: ${profile.total_solved}`);
    log(`    Easy: ${profile.easy_solved}, Medium: ${profile.medium_solved}, Hard: ${profile.hard_solved}`);
    log(`    Contest Rating: ${profile.contest_rating || 'N/A'}`);
  } catch (error) {
    log(`  Error fetching LeetCode profile: ${error.message}`, colors.red);
  }

  log('\nFetching LeetCode Recent Submissions...');
  try {
    const submissions = await fetchLeetCodeRecentSubmissions(TEST_LEETCODE_USERNAME, 5);
    totalTests++;
    logTest('LeetCode submissions fetched', submissions && submissions.submissions);
    if (submissions && submissions.submissions) passedTests++;
    totalTests++;
    logTest('Submissions have required fields', submissions.submissions[0]?.title && submissions.submissions[0]?.statusDisplay);
    if (submissions.submissions[0]?.title && submissions.submissions[0]?.statusDisplay) passedTests++;

    log(`\n  Recent Submissions:`);
    submissions.submissions.slice(0, 3).forEach((sub, i) => {
      const status = sub.statusDisplay === 'Accepted' ? '✓' : '✗';
      log(`    ${i + 1}. ${status} ${sub.title} (${sub.lang})`);
    });
  } catch (error) {
    log(`  Error fetching LeetCode submissions: ${error.message}`, colors.red);
  }

  log('\nFetching LeetCode Contest History...');
  try {
    const contestHistory = await fetchLeetCodeContestHistory(TEST_LEETCODE_USERNAME);
    totalTests++;
    logTest('LeetCode contest history fetched', contestHistory && contestHistory.current_rating !== undefined);
    if (contestHistory && contestHistory.current_rating !== undefined) passedTests++;
    totalTests++;
    logTest('Contest history has required fields', contestHistory.attended_contests !== undefined);
    if (contestHistory.attended_contests !== undefined) passedTests++;

    log(`\n  Contest Data:`);
    log(`    Current Rating: ${contestHistory.current_rating || 'N/A'}`);
    log(`    Global Ranking: ${contestHistory.global_ranking || 'N/A'}`);
    log(`    Attended Contests: ${contestHistory.attended_contests}`);
  } catch (error) {
    log(`  Error fetching LeetCode contest history: ${error.message}`, colors.red);
  }

  log('\nFetching Complete LeetCode Data...');
  try {
    const completeData = await fetchCompleteLeetCodeData(TEST_LEETCODE_USERNAME);
    totalTests++;
    logTest('Complete data fetched', completeData.profile && completeData.recent_submissions && completeData.contest_history);
    if (completeData.profile && completeData.recent_submissions && completeData.contest_history) passedTests++;
  } catch (error) {
    log(`  Error fetching complete LeetCode data: ${error.message}`, colors.red);
  }

  log('\nTesting LeetCode Skill Level Calculation...');
  try {
    const testCases = [
      { total_solved: 5, hard_solved: 0, contest_rating: null, expected: 'Beginner' },
      { total_solved: 25, hard_solved: 0, contest_rating: null, expected: 'Intermediate' },
      { total_solved: 100, hard_solved: 5, contest_rating: null, expected: 'Advanced' },
      { total_solved: 200, hard_solved: 20, contest_rating: null, expected: 'Expert' },
      { total_solved: 350, hard_solved: 60, contest_rating: null, expected: 'Master' },
      { total_solved: 500, hard_solved: 100, contest_rating: 2100, expected: 'Grandmaster' },
    ];

    testCases.forEach((testCase) => {
      const level = calculateLeetCodeSkillLevel(testCase);
      totalTests++;
      const passed = level === testCase.expected;
      logTest(`Skill level for ${testCase.total_solved} solved: ${level} (expected: ${testCase.expected})`, passed);
      if (passed) passedTests++;
    });
  } catch (error) {
    log(`  Error testing skill level: ${error.message}`, colors.red);
  }

  // Summary
  logSection('Test Summary');
  const percentage = Math.round((passedTests / totalTests) * 100);
  log(`Total Tests: ${totalTests}`, colors.blue);
  log(`Passed: ${passedTests}`, colors.green);
  log(`Failed: ${totalTests - passedTests}`, colors.red);
  log(`Success Rate: ${percentage}%`, percentage >= 80 ? colors.green : colors.yellow);

  if (percentage >= 80) {
    log('\n✅ All critical tests passed!', colors.green);
  } else {
    log('\n⚠️  Some tests failed. Please review the errors above.', colors.yellow);
  }

  process.exit(percentage >= 80 ? 0 : 1);
}

// Run tests
runTests().catch((error) => {
  log(`\n❌ Test suite failed: ${error.message}`, colors.red);
  console.error(error);
  process.exit(1);
});
