import api from './api';

// ── Expenses ──────────────────────────────────────────────────────────────────

export const logExpense = async (data: {
  amount_paise: number;
  category?: string;
  merchant?: string;
  note?: string;
  source?: string;
}) => {
  const res = await api.post('/finance/expenses', data);
  return res.data.data;
};

export const listExpenses = async (month?: string, category?: string, page = 1) => {
  const params: Record<string, string | number> = { page };
  if (month) params.month = month;
  if (category) params.category = category;
  const res = await api.get('/finance/expenses', { params });
  return res.data.data;
};

export const editExpense = async (id: string, data: Record<string, any>) => {
  const res = await api.patch(`/finance/expenses/${id}`, data);
  return res.data.data;
};

export const deleteExpense = async (id: string) => {
  const res = await api.delete(`/finance/expenses/${id}`);
  return res.data;
};

// ── Summary & Prediction ─────────────────────────────────────────────────────

export const getSummary = async () => {
  const res = await api.get('/finance/summary');
  return res.data.data;
};

export const getPrediction = async () => {
  const res = await api.get('/finance/prediction');
  return res.data.data;
};

// ── Savings Goals ─────────────────────────────────────────────────────────────

export const listGoals = async () => {
  const res = await api.get('/finance/goals');
  return res.data.data;
};

export const createGoal = async (data: {
  title: string;
  target_amount_paise: number;
  target_date?: string;
}) => {
  const res = await api.post('/finance/goals', data);
  return res.data.data;
};

export const updateGoalProgress = async (id: string, saved_amount_paise: number) => {
  const res = await api.patch(`/finance/goals/${id}/progress`, { saved_amount_paise });
  return res.data.data;
};

// ── AI Features ───────────────────────────────────────────────────────────────

export const getRoast = async () => {
  const res = await api.get('/finance/roast');
  return res.data.data;
};

export const parseSms = async (sms_text: string) => {
  const res = await api.post('/finance/parse/sms', { sms_text });
  return res.data.data;
};
