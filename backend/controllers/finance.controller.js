import { validationResult } from 'express-validator';
import { query } from '../db/index.js';
import { sendSuccess, sendError } from '../utils/response.js';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const askAI = async (prompt, systemInstruction = '') => {
  // Try Groq first (faster, higher limits for free tier)
  if (GROQ_API_KEY) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return text;
      }
    } catch (e) { console.error('[Groq fallthrough]', e.message); }
  }
  // Fallback to Gemini
  if (GEMINI_API_KEY) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const body = { contents: [{ parts: [{ text: prompt }] }] };
    if (systemInstruction) body.systemInstruction = { parts: [{ text: systemInstruction }] };
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!response.ok) throw new Error(`Gemini API ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  }
  throw new Error('No AI provider available');
};

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
  const { sms_text } = req.body;
  if (!sms_text) return sendError(res, 'VALIDATION_ERROR', 'sms_text is required.', 422);

  const lower = sms_text.toLowerCase();

  // Reject credit SMSes immediately (before any AI)
  const isCreditSms = (lower.includes('credited') || lower.includes('received') || lower.includes('salary'))
    && !lower.includes('debited') && !lower.includes('debit') && !lower.includes('spent') && !lower.includes('paid');
  if (isCreditSms) {
    return sendError(res, 'NOT_AN_EXPENSE', 'This is a credit SMS (money received). Please paste a debit/payment SMS to log an expense.', 400);
  }

  // ── Regex amount extraction — no AI, no hallucination ────────────────────
  // Handles: "INR 100.00", "Rs.240", "₹240", "Rs 57000", "INR1,234.56"
  const amountMatch = sms_text.match(/(?:INR|Rs\.?|₹)\s*([\d,]+(?:\.\d{1,2})?)/i);
  const amount_paise = amountMatch
    ? Math.round(parseFloat(amountMatch[1].replace(/,/g, '')) * 100)
    : 0;

  if (amount_paise <= 0) {
    return sendError(res, 'NOT_AN_EXPENSE', 'Could not find a valid debit amount in this SMS.', 400);
  }

  // ── Try to extract merchant from UPI-style SMS ────────────────────────────
  // Patterns: "to MERCHANT via", "at MERCHANT on", "VPA merchant@upi"
  const merchantMatch = sms_text.match(/\bto\s+([A-Z][A-Za-z0-9 &]{1,25}?)(?:\s+(?:via|on|ref|using)|[.,]|$)/i)
    || sms_text.match(/\bat\s+([A-Z][A-Za-z0-9 &]{1,25}?)(?:\s+(?:via|on)|[.,]|$)/i);
  const merchant = merchantMatch
    ? merchantMatch[1].trim()
    : (sms_text.match(/([A-Za-z ]+Bank[A-Za-z ]*)/i)?.[1]?.trim() || 'Bank Debit');

  // If no UPI merchant found, it's likely a generic bank debit → category = bills
  if (!merchantMatch) {
    return sendSuccess(res, { merchant, amount_paise, category: 'bills' });
  }

  // ── Use AI only to classify the category for known merchants ─────────────
  try {
    const categoryPrompt = `What category does "${merchant}" fall into for a college student's expenses? Choose exactly one: food, transport, study, fun, bills, other. Reply with just the one word.`;
    const categoryRaw = (await askAI(categoryPrompt)).toLowerCase().trim().split(/\s/)[0];
    const validCategories = ['food', 'transport', 'study', 'fun', 'bills', 'other'];
    const category = validCategories.includes(categoryRaw) ? categoryRaw : 'other';
    return sendSuccess(res, { merchant, amount_paise, category });
  } catch {
    return sendSuccess(res, { merchant, amount_paise, category: 'other' });
  }
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
  try {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const [summaryResult, userResult] = await Promise.all([
      query(
        `SELECT category, SUM(amount_paise)::INTEGER AS total_paise
         FROM expenses WHERE user_id = $1 AND deleted_at IS NULL AND TO_CHAR(logged_at, 'YYYY-MM') = $2
         GROUP BY category ORDER BY total_paise DESC`,
        [req.user.id, month]
      ),
      query(`SELECT name, monthly_budget FROM users WHERE id = $1`, [req.user.id]),
    ]);

    const userName = userResult.rows[0]?.name || 'buddy';
    const budget = userResult.rows[0]?.monthly_budget || 800000;
    const categories = summaryResult.rows;
    const totalSpent = categories.reduce((s, r) => s + r.total_paise, 0);

    const spendingSummary = categories.map(c => `${c.category}: ₹${Math.round(c.total_paise / 100)}`).join(', ');

    const prompt = `Student name: ${userName}. Monthly budget: ₹${Math.round(budget / 100)}. Spent this month: ₹${Math.round(totalSpent / 100)}. Breakdown: ${spendingSummary || 'nothing yet'}.\n\nWrite ONE short, savage, funny roast about their spending. Max 2 sentences. Indian college student humor. Be brutally honest but funny.`;

    const roastText = await askAI(prompt, 'You are a savage Indian standup comedian who roasts college students about their spending habits. Be funny, relatable, and use Indian slang.');

    return sendSuccess(res, { roast_text: roastText, cached: false });
  } catch (err) {
    console.error('[Gemini Roast]', err.message);
    return sendSuccess(res, { roast_text: "Your spending is so bad, even AI refused to roast you.", cached: false });
  }
};
