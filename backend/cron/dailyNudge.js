import cron from 'node-cron';
import { query } from '../db/index.js';
import redisClient from '../db/redis.js';

const buildNudgeContext = async (userId) => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [userResult, spentResult, weakTopicsResult, interviewResult] = await Promise.all([
    query(
      `SELECT streak_days, monthly_budget, exam_date, trimind_score FROM users WHERE id = $1`,
      [userId]
    ),
    query(
      `SELECT COALESCE(SUM(amount_paise), 0)::INTEGER AS total_spent
       FROM expenses
       WHERE user_id = $1 AND deleted_at IS NULL AND TO_CHAR(logged_at, 'YYYY-MM') = $2`,
      [userId, currentMonth]
    ),
    query(
      `SELECT qa.concept_tag,
         ROUND(
           COUNT(*) FILTER (WHERE qa.is_correct = TRUE)::NUMERIC / NULLIF(COUNT(*), 0) * 100
         )::INTEGER AS accuracy_pct
       FROM quiz_answers qa
       JOIN quiz_sessions qs ON qs.id = qa.session_id
       WHERE qs.user_id = $1 AND qa.concept_tag IS NOT NULL AND qa.asked_at >= $2
       GROUP BY qa.concept_tag
       HAVING COUNT(*) >= 2
       ORDER BY accuracy_pct ASC
       LIMIT 3`,
      [userId, thirtyDaysAgo]
    ),
    query(
      `SELECT ROUND((clarity_score + depth_score + structure_score)::NUMERIC / 3)::INTEGER AS avg_score
       FROM interview_sessions
       WHERE user_id = $1 AND completed_at IS NOT NULL
       ORDER BY completed_at DESC LIMIT 1`,
      [userId]
    ),
  ]);

  const user = userResult.rows[0];
  if (!user) return null;

  const totalSpent = spentResult.rows[0].total_spent;
  const budgetUsedPercent = Math.round((totalSpent / (user.monthly_budget || 1)) * 100);

  return {
    user_id: userId,
    streak_days: user.streak_days ?? 0,
    exam_date: user.exam_date,
    trimind_score: user.trimind_score ?? 0,
    budget_used_percent: budgetUsedPercent,
    weak_topics: weakTopicsResult.rows.map(r => r.concept_tag),
    last_interview_score: interviewResult.rows[0]?.avg_score ?? null,
  };
};

const generateNudgeStub = (context) => {
  const lines = [];

  if (context.streak_days === 0) {
    lines.push("Start your study streak today — even 20 minutes counts!");
  } else {
    lines.push(`You're on a ${context.streak_days}-day streak. Keep it going!`);
  }

  if (context.budget_used_percent > 80) {
    lines.push(`You've used ${context.budget_used_percent}% of your budget. Watch your spending.`);
  }

  if (context.weak_topics.length > 0) {
    lines.push(`Focus on: ${context.weak_topics.slice(0, 2).join(' and ')}.`);
  }

  if (context.exam_date) {
    const daysLeft = Math.ceil((new Date(context.exam_date) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft > 0) lines.push(`${daysLeft} days until your exam. Stay focused!`);
  }

  return lines.join(' ') || 'Have a productive day with TriMind!';
};

cron.schedule('0 2 * * *', async () => {
  console.log('[cron] dailyNudge — starting batch at', new Date().toISOString());

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { rows: users } = await query(
      `SELECT id FROM users WHERE last_active_at >= $1`,
      [sevenDaysAgo]
    );

    console.log(`[cron] dailyNudge — processing ${users.length} active users`);

    for (const user of users) {
      try {
        const context = await buildNudgeContext(user.id);
        if (!context) continue;

        const nudgeText = generateNudgeStub(context);

        const nudge = {
          text: nudgeText,
          context,
          generated_at: new Date().toISOString(),
        };

        await redisClient.setEx(
          `user:${user.id}:daily_nudge`,
          24 * 60 * 60,
          JSON.stringify(nudge)
        );
      } catch (err) {
        console.error(`[cron] dailyNudge — failed for user ${user.id}:`, err.message);
      }
    }

    console.log('[cron] dailyNudge — done');
  } catch (err) {
    console.error('[cron] dailyNudge — fatal error:', err.message);
  }
}, {
  timezone: 'UTC',
});
