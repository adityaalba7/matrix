import { Card } from "../components/ui/card";
import { Trophy, Calendar, BookOpen, IndianRupee, Video, CheckCircle2, Lock, Download, Upload, Share2, Star } from "lucide-react";
import { motion } from "motion/react";

export default function ProfileDashboard() {
  const level = 12;
  const xp = 3450;
  const nextXp = 5000;
  const title = "Focused Scholar";
  const progress = (xp / nextXp) * 100;

  const heatmap = Array.from({ length: 364 }, () => Math.random() > 0.4 ? Math.floor(Math.random() * 4) + 1 : 0);

  return (
    <div className="space-y-8 pb-10">
      <Card className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-surface p-8 relative overflow-hidden border-border-default border-t-[3px] border-t-violet">
        
        <div className="relative shrink-0 z-10">
          <div className="w-24 h-24 rounded-full bg-surface border border-border-default overflow-hidden shadow-sm">
            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-saffron text-surface font-mono text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center border-[3px] border-surface shadow-sm z-20">
            {level}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center md:items-start z-10 w-full pt-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-[28px] text-text-primary leading-none">Aditya Sharma</h1>
            <span className="bg-violet/10 text-violet px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border border-violet/20">Pro Plan</span>
          </div>
          <p className="text-text-secondary font-sans text-sm font-medium mb-6">B.Tech CSE · GLA University</p>

          <div className="w-full max-w-md bg-primary-bg p-4 rounded-xl border border-border-default shadow-sm group">
            <div className="flex justify-between font-mono text-xs mb-3 font-medium">
              <span className="text-text-primary">{xp.toLocaleString()} <span className="text-text-secondary">/ {nextXp.toLocaleString()} XP to Level 13</span></span>
              <span className="text-saffron font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full bg-border-default rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-saffron"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </Card>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5 flex items-center gap-4 group bg-surface border-t-[3px] border-t-emerald hover:bg-elevated transition-colors border-l-border-default border-r-border-default border-b-border-default">
          <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="font-display text-2xl text-text-primary">38h</div>
            <div className="text-[11px] uppercase tracking-wider text-text-secondary font-bold">Study (This Month)</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 group bg-surface border-t-[3px] border-t-violet hover:bg-elevated transition-colors border-l-border-default border-r-border-default border-b-border-default">
          <div className="w-12 h-12 rounded-xl bg-violet/10 flex items-center justify-center text-violet">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="font-display text-2xl text-text-primary">7</div>
            <div className="text-[11px] uppercase tracking-wider text-text-secondary font-bold">Interviews</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 group bg-surface border-t-[3px] border-t-saffron hover:bg-elevated transition-colors border-l-border-default border-r-border-default border-b-border-default">
          <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <div className="font-display text-2xl text-text-primary">₹1.2k</div>
            <div className="text-[11px] uppercase tracking-wider text-text-secondary font-bold">Saved (This Month)</div>
          </div>
        </Card>
      </section>
      <Card className="p-6 bg-surface border border-border-default flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="flex-1 w-full space-y-5">
          <h3 className="font-heading font-bold text-lg text-text-primary mb-2">Life Score Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-emerald">Academic</span>
                <span className="font-mono text-text-primary">74</span>
              </div>
              <div className="h-2 bg-primary-bg rounded-full border border-border-default overflow-hidden"><div className="h-full bg-emerald w-[74%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-saffron">Financial</span>
                <span className="font-mono text-text-primary">61</span>
              </div>
              <div className="h-2 bg-primary-bg rounded-full border border-border-default overflow-hidden"><div className="h-full bg-saffron w-[61%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-violet">Interview</span>
                <span className="font-mono text-text-primary">81</span>
              </div>
              <div className="h-2 bg-primary-bg rounded-full border border-border-default overflow-hidden"><div className="h-full bg-violet w-[81%]"></div></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0 w-48 relative">
          <div className="w-32 h-32 rounded-full border-[8px] border-primary-bg flex items-center justify-center relative shadow-sm">
            <svg className="absolute inset-[-8px] w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#E8E6DF" strokeWidth="8" />
              <circle cx="50" cy="50" r="46" fill="none" stroke="#5B47E0" strokeWidth="8" strokeDasharray="289" strokeDashoffset="83" strokeLinecap="round" />
            </svg>
            <div className="font-display text-4xl text-text-primary">712</div>
          </div>
          <span className="text-xs font-mono font-bold text-text-secondary mt-3">/ 1000</span>
          <span className="mt-2 bg-emerald/10 text-emerald text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">Top 18%</span>
        </div>
      </Card>
      <section>
        <Card className="p-6 border-border-default bg-surface">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-text-primary text-lg">Activity Log</h3>
            <div className="flex gap-2 items-center text-text-secondary text-sm font-medium">
              <Calendar className="w-4 h-4" />
              <span>364 days of activity</span>
            </div>
          </div>
          <div className="text-xs font-medium text-text-tertiary mb-2 flex justify-between px-2">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
          <div className="grid grid-rows-7 grid-flow-col gap-1.5 overflow-x-auto pb-2 hide-scrollbar">
            {heatmap.map((val, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-sm transition-colors cursor-pointer ${
                  val === 0 ? 'bg-primary-bg border border-border-default' :
                  val === 1 ? 'bg-[#D1FAE5] border border-[#A7F3D0]' :
                  val === 2 ? 'bg-[#34D399] border border-[#10B981]' :
                  val === 3 ? 'bg-[#059669] border border-[#047857]' :
                  'bg-[#0EA882] shadow-sm'
                }`}
                title={`${val} activities on this day`}
              />
            ))}
          </div>
          <div className="flex items-center justify-end mt-4 gap-2 text-xs text-text-tertiary uppercase tracking-wider font-semibold">
            <span>Less</span>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-[2px] bg-primary-bg border border-border-default" />
              <div className="w-3 h-3 rounded-[2px] bg-[#D1FAE5]" />
              <div className="w-3 h-3 rounded-[2px] bg-[#34D399]" />
              <div className="w-3 h-3 rounded-[2px] bg-[#0EA882]" />
            </div>
            <span>More</span>
          </div>
        </Card>
      </section>
      <section>
        <Card className="p-6 bg-surface border border-border-default">
          <h3 className="font-heading font-bold text-text-primary text-lg mb-6">Achievement Shelf</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "7-Day Streak", icon: Trophy, earned: true, color: "text-saffron", bg: "bg-saffron/10", border: "border-saffron/20" },
              { name: "Budget Master", icon: IndianRupee, earned: true, color: "text-emerald", bg: "bg-emerald/10", border: "border-emerald/20" },
              { name: "Interview Ace", icon: Video, earned: true, color: "text-violet", bg: "bg-violet/10", border: "border-violet/20" },
              { name: "Quiz Champion", icon: Star, earned: true, color: "text-saffron", bg: "bg-saffron/10", border: "border-saffron/20" },
              { name: "Night Owl", icon: BookOpen, earned: false },
              { name: "Iron Stomach", icon: BookOpen, earned: false },
              { name: "Debate King", icon: BookOpen, earned: false },
              { name: "Savings Hero", icon: BookOpen, earned: false },
            ].map((badge, i) => (
              <div key={i} className={`p-4 rounded-xl flex flex-col items-center justify-center gap-3 text-center transition-colors border ${badge.earned ? `${badge.bg} ${badge.border} hover:bg-elevated shadow-sm` : 'bg-primary-bg border-border-default grayscale opacity-60'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${badge.earned ? 'bg-surface shadow-sm' : 'bg-border-default'} ${badge.color || 'text-text-tertiary'}`}>
                  {badge.earned ? <badge.icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>
                <div className={`font-semibold text-sm ${badge.earned ? 'text-text-primary' : 'text-text-tertiary'}`}>{badge.earned ? badge.name : 'Locked'}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <Card className="p-6 bg-surface border border-border-default flex flex-col hover:bg-elevated transition-colors">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[16px] text-text-primary">My Goals</h3>
          </div>
          <div className="space-y-4 mb-6 flex-1">
            <div className="flex justify-between items-center text-sm border-b border-border-default pb-3">
              <span className="font-medium text-text-primary">GATE 2026 Countdown</span>
              <span className="font-mono font-bold text-text-secondary bg-primary-bg px-2 py-1 rounded">21 Days</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-border-default pb-3">
              <span className="font-medium text-text-primary">Savings Goal</span>
              <span className="font-mono font-bold text-text-secondary bg-primary-bg px-2 py-1 rounded">₹4.2k/10k</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-text-primary">Mock Interview Target</span>
              <span className="font-mono font-bold text-text-secondary bg-primary-bg px-2 py-1 rounded">7/10</span>
            </div>
          </div>
          <button className="w-full py-2.5 rounded-lg border border-border-default text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-primary-bg transition-colors mt-auto">
            + Add New Goal
          </button>
        </Card>

        <Card className="p-6 bg-surface border border-border-default flex flex-col hover:bg-elevated transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-violet/10 flex items-center justify-center text-violet">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[16px] text-text-primary">Internship Readiness</h3>
          </div>
          <div className="bg-primary-bg border border-border-default p-4 rounded-xl flex items-center justify-center mb-4 min-h-[120px] relative overflow-hidden">
            <div className="absolute inset-0 border-2 border-violet/20 m-2 rounded border-dashed opacity-50"></div>
            <div className="text-center z-10">
              <div className="font-display text-xl text-text-primary mb-1">30-Day Program Complete</div>
              <div className="text-xs font-mono font-bold text-violet uppercase tracking-widest">Certificate of Excellence</div>
            </div>
          </div>
          <button className="w-full py-2.5 bg-violet text-surface rounded-lg text-sm font-bold shadow-sm hover:bg-violet/90 transition-colors flex items-center justify-center gap-2 mt-auto">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </Card>

        <Card className="p-6 bg-surface border border-border-default flex flex-col hover:bg-elevated transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center text-saffron">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[16px] text-text-primary">Resume Gap Detector</h3>
          </div>
          <div className="mb-4">
            <input type="text" value="Target: Google SWE" readOnly className="w-full bg-primary-bg border border-border-default rounded-lg px-3 py-2 text-sm font-bold text-text-primary outline-none" />
          </div>
          <div className="bg-saffron/5 border border-saffron/20 p-4 rounded-xl mb-4">
            <p className="text-sm font-bold text-saffron mb-1">62% Ready</p>
            <p className="text-xs font-medium text-text-secondary">3 skill gaps identified (System Design, Graph algos, Go).</p>
          </div>
          <div className="flex gap-2 mt-auto">
            <button className="flex-1 py-2.5 bg-primary-bg border border-border-default text-text-primary rounded-lg text-sm font-bold hover:bg-border-default transition-colors flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" /> Upload 
            </button>
            <button className="flex-1 py-2.5 bg-primary-bg border border-border-default text-text-primary rounded-lg text-sm font-bold hover:bg-border-default transition-colors">
              Full Report →
            </button>
          </div>
        </Card>

        <Card className="p-6 bg-emerald/10 border border-emerald/20 flex flex-col hover:bg-emerald/20 transition-colors cursor-pointer shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-emerald shadow-sm">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-[16px] text-emerald">Parent Dashboard Share</h3>
          </div>
          <p className="text-sm font-medium text-text-primary mb-4 leading-relaxed">"Aditya studied 18 hrs, spent ₹3,200, and ranked #12 on the DSA leaderboard this week."</p>
          <button className="w-full py-3 bg-[#25D366] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#1DA851] transition-colors flex items-center justify-center gap-2 mt-auto">
            Share to WhatsApp →
          </button>
        </Card>
      </div>

    </div>
  );
}