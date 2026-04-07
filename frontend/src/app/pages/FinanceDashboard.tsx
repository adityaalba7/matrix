import { Card } from "../components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { Mic, Plus, Coffee, Bus, Zap, Gamepad2, MoreHorizontal, AlertOctagon, TrendingDown, Users, Flame, Smartphone, Utensils, Send, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useUser } from "../../lib/userContext";
import { logExpense, listExpenses, deleteExpense, getSummary, getPrediction, listGoals, createGoal, updateGoalProgress, getRoast, parseSms } from "../../lib/finance";

const CATEGORY_META: Record<string, { color: string; icon: any; label: string }> = {
  food:      { color: '#E8620A', icon: Coffee,         label: 'Food' },
  transport: { color: '#D93B3B', icon: Bus,             label: 'Transport' },
  bills:     { color: '#0EA882', icon: Zap,             label: 'Bills' },
  fun:       { color: '#5B47E0', icon: Gamepad2,        label: 'Fun' },
  study:     { color: '#3B82F6', icon: Smartphone,      label: 'Study' },
  other:     { color: '#8A8FA8', icon: MoreHorizontal,  label: 'Other' },
};

export default function FinanceDashboard() {
  const { user } = useUser();

  // Data
  const [summary, setSummary] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [roastText, setRoastText] = useState('');

  // Input
  const [expenseText, setExpenseText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [isLogging, setIsLogging] = useState(false);

  // SMS
  const [smsText, setSmsText] = useState('');
  const [smsParsing, setSmsParsing] = useState(false);

  // Roast
  const [roastLoading, setRoastLoading] = useState(false);

  // Goal saving
  const [saveAmount, setSaveAmount] = useState('');

  // Goal creation
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalAmount, setGoalAmount] = useState('');

  const fetchAll = async () => {
    try {
      const [sumRes, predRes, expRes, goalRes] = await Promise.all([
        getSummary().catch(() => null),
        getPrediction().catch(() => null),
        listExpenses().catch(() => ({ expenses: [] })),
        listGoals().catch(() => ({ goals: [] })),
      ]);
      if (sumRes) setSummary(sumRes);
      if (predRes) setPrediction(predRes);
      setExpenses(expRes?.expenses || []);
      setGoals(goalRes?.goals || []);
    } catch { /* silent */ }
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Derived data ──────────────────────────────────────────────────────────

  const budget = prediction?.monthly_budget_paise || user?.monthly_budget || 800000;
  const totalSpent = summary?.total_paise || prediction?.total_spent_paise || 0;
  const left = budget - totalSpent;
  const savingsRate = budget > 0 ? Math.round((left / budget) * 100) : 0;

  // Pie chart data
  const pieData = (summary?.by_category || []).map((c: any) => ({
    name: CATEGORY_META[c.category]?.label || c.category,
    value: Math.round(c.total_paise / 100),
    color: CATEGORY_META[c.category]?.color || '#8A8FA8',
    icon: CATEGORY_META[c.category]?.icon || MoreHorizontal,
  }));

  // Line chart projection
  const daysInMonth = prediction?.days_remaining
    ? new Date().getDate() + prediction.days_remaining
    : 30;
  const dailyAvg = prediction?.daily_avg_paise || 0;
  const lineData = Array.from({ length: 6 }, (_, i) => {
    const day = Math.round((i / 5) * daysInMonth) || 1;
    const elapsed = Math.min(day, new Date().getDate());
    const actual = day <= new Date().getDate() ? Math.round((budget - dailyAvg * elapsed) / 100) : null;
    const projected = Math.round((budget - dailyAvg * day) / 100);
    return { day: String(day), actual, projected: Math.max(0, projected) };
  });

  // First active goal
  const activeGoal = goals[0];

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogExpense = async () => {
    if (!expenseText.trim()) return;
    setIsLogging(true);
    try {
      // Parse amount from text like "240", "₹240", "paid 240 for lunch"
      const amountMatch = expenseText.match(/₹?\s*(\d+)/);
      const amount = amountMatch ? parseInt(amountMatch[1]) : 0;
      if (amount <= 0) { alert('Could not detect amount. Try: "240 for lunch"'); setIsLogging(false); return; }

      // Extract note (everything except the amount part)
      const note = expenseText.replace(/₹?\s*\d+/, '').replace(/^[\s,for-]+/, '').trim();

      await logExpense({
        amount_paise: amount * 100,
        category: selectedCategory,
        note: note || undefined,
        source: 'manual',
      });
      setExpenseText('');
      fetchAll();
    } catch (err) {
      console.error(err);
      alert('Failed to log expense.');
    }
    setIsLogging(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
      fetchAll();
    } catch { alert('Failed to delete.'); }
  };

  const handleRoast = async () => {
    setRoastLoading(true);
    try {
      const data = await getRoast();
      setRoastText(data.roast_text);
    } catch { setRoastText("AI couldn't generate a roast right now."); }
    setRoastLoading(false);
  };

  const handleSmsImport = async () => {
    if (!smsText.trim()) return;
    setSmsParsing(true);
    try {
      const parsed = await parseSms(smsText);
      await logExpense({
        amount_paise: parsed.amount_paise,
        category: parsed.category,
        merchant: parsed.merchant,
        source: 'upi_sms',
      });
      setSmsText('');
      fetchAll();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'SMS parsing failed. Try a debit/payment SMS.';
      alert(msg);
    }
    setSmsParsing(false);
  };

  const handleCreateGoal = async () => {
    if (!goalTitle.trim() || !goalAmount.trim()) return;
    try {
      await createGoal({
        title: goalTitle,
        target_amount_paise: parseInt(goalAmount) * 100,
      });
      setGoalTitle('');
      setGoalAmount('');
      setShowGoalForm(false);
      fetchAll();
    } catch { alert('Failed to create goal.'); }
  };

  // Format amount paise to rupees
  const fmt = (paise: number) => `₹${Math.round(paise / 100).toLocaleString()}`;
  const fmtDate = (d: string) => {
    const date = new Date(d);
    const today = new Date();
    const diff = Math.floor((today.getTime() - date.getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-surface border-t-[3px] border-t-saffron border-l-border-default border-r-border-default border-b-border-default flex flex-col justify-center">
          <div className="text-[32px] font-display text-text-primary leading-none mb-1">{fmt(left)}</div>
          <div className="text-[12px] text-text-secondary font-medium uppercase tracking-wider">Left this month</div>
        </Card>
        <Card className="p-5 bg-surface border border-border-default flex flex-col justify-center">
          <div className="text-[32px] font-display text-text-primary leading-none mb-1">{fmt(totalSpent)}</div>
          <div className="text-[12px] text-text-secondary font-medium uppercase tracking-wider">Total Spent</div>
        </Card>
        <Card className="p-5 bg-surface border border-border-default flex flex-col justify-center">
          <div className={`text-[32px] font-display leading-none mb-1 ${savingsRate > 30 ? 'text-emerald' : savingsRate > 10 ? 'text-saffron' : 'text-rose'}`}>{savingsRate}%</div>
          <div className="text-[12px] text-text-secondary font-medium uppercase tracking-wider">Savings Rate</div>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Pie Chart */}
          <Card className="p-6 bg-surface border border-border-default h-[380px] flex flex-col items-center justify-center relative">
            <div className="h-[240px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData.length > 0 ? pieData : [{ name: 'No data', value: 1, color: '#E8E6DF' }]}
                    cx="50%" cy="50%" innerRadius={75} outerRadius={105} paddingAngle={4} dataKey="value" stroke="none" cornerRadius={8}>
                    {(pieData.length > 0 ? pieData : [{ color: '#E8E6DF' }]).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-text-secondary text-[12px] uppercase tracking-wider font-semibold">Spent</span>
                <span className="font-display text-3xl mt-1 text-text-primary">{fmt(totalSpent)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-6 w-full px-4">
              {pieData.map((item: any) => (
                <div key={item.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-text-primary font-sans">{item.name}</span>
                  </div>
                  <span className="text-xs text-text-secondary font-mono">₹{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="flex-1 bg-surface border border-border-default overflow-hidden flex flex-col">
            <div className="p-5 border-b border-border-default">
              <h3 className="font-heading font-bold text-lg text-text-primary">Recent Transactions</h3>
            </div>
            <div className="flex-1 divide-y divide-border-default">
              {expenses.length === 0 ? (
                <div className="p-6 text-center text-sm text-text-secondary">No expenses logged yet. Start by adding one above!</div>
              ) : (
                expenses.slice(0, 5).map((tx: any) => {
                  const meta = CATEGORY_META[tx.category] || CATEGORY_META.other;
                  const Icon = meta.icon;
                  return (
                    <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-primary-bg transition-colors cursor-pointer even:bg-[#F7F6F2] group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-border-default bg-surface" style={{ color: meta.color }}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-sans font-semibold text-[15px] text-text-primary mb-0.5">{tx.merchant || tx.note || meta.label}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider bg-elevated px-2 py-0.5 rounded-md border border-border-default">{meta.label}</span>
                            <span className="text-[11px] text-text-tertiary font-medium">{fmtDate(tx.logged_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="font-mono font-bold text-[16px] text-text-primary">-{fmt(tx.amount_paise)}</div>
                        <button onClick={() => handleDelete(tx.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-text-tertiary hover:text-rose">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Quick Log */}
          <Card className="p-6 bg-surface border border-border-default flex flex-col md:flex-row gap-6 items-center">
            <div className="flex flex-col items-center gap-3">
              <button className="w-20 h-20 rounded-full bg-saffron text-surface flex items-center justify-center shadow-[0_4px_15px_rgba(232,98,10,0.3)] hover:scale-105 transition-transform active:scale-95">
                <Mic className="w-8 h-8" />
              </button>
              <span className="text-sm font-bold text-text-primary">Voice Log</span>
            </div>

            <div className="flex-1 w-full border-l md:border-l-border-default md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 border-border-default">
              <div className="flex gap-2 mb-4">
                <input type="text" placeholder="Type: '240 for lunch'" value={expenseText} onChange={e => setExpenseText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogExpense()}
                  className="flex-1 bg-primary-bg border border-border-default rounded-xl px-4 py-3 text-[15px] outline-none focus:border-saffron font-sans shadow-sm" />
                <button onClick={handleLogExpense} disabled={isLogging}
                  className="bg-saffron text-surface px-4 py-3 rounded-xl font-bold text-sm hover:bg-saffron/90 transition-colors disabled:opacity-50 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> {isLogging ? '...' : 'Log'}
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(CATEGORY_META).map(([key, meta]) => (
                  <button key={key} onClick={() => setSelectedCategory(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border bg-surface hover:bg-primary-bg transition-colors flex items-center gap-1.5 shadow-sm ${
                      selectedCategory === key ? 'border-saffron text-saffron' : 'border-border-default text-text-secondary'
                    }`}>
                    <meta.icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                    {meta.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Prediction */}
          <Card className="p-6 bg-surface border border-border-default flex-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-heading font-bold text-lg text-text-primary mb-1">Month-end Prediction</h3>
                <p className="text-sm text-text-secondary font-medium">
                  At this rate — <span className="font-bold text-text-primary">{fmt(prediction?.predicted_balance_paise || 0)} left</span> on month-end.
                </p>
              </div>
              <div className="bg-primary-bg border border-border-default p-2 rounded-lg text-xs font-medium text-text-secondary">
                <span className="font-bold text-emerald">Daily avg:</span> {fmt(dailyAvg)}/day
              </div>
            </div>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A8A8B3' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A8A8B3' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="actual" stroke="#E8620A" strokeWidth={3} dot={true} connectNulls={false} />
                  <Line type="monotone" dataKey="projected" stroke="#E8E6DF" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Savings Goal */}
          <Card className="p-6 bg-surface border border-border-default flex flex-col gap-4">
            {activeGoal ? (
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-full border-[6px] border-primary-bg relative shadow-sm flex items-center justify-center shrink-0">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="#E8E6DF" strokeWidth="8" />
                    <circle cx="50" cy="50" r="46" fill="none" stroke="#E8620A" strokeWidth="8"
                      strokeDasharray="289"
                      strokeDashoffset={289 - 289 * Math.min((activeGoal.saved_amount_paise || 0) / activeGoal.target_amount_paise, 1)}
                      strokeLinecap="round" />
                  </svg>
                  <TrendingDown className="w-6 h-6 text-saffron" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-saffron uppercase tracking-wider mb-1">Savings Goal</div>
                  <h3 className="font-heading font-bold text-[18px] text-text-primary mb-1">{activeGoal.title}</h3>
                  <p className="text-sm font-mono font-bold text-text-primary mb-3">
                    {fmt(activeGoal.saved_amount_paise || 0)} <span className="text-text-tertiary">/ {fmt(activeGoal.target_amount_paise)}</span>
                  </p>
                  {/* Add savings input */}
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Add ₹ amount saved"
                      value={saveAmount}
                      onChange={e => setSaveAmount(e.target.value)}
                      className="flex-1 bg-primary-bg border border-border-default rounded-lg px-3 py-1.5 text-sm outline-none focus:border-saffron"
                    />
                    <button
                      onClick={async () => {
                        const add = parseInt(saveAmount);
                        if (!add || add <= 0) return;
                        try {
                          await updateGoalProgress(activeGoal.id, (activeGoal.saved_amount_paise || 0) + add * 100);
                          setSaveAmount('');
                          fetchAll();
                        } catch { alert('Failed to update goal.'); }
                      }}
                      className="bg-saffron text-surface px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-saffron/90 transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 text-center py-4">
                {showGoalForm ? (
                  <div className="flex flex-col gap-2 max-w-xs mx-auto">
                    <input type="text" placeholder="Goal title (e.g. Goa Trip)" value={goalTitle} onChange={e => setGoalTitle(e.target.value)}
                      className="bg-primary-bg border border-border-default rounded-lg px-3 py-2 text-sm outline-none focus:border-saffron" />
                    <input type="number" placeholder="Target amount (₹)" value={goalAmount} onChange={e => setGoalAmount(e.target.value)}
                      className="bg-primary-bg border border-border-default rounded-lg px-3 py-2 text-sm outline-none focus:border-saffron" />
                    <button onClick={handleCreateGoal} className="bg-saffron text-surface py-2 rounded-lg text-sm font-bold">Create Goal</button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-text-secondary mb-3">No savings goal set yet.</p>
                    <button onClick={() => setShowGoalForm(true)} className="text-sm font-bold text-saffron">+ Create a savings goal</button>
                  </>
                )}
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* AI Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Impulse Buy Detector */}
        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose/10 flex items-center justify-center text-rose">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-semibold text-[15px] text-text-primary">Impulse Buy Detector</h3>
            </div>
            <div className="w-10 h-5 bg-emerald rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-surface rounded-full absolute right-0.5 top-0.5 shadow-sm"></div></div>
          </div>
          <div className="bg-rose/5 border border-rose/10 p-3 rounded-lg">
            {(() => {
              // Flag expenses that are 2x above daily average — classic impulse buy signal
              const avg = dailyAvg; // paise per day from prediction API
              const threshold = avg > 0 ? avg * 2 : 50000; // fallback: flag anything > ₹500
              const impulses = expenses.filter(e => e.amount_paise >= threshold);
              if (impulses.length === 0) {
                return <p className="text-xs text-text-secondary">No impulse purchases detected this month. Keep it up! 🎯</p>;
              }
              const worst = impulses.reduce((a, b) => a.amount_paise > b.amount_paise ? a : b);
              const overBy = avg > 0 ? Math.round((worst.amount_paise - avg) / 100) : null;
              return (
                <>
                  <p className="text-sm font-bold text-rose mb-1">
                    {fmt(worst.amount_paise)} — {worst.merchant || worst.note || (CATEGORY_META[worst.category]?.label || 'Purchase')}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {overBy !== null
                      ? `₹${overBy} above your daily average — flagged as a potential impulse buy.`
                      : `Flagged as a high-value purchase. ${impulses.length} total this month.`}
                  </p>
                </>
              );
            })()}
          </div>
        </Card>

        {/* Chai Latte Effect */}
        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center text-saffron">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Chai Latte Effect</h3>
          </div>
          <div className="flex gap-2 mb-3">
            <input type="text" value={dailyAvg > 0 ? `₹${Math.round(dailyAvg / 100)}` : '₹0'} readOnly className="w-20 bg-primary-bg border border-border-default rounded-lg px-3 py-1.5 text-sm font-bold text-text-primary outline-none" />
            <span className="text-xs text-text-secondary self-center">/ day avg</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-primary-bg p-2 rounded border border-border-default text-center"><div className="text-[10px] text-text-tertiary uppercase font-bold mb-1">1 Yr</div><div className="text-xs font-bold">{fmt(dailyAvg * 365)}</div></div>
            <div className="bg-primary-bg p-2 rounded border border-border-default text-center"><div className="text-[10px] text-text-tertiary uppercase font-bold mb-1">4 Yr</div><div className="text-xs font-bold text-rose">{fmt(dailyAvg * 365 * 4)}</div></div>
            <div className="bg-primary-bg p-2 rounded border border-border-default text-center"><div className="text-[10px] text-text-tertiary uppercase font-bold mb-1">10 Yr</div><div className="text-xs font-bold text-rose">{fmt(dailyAvg * 365 * 10)}</div></div>
          </div>
        </Card>

        {/* AI Budget Roast (Gemini) */}
        <Card className="p-5 bg-[#1A1D2E] border border-[#2A2E45] hover:bg-[#202438] transition-colors flex flex-col justify-between shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-saffron/20 flex items-center justify-center text-saffron">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-white">AI Budget Roast</h3>
          </div>
          <p className="text-[13px] text-white/70 italic font-serif leading-relaxed min-h-[48px]">
            {roastText ? `"${roastText}"` : '"Click below to get roasted by AI based on your actual spending..."'}
          </p>
          <button onClick={handleRoast} disabled={roastLoading}
            className="mt-4 text-xs font-bold text-saffron bg-saffron/10 py-2.5 rounded-lg hover:bg-saffron/20 transition-colors w-full border border-saffron/20 disabled:opacity-50">
            {roastLoading ? 'Roasting...' : "Generate this week's roast →"}
          </button>
        </Card>

        {/* UPI SMS Auto-Import (Gemini) */}
        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">UPI SMS Auto-Import</h3>
          </div>
          <p className="text-[11px] text-text-secondary mb-3">Paste a UPI transaction SMS and AI will extract & log the expense.</p>
          <div className="flex gap-2 mt-auto">
            <input type="text" placeholder="Paste UPI SMS here..." value={smsText} onChange={e => setSmsText(e.target.value)}
              className="flex-1 bg-primary-bg border border-border-default rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald" />
            <button onClick={handleSmsImport} disabled={smsParsing}
              className="bg-emerald text-surface px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald/90 disabled:opacity-50">
              {smsParsing ? '...' : <Send className="w-4 h-4" />}
            </button>
          </div>
        </Card>

        {/* Peer Benchmark */}
        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Peer Benchmark</h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed mb-3">
            Avg student at your college type spends ₹4,200/mo on food.{' '}
            {pieData.find((p: any) => p.name === 'Food') ? (
              <span className={`font-bold ${(pieData.find((p: any) => p.name === 'Food')?.value || 0) > 4200 ? 'text-rose' : 'text-emerald'}`}>
                You spend ₹{pieData.find((p: any) => p.name === 'Food')?.value?.toLocaleString() || 0}.
              </span>
            ) : <span className="font-bold text-emerald">No food expenses yet.</span>}
          </p>
          <div className="space-y-2 mt-auto">
            <div className="h-2 w-[60%] bg-border-default rounded-full relative"><span className="absolute -right-8 -top-1.5 text-[10px] font-bold text-text-secondary">₹4.2k</span></div>
            <div className="h-2 bg-rose rounded-full relative" style={{ width: `${Math.min(((pieData.find((p: any) => p.name === 'Food')?.value || 0) / 6800) * 100, 100)}%` }}>
              <span className="absolute -right-10 -top-1.5 text-[10px] font-bold text-rose">₹{(pieData.find((p: any) => p.name === 'Food')?.value || 0).toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Canteen Mode */}
        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center text-saffron">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Canteen Mode</h3>
          </div>
          <p className="text-xs text-text-secondary mb-3">Quick-log your daily meals with one tap.</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Breakfast', amount: 50 },
              { label: 'Lunch', amount: 80 },
              { label: 'Dinner', amount: 100 },
            ].map(meal => (
              <button key={meal.label} onClick={() => logExpense({ amount_paise: meal.amount * 100, category: 'food', note: meal.label, source: 'manual' }).then(fetchAll)}
                className="bg-primary-bg border border-border-default rounded-lg py-2 text-center hover:bg-elevated transition-colors">
                <div className="text-[10px] text-text-tertiary font-bold uppercase">{meal.label}</div>
                <div className="text-xs font-bold text-text-primary">₹{meal.amount}</div>
              </button>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}