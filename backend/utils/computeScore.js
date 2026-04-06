import { query } from '../db/index.js';

const cap = (val, max) => Math.min(Math.round(val), max);

export const computeScoreForUser = async (userId) => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const [studyResult, userResult, spentResult, goalsResult, interviewResult] = await Promise.all([
    query(
      `SELECT AVG(score)::FLOAT AS avg_score
       FROM quiz_sessions
       WHERE user_id = $1 AND completed_at IS NOT NULL AND completed_at >= $2`,
      [userId, fourteenDaysAgo]
    ),
    query(
      `SELECT streak_days, monthly_budget FROM users WHERE id = $1`,
      [userId]
    ),
    query(
      `SELECT COALESCE(SUM(amount_paise), 0)::INTEGER AS total_spent
      FROM expenses
      WHERE user_id = $1 AND deleted_at IS NULL AND TO_CHAR(logged_at, 'YYYY-MM') = $2`,
      [userId, currentMonth]
    ),
    query(
      `SELECT saved_amount_paise, target_amount_paise
      FROM savings_goals
      WHERE user_id = $1 AND is_active = TRUE
      ORDER BY created_at DESC LIMIT 1`,
      [userId]
    ),
    query(
      `SELECT clarity_score, depth_score, structure_score
      FROM interview_sessions
      WHERE user_id = $1 AND completed_at IS NOT NULL
      ORDER BY completed_at DESC LIMIT 5`,
      [userId]
    ),
  ]);

  const user = userResult.rows[0];
  if (!user) return null;

  const avgQuizScore = studyResult.rows[0]?.avg_score ?? 0;
  let studyComponent = cap(avgQuizScore * 4, 400);
  if ((user.streak_days ?? 0) >= 7) studyComponent = Math.min(studyComponent + 20, 400);

  const totalSpent = spentResult.rows[0].total_spent;
  const monthlyBudget = user.monthly_budget || 1;
  const budgetAdherence = cap((1 - totalSpent / monthlyBudget) * 100, 100);

  let savingsProgress = 0;
  const goal = goalsResult.rows[0];
  if (goal && goal.target_amount_paise > 0) {
    savingsProgress = cap((goal.saved_amount_paise / goal.target_amount_paise) * 100, 100);
  }
  const financeComponent = cap(budgetAdherence * 2.5 + savingsProgress * 0.5, 300);

  let interviewComponent = 0;
  const interviewSessions = interviewResult.rows;
  if (interviewSessions.length > 0) {
    const avgInterview = interviewSessions.reduce((sum, s) => {
      const sessionAvg = ((s.clarity_score ?? 0) + (s.depth_score ?? 0) + (s.structure_score ?? 0)) / 3;
      return sum + sessionAvg;
    }, 0) / interviewSessions.length;
    interviewComponent = cap(avgInterview * 3, 300);
  }

  const totalScore = cap(studyComponent + financeComponent + interviewComponent, 1000);

  await query(
    `INSERT INTO trimind_score_history (user_id, score, study_component, finance_component, interview_component)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, totalScore, studyComponent, financeComponent, interviewComponent]
  );

  await query(
    `UPDATE users SET trimind_score = $1, last_active_at = NOW() WHERE id = $2`,
    [totalScore, userId]
  );

  return { totalScore, studyComponent, financeComponent, interviewComponent };
};
