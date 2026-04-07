/**
 * Test script for Profile API endpoints
 * Tests GitHub and LeetCode integration
 */

import { fetchCompleteGitHubData, validateGitHubUsername } from './utils/github.js';
import { fetchCompleteLeetCodeData, validateLeetCodeUsername, calculateLeetCodeSkillLevel } from './utils/leetcode.js';

console.log('=== Profile Feature Test Suite ===\n');

// Test 1: GitHub Username Validation
console.log('Test 1: GitHub Username Validation');
console.log('Valid usernames:');
console.log('  - octocat:', validateGitHubUsername('octocat'));
console.log('  - user-123:', validateGitHubUsername('user-123'));
console.log('Invalid usernames:');
console.log('  - -invalid:', validateGitHubUsername('-invalid'));
console.log('  - invalid-:', validateGitHubUsername('invalid-'));
console.log('  - User With Spaces:', validateGitHubUsername('User With Spaces'));
console.log('');

// Test 2: LeetCode Username Validation
console.log('Test 2: LeetCode Username Validation');
console.log('Valid usernames:');
console.log('  - leetcode_user:', validateLeetCodeUsername('leetcode_user'));
console.log('  - user123:', validateLeetCodeUsername('user123'));
console.log('Invalid usernames:');
console.log('  - ab:', validateLeetCodeUsername('ab')); // Too short
console.log('  - user@name:', validateLeetCodeUsername('user@name')); // Invalid character
console.log('');

// Test 3: Fetch GitHub Data
console.log('Test 3: Fetch GitHub Data');
try {
  const githubData = await fetchCompleteGitHubData('octocat');
  console.log('✅ GitHub data fetched successfully');
  console.log('  - Username:', githubData.profile.username);
  console.log('  - Name:', githubData.profile.name);
  console.log('  - Repos:', githubData.repos.length);
  console.log('  - Activity days:', githubData.activity.recent_activity.length);
} catch (err) {
  console.log('❌ GitHub data fetch failed:', err.message);
}
console.log('');

// Test 4: Fetch LeetCode Data
console.log('Test 4: Fetch LeetCode Data');
try {
  const leetcodeData = await fetchCompleteLeetCodeData('leetcode_user');
  console.log('✅ LeetCode data fetched successfully');
  console.log('  - Username:', leetcodeData.profile.username);
  console.log('  - Total solved:', leetcodeData.profile.total_solved);
  console.log('  - Easy:', leetcodeData.profile.easy_solved);
  console.log('  - Medium:', leetcodeData.profile.medium_solved);
  console.log('  - Hard:', leetcodeData.profile.hard_solved);
  console.log('  - Recent submissions:', leetcodeData.recent_submissions.length);
  console.log('  - Contest history:', leetcodeData.contest_history.history.length);
} catch (err) {
  console.log('❌ LeetCode data fetch failed:', err.message);
}
console.log('');

// Test 5: LeetCode Skill Level Calculation
console.log('Test 5: LeetCode Skill Level Calculation');
const testProfiles = [
  { total_solved: 5, hard_solved: 0, contest_rating: null },
  { total_solved: 25, hard_solved: 2, contest_rating: 1200 },
  { total_solved: 100, hard_solved: 10, contest_rating: 1500 },
  { total_solved: 200, hard_solved: 30, contest_rating: 1800 },
  { total_solved: 400, hard_solved: 60, contest_rating: 2100 },
  { total_solved: 600, hard_solved: 100, contest_rating: 2400 },
];

testProfiles.forEach((profile, i) => {
  const skillLevel = calculateLeetCodeSkillLevel(profile);
  console.log(`  Profile ${i + 1} (${profile.total_solved} solved): ${skillLevel}`);
});
console.log('');

// Test 6: Error Handling
console.log('Test 6: Error Handling');
console.log('Invalid GitHub user:');
try {
  await fetchCompleteGitHubData('thisuserdefinitelydoesnotexist123456789');
  console.log('  ❌ Should have thrown an error');
} catch (err) {
  console.log('  ✅ Correctly threw error:', err.message);
}

console.log('Invalid LeetCode user:');
try {
  await fetchCompleteLeetCodeData('thisuserdefinitelydoesnotexist123456789');
  console.log('  ❌ Should have thrown an error');
} catch (err) {
  console.log('  ✅ Correctly threw error:', err.message);
}
console.log('');

console.log('=== Test Suite Complete ===');
