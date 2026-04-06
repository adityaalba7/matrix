import { Card } from "../components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { BookOpen, Brain, Clock, Target, Network, Activity, Swords, GraduationCap, AlertTriangle, Moon } from "lucide-react";
import { motion } from "motion/react";

const data = [
  { subject: 'OS', score: 65, fullMark: 100 },
  { subject: 'DBMS', score: 85, fullMark: 100 },
  { subject: 'DSA', score: 90, fullMark: 100 },
  { subject: 'CN', score: 55, fullMark: 100 },
  { subject: 'Math', score: 75, fullMark: 100 },
  { subject: 'OOPS', score: 80, fullMark: 100 },
];

export default function StudyDashboard() {
  return (
    <div className="space-y-8 pb-10">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Topics Studied", value: "14", icon: BookOpen },
          { label: "Hours Logged", value: "38h", icon: Clock },
          { label: "Current Streak", value: "12d", icon: Brain },
          { label: "Avg Quiz Score", value: "74%", icon: Target },
        ].map((stat, i) => (
          <Card key={i} className="p-5 flex flex-col justify-center bg-surface border-t-[3px] border-t-emerald border-l-border-default border-r-border-default border-b-border-default hover:bg-elevated transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className="w-5 h-5 text-emerald" />
              <span className="text-[32px] font-display text-text-primary leading-none">{stat.value}</span>
            </div>
            <div className="text-[12px] text-text-secondary font-medium uppercase tracking-wider">{stat.label}</div>
          </Card>
        ))}
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <Card className="p-6 md:p-8 bg-surface border border-border-default h-full flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h2 className="font-heading font-bold text-xl text-text-primary">Skills Radar</h2>
              <button className="text-sm font-semibold text-emerald hover:text-emerald/80 transition-colors">View Details →</button>
            </div>
            
            <div className="flex-1 min-h-[350px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                  <PolarGrid stroke="#E8E6DF" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#6B6B78', fontSize: 13, fontFamily: 'DM Sans', fontWeight: 600 }} 
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#0EA882"
                    strokeWidth={2}
                    fill="#0EA882"
                    fillOpacity={0.15}
                    isAnimationActive={true}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 relative z-10">
              <h3 className="text-sm font-medium text-text-secondary mb-3">Weak topics to focus on:</h3>
              <div className="flex gap-3 flex-wrap">
                <span className="px-4 py-1.5 rounded-full bg-rose/10 text-rose font-bold text-sm font-mono border border-rose/20">CN — 55%</span>
                <span className="px-4 py-1.5 rounded-full bg-saffron/10 text-saffron font-bold text-sm font-mono border border-saffron/20">OS — 65%</span>
                <span className="px-4 py-1.5 rounded-full bg-emerald/10 text-emerald font-bold text-sm font-mono border border-emerald/20">Math — 75%</span>
              </div>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-6 bg-surface border border-border-default hover:border-emerald/50 transition-colors flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-text-secondary mb-1">GATE 2026</div>
              <div className="font-display text-4xl text-text-primary">21 <span className="text-lg text-text-tertiary">days</span></div>
            </div>
            <div className="w-16 h-16 rounded-full bg-emerald/10 flex items-center justify-center">
              <Target className="w-8 h-8 text-emerald" />
            </div>
          </Card>
          <Card className="p-6 bg-surface border border-border-default flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading font-bold text-lg text-text-primary">Today's Plan</h3>
              <span className="text-xs font-bold text-emerald bg-emerald/10 px-2 py-1 rounded-md">2/4 Done</span>
            </div>
            
            <div className="space-y-4 flex-1 relative before:absolute before:inset-0 before:ml-[11px] before:w-[2px] before:bg-border-default before:z-0">
              <div className="relative z-10 flex gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald text-surface flex items-center justify-center shrink-0 mt-1 shadow-sm">✓</div>
                <div className="bg-elevated p-3 rounded-lg flex-1 border border-border-default opacity-60">
                  <div className="font-bold text-sm text-text-primary mb-1">DBMS Normalization</div>
                  <div className="text-xs text-text-secondary flex gap-1"><span className="w-2 h-2 rounded-full bg-emerald mt-0.5"></span> 45m</div>
                </div>
              </div>
              <div className="relative z-10 flex gap-4">
                <div className="w-6 h-6 rounded-full bg-surface border-2 border-emerald flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald animate-pulse"></div>
                </div>
                <div className="bg-emerald/5 border-l-[3px] border-l-emerald p-3 rounded-lg flex-1 border-t border-r border-b border-border-default shadow-sm">
                  <div className="font-bold text-sm text-text-primary mb-1">Operating Systems: Paging</div>
                  <div className="text-xs text-text-secondary flex gap-1"><span className="w-2 h-2 rounded-full bg-emerald mt-0.5"></span><span className="w-2 h-2 rounded-full bg-border-hover mt-0.5"></span> 90m</div>
                  <button className="mt-3 bg-emerald text-surface font-medium text-xs px-4 py-2 rounded-md w-full hover:bg-emerald/90 transition-colors shadow-sm">Start Session →</button>
                </div>
              </div>
              <div className="relative z-10 flex gap-4">
                <div className="w-6 h-6 rounded-full bg-surface border-2 border-border-default flex items-center justify-center shrink-0 mt-1"></div>
                <div className="bg-surface p-3 rounded-lg flex-1 border border-border-default">
                  <div className="font-bold text-sm text-text-primary mb-1">Computer Networks Mock</div>
                  <div className="text-xs text-text-secondary flex gap-1"><span className="w-2 h-2 rounded-full bg-border-hover mt-0.5"></span> 30m</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Concept Mind Map</h3>
          </div>
          <div className="flex gap-2 mt-auto">
            <input type="text" placeholder="Enter any topic..." className="flex-1 bg-primary-bg border border-border-default rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald" />
            <button className="bg-text-primary text-surface px-3 py-2 rounded-lg text-sm font-medium hover:bg-text-primary/90 transition-colors">→</button>
          </div>
        </Card>

        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Predict My Score</h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">Based on 14 days of data — you'll score <span className="font-bold text-emerald font-mono">68–74</span> in DBMS.</p>
          <div className="h-1.5 w-full bg-border-default rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald w-[70%] rounded-full"></div>
          </div>
        </Card>

        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald">
              <Swords className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Debate Mode</h3>
          </div>
          <p className="text-sm text-text-secondary">You won 2/3 debates this week.</p>
          <button className="mt-3 text-sm font-semibold text-emerald bg-emerald/10 py-2 rounded-lg hover:bg-emerald/20 transition-colors w-full">Start Debate →</button>
        </Card>

        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Teach It Back Mode</h3>
          </div>
          <p className="text-sm text-text-secondary mb-3"><span className="font-bold text-emerald">B+</span> — Good structure, missed base case on Recursion.</p>
          <button className="text-sm font-semibold text-text-primary bg-primary-bg border border-border-default py-2 rounded-lg hover:bg-border-default transition-colors w-full">Explain next concept →</button>
        </Card>

        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-violet/10 flex items-center justify-center text-violet">
              <Moon className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Night Owl Insight</h3>
          </div>
          <p className="text-sm text-text-secondary mb-3">You study best <span className="font-bold text-violet">9–11 PM</span>.</p>
          <div className="flex items-center gap-2 mt-auto">
            <div className="w-8 h-4 bg-violet rounded-full relative cursor-pointer"><div className="w-3 h-3 bg-surface rounded-full absolute right-0.5 top-0.5 shadow-sm"></div></div>
            <span className="text-xs font-medium text-text-secondary">Auto-schedule hard topics</span>
          </div>
        </Card>

        <Card className="p-5 bg-surface border-2 border-rose/30 hover:border-rose/60 transition-colors flex flex-col justify-between shadow-[0_0_15px_rgba(217,59,59,0.05)] cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-rose/10 flex items-center justify-center text-rose">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-rose">Panic Mode</h3>
          </div>
          <p className="text-sm text-text-secondary mb-3">Exam soon? Generate 10 rapid-fire questions now.</p>
          <button className="mt-auto text-sm font-bold text-surface bg-rose py-2.5 rounded-lg hover:bg-rose/90 transition-colors w-full shadow-[0_4px_10px_rgba(217,59,59,0.3)]">Activate Emergency Prep</button>
        </Card>
      </section>
    </div>
  );
}