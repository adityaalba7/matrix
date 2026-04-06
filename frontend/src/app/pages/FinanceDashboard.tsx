import { Card } from "../components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { Mic, Plus, Coffee, Bus, Zap, Gamepad2, MoreHorizontal, AlertOctagon, TrendingDown, Users, Flame, Smartphone, Utensils } from "lucide-react";
import { motion } from "motion/react";

const data = [
  { name: 'Food', value: 2400, color: '#E8620A', icon: Coffee },
  { name: 'Transport', value: 800, color: '#D93B3B', icon: Bus },
  { name: 'Bills', value: 1200, color: '#0EA882', icon: Zap },
  { name: 'Fun', value: 600, color: '#5B47E0', icon: Gamepad2 },
  { name: 'Other', value: 400, color: '#8A8FA8', icon: MoreHorizontal },
];

const totalSpent = data.reduce((acc, curr) => acc + curr.value, 0);
const budget = 8000;
const left = budget - totalSpent;

const lineData = [
  { day: '1', actual: 8000, projected: 8000 },
  { day: '5', actual: 7200, projected: 7100 },
  { day: '10', actual: 6100, projected: 5900 },
  { day: '15', actual: 4800, projected: 4700 },
  { day: '20', actual: 3200, projected: 3500 },
  { day: '25', actual: null, projected: 2300 },
  { day: '30', actual: null, projected: 340 },
];

