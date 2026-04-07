const { Pool } = require('pg');

/**
 * Seed file for rewards system
 * Run this file to populate the database with initial rewards, achievements, challenges, and daily tasks
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedRewards() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Seeding rewards...');

    // Insert rewards
    const rewards = [
      {
        name: 'First Quiz Badge',
        description: 'Complete your first quiz',
        icon_name: 'trophy',
        category: 'badge',
        xp_cost: 0,
      },
      {
        name: 'Quiz Master',
        description: 'Complete 50 quizzes with 80%+ accuracy',
        icon_name: 'star',
        category: 'badge',
        xp_cost: 0,
      },
      {
        name: 'Budget Hero',
        description: 'Stay under budget for 7 consecutive days',
        icon_name: 'shield',
        category: 'badge',
        xp_cost: 0,
      },
      {
        name: 'Interview Pro',
        description: 'Complete 10 mock interviews',
        icon_name: 'mic',
        category: 'badge',
        xp_cost: 0,
      },
      {
        name: 'Streak Champion',
        description: 'Maintain a 30-day streak',
        icon_name: 'flame',
        category: 'badge',
        xp_cost: 0,
      },
      {
        name: 'Dark Theme',
        description: 'Unlock dark theme for the app',
        icon_name: 'moon',
        category: 'theme',
        xp_cost: 500,
      },
      {
        name: 'Custom Avatar',
        description: 'Unlock custom avatar frames',
        icon_name: 'user',
        category: 'theme',
        xp_cost: 1000,
      },
      {
        name: 'XP Boost (1x)',
        description: 'Double XP for 24 hours',
        icon_name: 'zap',
        category: 'xp_boost',
        xp_cost: 2000,
      },
    ];

    for (const reward of rewards) {
      await client.query(
        `INSERT INTO rewards (name, description, icon_name, category, xp_cost)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [reward.name, reward.description, reward.icon_name, reward.category, reward.xp_cost]
      );
    }

    console.log('✅ Rewards seeded successfully');

    // Insert achievements
    const achievements = [
      {
        name: 'First Steps',
        description: 'Complete your first quiz',
        icon_name: 'footprints',
        category: 'study',
        xp_reward: 50,
        requirement_type: 'quiz_count',
        requirement_value: { min_count: 1 },
      },
      {
        name: 'Quiz Enthusiast',
        description: 'Complete 10 quizzes',
        icon_name: 'book-open',
        category: 'study',
        xp_reward: 100,
        requirement_type: 'quiz_count',
        requirement_value: { min_count: 10 },
      },
      {
        name: 'Quiz Master',
        description: 'Complete 50 quizzes',
        icon_name: 'star',
        category: 'study',
        xp_reward: 500,
        requirement_type: 'quiz_count',
        requirement_value: { min_count: 50 },
      },
      {
        name: 'Perfect Score',
        description: 'Get 100% on a quiz',
        icon_name: 'target',
        category: 'study',
        xp_reward: 200,
        requirement_type: 'quiz_score',
        requirement_value: { min_score: 100 },
      },
      {
        name: 'High Scorer',
        description: 'Get 90%+ on a quiz',
        icon_name: 'award',
        category: 'study',
        xp_reward: 150,
        requirement_type: 'quiz_score',
        requirement_value: { min_score: 90 },
      },
      {
        name: '3-Day Streak',
        description: 'Maintain a 3-day activity streak',
        icon_name: 'flame',
        category: 'milestone',
        xp_reward: 100,
        requirement_type: 'streak_days',
        requirement_value: { min_days: 3 },
      },
      {
        name: '7-Day Streak',
        description: 'Maintain a 7-day activity streak',
        icon_name: 'fire',
        category: 'milestone',
        xp_reward: 300,
        requirement_type: 'streak_days',
        requirement_value: { min_days: 7 },
      },
      {
        name: '30-Day Streak',
        description: 'Maintain a 30-day activity streak',
        icon_name: 'zap',
        category: 'milestone',
        xp_reward: 1000,
        requirement_type: 'streak_days',
        requirement_value: { min_days: 30 },
      },
      {
        name: 'Budget Keeper',
        description: 'Stay under budget for 7 days',
        icon_name: 'shield',
        category: 'finance',
        xp_reward: 200,
        requirement_type: 'budget_adherence',
        requirement_value: { min_percentage: 100 },
      },
      {
        name: 'Interview Rookie',
        description: 'Complete your first mock interview',
        icon_name: 'mic',
        category: 'interview',
        xp_reward: 100,
        requirement_type: 'interview_score',
        requirement_value: { min_score: 0 },
      },
      {
        name: 'Interview Expert',
        description: 'Complete 10 mock interviews',
        icon_name: 'trophy',
        category: 'interview',
        xp_reward: 500,
        requirement_type: 'interview_score',
        requirement_value: { min_count: 10 },
      },
      {
        name: 'XP Collector',
        description: 'Earn 1000 total XP',
        icon_name: 'coins',
        category: 'milestone',
        xp_reward: 0,
        requirement_type: 'total_xp',
        requirement_value: { min_xp: 1000 },
      },
      {
        name: 'XP Master',
        description: 'Earn 10000 total XP',
        icon_name: 'crown',
        category: 'milestone',
        xp_reward: 0,
        requirement_type: 'total_xp',
        requirement_value: { min_xp: 10000 },
      },
    ];

    for (const achievement of achievements) {
      await client.query(
        `INSERT INTO achievements (name, description, icon_name, category, xp_reward, requirement_type, requirement_value)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT DO NOTHING`,
        [
          achievement.name,
          achievement.description,
          achievement.icon_name,
          achievement.category,
          achievement.xp_reward,
          achievement.requirement_type,
          JSON.stringify(achievement.requirement_value),
        ]
      );
    }

    console.log('✅ Achievements seeded successfully');

    // Insert challenges
    const challenges = [
      {
        name: 'Daily Quiz Challenge',
        description: 'Complete 5 quizzes today',
        type: 'daily',
        xp_reward: 100,
        requirement_type: 'quiz_count',
        requirement_value: { min_count: 5 },
        start_date: new Date(),
        end_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        name: 'Weekly Streak Challenge',
        description: 'Maintain a 7-day streak this week',
        type: 'weekly',
        xp_reward: 500,
        requirement_type: 'streak_days',
        requirement_value: { min_days: 7 },
        start_date: new Date(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'Budget Master',
        description: 'Stay under budget for 7 consecutive days',
        type: 'weekly',
        xp_reward: 300,
        requirement_type: 'budget_adherence',
        requirement_value: { min_percentage: 100 },
        start_date: new Date(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const challenge of challenges) {
      await client.query(
        `INSERT INTO challenges (name, description, type, xp_reward, requirement_type, requirement_value, start_date, end_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT DO NOTHING`,
        [
          challenge.name,
          challenge.description,
          challenge.type,
          challenge.xp_reward,
          challenge.requirement_type,
          JSON.stringify(challenge.requirement_value),
          challenge.start_date,
          challenge.end_date,
        ]
      );
    }

    console.log('✅ Challenges seeded successfully');

    // Insert daily tasks
    const dailyTasks = [
      {
        name: 'Complete a Quiz',
        description: 'Finish at least one quiz today',
        category: 'study',
        xp_reward: 25,
        requirement_type: 'quiz_count',
        requirement_value: { min_count: 1 },
      },
      {
        name: 'Log an Expense',
        description: 'Track at least one expense today',
        category: 'finance',
        xp_reward: 15,
        requirement_type: 'expense_count',
        requirement_value: { min_count: 1 },
      },
      {
        name: 'Practice Interview',
        description: 'Complete a mock interview today',
        category: 'interview',
        xp_reward: 30,
        requirement_type: 'interview_count',
        requirement_value: { min_count: 1 },
      },
      {
        name: 'Study for 30 Minutes',
        description: 'Spend at least 30 minutes studying',
        category: 'study',
        xp_reward: 20,
        requirement_type: 'study_time',
        requirement_value: { min_minutes: 30 },
      },
      {
        name: 'Stay Under Budget',
        description: 'Don\'t exceed your daily budget',
        category: 'finance',
        xp_reward: 20,
        requirement_type: 'budget_adherence',
        requirement_value: { min_percentage: 100 },
      },
    ];

    for (const task of dailyTasks) {
      await client.query(
        `INSERT INTO daily_tasks (name, description, category, xp_reward, requirement_type, requirement_value)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [
          task.name,
          task.description,
          task.category,
          task.xp_reward,
          task.requirement_type,
          JSON.stringify(task.requirement_value),
        ]
      );
    }

    console.log('✅ Daily tasks seeded successfully');

    await client.query('COMMIT');
    console.log('🎉 All rewards system data seeded successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding rewards system:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seed function
if (require.main === module) {
  seedRewards()
    .then(() => {
      console.log('Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}

module.exports = { seedRewards };
