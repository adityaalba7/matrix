import { query } from '../db/index.js';
import redisClient from '../db/redis.js';
import { sendSuccess } from '../utils/response.js';

export const getDashboard = async (req, res) => {
  const userId = req.user.id;
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const daysElapsed = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = daysInMonth - daysElapsed;

  const [
    userResult,
    scoreHistoryResult,
    nudgeRaw,
    roadmapRaw,
    weakTopicsResult,
    spentResult,
    topCategoryResult,
    interviewResult,
    interviewWeekResult,
    fillerResult,
  ] = await Promise.all([
    query(`SELECT trimind_score, streak_days, monthly_budget FROM users WHERE id = $1`, [userId]),
    query(
      `SELECT score FROM trimind_score_history
       WHERE user_id = $1 AND computed_at <= NOW() - INTERVAL '7 days'
       ORDER BY computed_at DESC LIMIT 1`,
      [userId]
    ),
    redisClient.get(`user:${userId}:daily_nudge`),
    redisClient.get(`user:${userId}:roadmap`),
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
       ORDER BY accuracy_pct ASC LIMIT 5`,
      [userId, thirtyDaysAgo]
    ),
    query(
      `SELECT COALESCE(SUM(amount_paise), 0)::INTEGER AS total_spent
       FROM expenses
       WHERE user_id = $1 AND deleted_at IS NULL AND TO_CHAR(logged_at, 'YYYY-MM') = $2`,
      [userId, currentMonth]
    ),
    query(
      `SELECT category, SUM(amount_paise)::INTEGER AS total_paise
       FROM expenses
       WHERE user_id = $1 AND deleted_at IS NULL AND TO_CHAR(logged_at, 'YYYY-MM') = $2
       GROUP BY category ORDER BY total_paise DESC LIMIT 1`,
      [userId, currentMonth]
    ),
    query(
      `SELECT
         ROUND(AVG((clarity_score + depth_score + structure_score)::NUMERIC / 3))::INTEGER AS avg_score
       FROM interview_sessions
       WHERE user_id = $1 AND completed_at IS NOT NULL`,
      [userId]
    ),
    query(
      `SELECT COUNT(*)::INTEGER AS sessions_this_week
       FROM interview_sessions
       WHERE user_id = $1 AND completed_at >= $2`,
      [userId, sevenDaysAgo]
    ),
    query(
      `SELECT ia.filler_words_detected
       FROM interview_answers ia
       JOIN interview_sessions iss ON iss.id = ia.session_id
       WHERE iss.user_id = $1 AND ia.answered_at >= $2`,
      [userId, sevenDaysAgo]
    ),
  ]);

  const user = userResult.rows[0];
  const trimindScore = user?.trimind_score ?? 0;
  const oldScore = scoreHistoryResult.rows[0]?.score ?? trimindScore;
  const scoreDelta = trimindScore - oldScore;

  const dailyNudge = nudgeRaw ? JSON.parse(nudgeRaw) : null;

  const roadmap = roadmapRaw ? JSON.parse(roadmapRaw) : null;
  const streakDay = Math.max(0, (user?.streak_days ?? 1) - 1);
  const nextRoadmapTopic = roadmap?.plan?.[streakDay % 7] ?? null;

  const totalSpent = spentResult.rows[0].total_spent;
  const monthlyBudget = user?.monthly_budget ?? 1;
  const budgetUsedPercent = Math.round((totalSpent / monthlyBudget) * 100);
  const dailyAvg = daysElapsed > 0 ? Math.round(totalSpent / daysElapsed) : 0;
  const predictedBalance = monthlyBudget - totalSpent - dailyAvg * daysRemaining;

  const fillerAggregate = {};
  for (const row of fillerResult.rows) {
    const breakdown = row.filler_words_detected || {};
    for (const [word, count] of Object.entries(breakdown)) {
      fillerAggregate[word] = (fillerAggregate[word] || 0) + count;
    }
  }

  return sendSuccess(res, {
    trimind_score: trimindScore,
    score_delta_7days: scoreDelta,
    daily_nudge: dailyNudge,
    study: {
      weak_topics: weakTopicsResult.rows.map(r => ({ topic: r.concept_tag, accuracy: r.accuracy_pct })),
      streak_days: user?.streak_days ?? 0,
      next_roadmap_topic: nextRoadmapTopic,
    },
    finance: {
      budget_used_percent: budgetUsedPercent,
      predicted_balance_paise: predictedBalance,
      top_category: topCategoryResult.rows[0] ?? null,
    },
    interview: {
      avg_score: interviewResult.rows[0]?.avg_score ?? null,
      sessions_this_week: interviewWeekResult.rows[0]?.sessions_this_week ?? 0,
      filler_trend: fillerAggregate,
    },
  });
};

export const nudgeGenerateStub = async (req, res) => {
  return sendSuccess(res, {
    text: 'AI-generated nudge text — Claude will fill this endpoint.',
    cached: false,
  });
};