export default function FinanceDashboard() {
  return (
    <div className="space-y-8 pb-10">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-surface border-t-[3px] border-t-saffron border-l-border-default border-r-border-default border-b-border-default flex flex-col justify-center">
          <div className="text-[32px] font-display text-text-primary leading-none mb-1">₹{left.toLocaleString()}</div>
          <div className="text-[12px] text-text-secondary font-medium uppercase tracking-wider">Left this month</div>
        </Card>
        <Card className="p-5 bg-surface border border-border-default flex flex-col justify-center">
          <div className="text-[32px] font-display text-text-primary leading-none mb-1">₹{totalSpent.toLocaleString()}</div>
          <div className="text-[12px] text-text-secondary font-medium uppercase tracking-wider">Total Spent</div>
        </Card>
        <Card className="p-5 bg-surface border border-border-default flex flex-col justify-center">
          <div className="text-[32px] font-display text-emerald leading-none mb-1">18%</div>
          <div className="text-[12px] text-text-secondary font-medium uppercase tracking-wider">Savings Rate</div>
        </Card>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-6 bg-surface border border-border-default h-[380px] flex flex-col items-center justify-center relative">
            <div className="h-[240px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={105}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                    isAnimationActive={true}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-text-secondary text-[12px] uppercase tracking-wider font-semibold">Spent</span>
                <span className="font-display text-3xl mt-1 text-text-primary">₹{totalSpent.toLocaleString()}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-6 w-full px-4">
              {data.map((item) => (
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

          <Card className="flex-1 bg-surface border border-border-default overflow-hidden flex flex-col">
            <div className="p-5 border-b border-border-default">
              <h3 className="font-heading font-bold text-lg text-text-primary">Recent Transactions</h3>
            </div>
            <div className="flex-1 divide-y divide-border-default">
              {[
                { name: "Zomato", amount: 240, category: "Food", date: "Today", color: "#E8620A", icon: Coffee },
                { name: "Uber", amount: 180, category: "Transport", date: "Today", color: "#D93B3B", icon: Bus },
                { name: "Spotify", amount: 119, category: "Fun", date: "Yesterday", color: "#5B47E0", icon: Gamepad2 },
                { name: "Jio", amount: 299, category: "Bills", date: "Jun 12", color: "#0EA882", icon: Zap },
                { name: "Amazon", amount: 450, category: "Other", date: "Jun 10", color: "#8A8FA8", icon: MoreHorizontal },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-primary-bg transition-colors cursor-pointer even:bg-[#F7F6F2]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-border-default bg-surface" style={{ color: tx.color }}>
                      <tx.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-sans font-semibold text-[15px] text-text-primary mb-0.5">{tx.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider bg-elevated px-2 py-0.5 rounded-md border border-border-default">{tx.category}</span>
                        <span className="text-[11px] text-text-tertiary font-medium">{tx.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-[16px] text-text-primary">-₹{tx.amount}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-3 flex flex-col gap-6">
          <Card className="p-6 bg-surface border border-border-default flex flex-col md:flex-row gap-6 items-center">
            <div className="flex flex-col items-center gap-3">
              <button className="w-20 h-20 rounded-full bg-saffron text-surface flex items-center justify-center shadow-[0_4px_15px_rgba(232,98,10,0.3)] hover:scale-105 transition-transform active:scale-95">
                <Mic className="w-8 h-8" />
              </button>
              <span className="text-sm font-bold text-text-primary">Voice Log</span>
            </div>
            
            <div className="flex-1 w-full border-l md:border-l-border-default md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 border-border-default">
              <input type="text" placeholder="Or type: 'Paid ₹240 for lunch'" className="w-full bg-primary-bg border border-border-default rounded-xl px-4 py-3 text-[15px] outline-none focus:border-saffron mb-4 font-sans shadow-sm" />
              <div className="flex gap-2 flex-wrap">
                {data.slice(0,4).map(cat => (
                  <button key={cat.name} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-border-default bg-surface hover:bg-primary-bg transition-colors flex items-center gap-1.5 shadow-sm text-text-secondary">
                    <cat.icon className="w-3.5 h-3.5" style={{color: cat.color}} />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-surface border border-border-default flex-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-heading font-bold text-lg text-text-primary mb-1">Month-end Prediction</h3>
                <p className="text-sm text-text-secondary font-medium">At this rate — <span className="font-bold text-text-primary">₹340 left</span> on April 30.</p>
              </div>
              <div className="bg-primary-bg border border-border-default p-2 rounded-lg text-xs font-medium text-text-secondary">
                <span className="font-bold text-emerald">What if:</span> Reduce Food by 20% → ₹820 left
              </div>
            </div>
            
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#A8A8B3'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#A8A8B3'}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="actual" stroke="#E8620A" strokeWidth={3} dot={true} />
                  <Line type="monotone" dataKey="projected" stroke="#E8E6DF" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 bg-surface border border-border-default flex items-center gap-6">
            <div className="w-20 h-20 rounded-full border-[6px] border-primary-bg relative shadow-sm flex items-center justify-center shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#E8E6DF" strokeWidth="8" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="#E8620A" strokeWidth="8" strokeDasharray="289" strokeDashoffset="167" strokeLinecap="round" />
              </svg>
              <TrendingDown className="w-6 h-6 text-saffron" />
            </div>
            <div>
              <div className="text-xs font-bold text-saffron uppercase tracking-wider mb-1">Savings Goal</div>
              <h3 className="font-heading font-bold text-[18px] text-text-primary mb-1">Goa Trip Fund</h3>
              <p className="text-sm font-mono font-bold text-text-primary">₹4,200 <span className="text-text-tertiary">/ ₹10,000</span></p>
              <p className="text-xs text-text-secondary mt-1 font-medium"><span className="text-rose font-bold">₹198/day</span> needed to hit goal.</p>
            </div>
          </Card>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
            <p className="text-sm font-bold text-rose mb-1">₹700 Amazon</p>
            <p className="text-xs text-text-secondary">You were 34% behind savings goal when this occurred.</p>
          </div>
        </Card>

        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center text-saffron">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Dream Purchase</h3>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 bg-primary-bg border border-border-default rounded-xl flex items-center justify-center text-2xl">📱</div>
            <div className="flex-1">
              <div className="font-bold text-sm text-text-primary mb-1">Nothing Phone 2a</div>
              <div className="h-1.5 w-full bg-border-default rounded-full mb-1">
                <div className="h-full bg-saffron rounded-full w-[45%]"></div>
              </div>
              <div className="text-xs text-text-secondary font-medium">45 days left · ₹300/day</div>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center text-saffron">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Chai Latte Effect</h3>
          </div>
          <div className="flex gap-2 mb-3">
            <input type="text" value="₹120" readOnly className="w-20 bg-primary-bg border border-border-default rounded-lg px-3 py-1.5 text-sm font-bold text-text-primary outline-none" />
            <span className="text-xs text-text-secondary self-center">/ day</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-primary-bg p-2 rounded border border-border-default text-center"><div className="text-[10px] text-text-tertiary uppercase font-bold mb-1">1 Yr</div><div className="text-xs font-bold">₹43k</div></div>
            <div className="bg-primary-bg p-2 rounded border border-border-default text-center"><div className="text-[10px] text-text-tertiary uppercase font-bold mb-1">4 Yr</div><div className="text-xs font-bold text-rose">₹1.7L</div></div>
            <div className="bg-primary-bg p-2 rounded border border-border-default text-center"><div className="text-[10px] text-text-tertiary uppercase font-bold mb-1">10 Yr</div><div className="text-xs font-bold text-rose">₹4.3L</div></div>
          </div>
        </Card>

        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Peer Benchmark</h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed mb-3">Avg student at your college type spends ₹4,200/mo on food. <span className="font-bold text-rose">You spend ₹6,800.</span></p>
          <div className="space-y-2 mt-auto">
            <div className="h-2 w-[60%] bg-border-default rounded-full relative"><span className="absolute -right-8 -top-1.5 text-[10px] font-bold text-text-secondary">₹4.2k</span></div>
            <div className="h-2 w-full bg-rose rounded-full relative"><span className="absolute -right-8 -top-1.5 text-[10px] font-bold text-rose">₹6.8k</span></div>
          </div>
        </Card>

        <Card className="p-5 bg-[#1A1D2E] border border-[#2A2E45] hover:bg-[#202438] transition-colors flex flex-col justify-between shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-saffron/20 flex items-center justify-center text-saffron">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-white">AI Budget Roast</h3>
          </div>
          <p className="text-[13px] text-white/70 italic font-serif leading-relaxed">"Another Uber? Your legs work fine, Aditya. You're not the CEO of Reliance yet."</p>
          <button className="mt-4 text-xs font-bold text-saffron bg-saffron/10 py-2.5 rounded-lg hover:bg-saffron/20 transition-colors w-full border border-saffron/20">Generate this week's roast →</button>
        </Card>

        <div className="grid grid-rows-2 gap-5">
          <Card className="p-4 bg-surface border border-border-default hover:bg-elevated transition-colors flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-sm text-text-primary mb-0.5">UPI SMS Auto-Import</h3>
              <p className="text-[11px] text-text-secondary">Paste SMS → AI logs it.</p>
            </div>
            <button className="px-3 py-1.5 bg-primary-bg border border-border-default rounded-md text-xs font-semibold text-text-primary">→</button>
          </Card>

          <Card className="p-4 bg-surface border border-border-default hover:bg-elevated transition-colors flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center text-saffron shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-sm text-text-primary mb-0.5">Canteen Mode</h3>
              <div className="flex gap-1 mt-1">
                <span className="w-4 h-4 bg-emerald/20 text-emerald text-[10px] flex items-center justify-center rounded">✓</span>
                <span className="w-4 h-4 bg-emerald/20 text-emerald text-[10px] flex items-center justify-center rounded">✓</span>
                <span className="w-4 h-4 bg-primary-bg border border-border-default text-text-tertiary text-[10px] flex items-center justify-center rounded">?</span>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}