import { validationResult } from 'express-validator';
import { query } from '../db/index.js';
import { sendSuccess, sendError } from '../utils/response.js';

const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    sendError(res, 'VALIDATION_ERROR', first.msg, 422);
    return false;
  }
  return true;
};

export const logExpense = async (req, res) => {
  if (!checkValidation(req, res)) return;

  const { amount_paise, category, merchant, note, source, upi_ref, logged_at } = req.body;

  const { rows } = await query(
    `INSERT INTO expenses (user_id, amount_paise, category, merchant, note, source, upi_ref, logged_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      req.user.id,
      amount_paise,
      category || null,
      merchant || null,
      note || null,
      source || 'manual',
      upi_ref || null,
      logged_at || new Date(),
    ]
  );

  return sendSuccess(res, { expense: rows[0] }, {}, 201);
};

export const listExpenses = async (req, res) => {
  const { month, category, page = 1 } = req.query;
  const LIMIT = 20;
  const OFFSET = (parseInt(page) - 1) * LIMIT;

  const conditions = ['user_id = $1', 'deleted_at IS NULL'];
  const params = [req.user.id];
  let paramIdx = 2;

  if (month) {
    conditions.push(`TO_CHAR(logged_at, 'YYYY-MM') = $${paramIdx}`);
    params.push(month);
    paramIdx++;
  }

  if (category) {
    conditions.push(`category = $${paramIdx}`);
    params.push(category);
    paramIdx++;
  }

  const whereClause = conditions.join(' AND ');

  const [dataResult, countResult] = await Promise.all([
    query(
      `SELECT * FROM expenses WHERE ${whereClause} ORDER BY logged_at DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, LIMIT, OFFSET]
    ),
    query(`SELECT COUNT(*) FROM expenses WHERE ${whereClause}`, params),
  ]);

  const total = parseInt(countResult.rows[0].count);

  return sendSuccess(res, { expenses: dataResult.rows }, {
    total,
    page: parseInt(page),
    pages: Math.ceil(total / LIMIT),
  });
};

export const editExpense = async (req, res) => {
  if (!checkValidation(req, res)) return;

  const { id } = req.params;
  const ALLOWED = ['amount_paise', 'category', 'note', 'merchant'];
  const updates = {};

  for (const key of ALLOWED) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return sendError(res, 'NO_FIELDS', 'No updatable fields were provided.', 400);
  }

  const setClauses = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`);
  const values = Object.values(updates);
  values.push(id, req.user.id);

  const { rows, rowCount } = await query(
    `UPDATE expenses SET ${setClauses.join(', ')}
     WHERE id = $${values.length - 1} AND user_id = $${values.length} AND deleted_at IS NULL
     RETURNING *`,
    values
  );

  if (rowCount === 0) {
    return sendError(res, 'NOT_FOUND', 'Expense not found or access denied.', 404);
  }

  return sendSuccess(res, { expense: rows[0] });
};

export const deleteExpense = async (req, res) => {
  const { id } = req.params;

  const { rowCount } = await query(
    `UPDATE expenses SET deleted_at = NOW()
     WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
    [id, req.user.id]
  );

  if (rowCount === 0) {
    return sendError(res, 'NOT_FOUND', 'Expense not found or already deleted.', 404);
  }

  return sendSuccess(res, { message: 'Expense deleted.' });
};

export const getSummary = async (req, res) => {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const { rows } = await query(
    `SELECT category, SUM(amount_paise)::INTEGER AS total_paise, COUNT(*)::INTEGER AS count
     FROM expenses
     WHERE user_id = $1
       AND deleted_at IS NULL
       AND TO_CHAR(logged_at, 'YYYY-MM') = $2
     GROUP BY category
     ORDER BY total_paise DESC`,
    [req.user.id, month]
  );

  const totalSpent = rows.reduce((sum, r) => sum + r.total_paise, 0);

  return sendSuccess(res, { month, by_category: rows, total_paise: totalSpent });
};

export const getPrediction = async (req, res) => {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysElapsed = now.getDate();
  const daysRemaining = daysInMonth - daysElapsed;

  const [spentResult, userResult] = await Promise.all([
    query(
      `SELECT COALESCE(SUM(amount_paise), 0)::INTEGER AS total_spent
       FROM expenses
       WHERE user_id = $1 AND deleted_at IS NULL AND TO_CHAR(logged_at, 'YYYY-MM') = $2`,
      [req.user.id, month]
    ),
    query(`SELECT monthly_budget FROM users WHERE id = $1`, [req.user.id]),
  ]);

  const totalSpent = spentResult.rows[0].total_spent;
  const monthlyBudget = userResult.rows[0].monthly_budget;

  const dailyAvg = daysElapsed > 0 ? Math.round(totalSpent / daysElapsed) : 0;
  const predictedBalance = monthlyBudget - totalSpent - (dailyAvg * daysRemaining);

  return sendSuccess(res, {
    predicted_balance_paise: predictedBalance,
    days_remaining: daysRemaining,
    daily_avg_paise: dailyAvg,
    total_spent_paise: totalSpent,
    monthly_budget_paise: monthlyBudget,
  });
};

export const listGoals = async (req, res) => {
  const { rows } = await query(
    `SELECT * FROM savings_goals WHERE user_id = $1 AND is_active = TRUE ORDER BY created_at DESC`,
    [req.user.id]
  );

  return sendSuccess(res, { goals: rows });
};

export const createGoal = async (req, res) => {
  if (!checkValidation(req, res)) return;

  const { title, target_amount_paise, target_date } = req.body;

  const { rows } = await query(
    `INSERT INTO savings_goals (user_id, title, target_amount_paise, target_date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [req.user.id, title, target_amount_paise, target_date || null]
  );

  return sendSuccess(res, { goal: rows[0] }, {}, 201);
};

export const updateGoalProgress = async (req, res) => {
  if (!checkValidation(req, res)) return;

  const { id } = req.params;
  const { saved_amount_paise } = req.body;

  const { rows, rowCount } = await query(
    `UPDATE savings_goals
     SET saved_amount_paise = $1
     WHERE id = $2 AND user_id = $3 AND is_active = TRUE
     RETURNING *`,
    [saved_amount_paise, id, req.user.id]
  );

  if (rowCount === 0) {
    return sendError(res, 'NOT_FOUND', 'Goal not found or access denied.', 404);
  }

  return sendSuccess(res, { goal: rows[0] });
};

export const parseSms = async (req, res) => {
  return sendSuccess(res, {
    merchant: 'Swiggy',
    amount_paise: 34000,
    category: 'food',
  });
};

export const parseReceipt = async (req, res) => {
  return sendSuccess(res, {
    items: [{ item: 'Burger', amount_paise: 18000 }],
  });
};

export const parseVoice = async (req, res) => {
  return sendSuccess(res, {
    amount_paise: 15000,
    category: 'food',
    note: 'chai',
  });
};

export const roast = async (req, res) => {
  return sendSuccess(res, {
    roast_text: 'Mock roast text',
    cached: false,
  });
};
