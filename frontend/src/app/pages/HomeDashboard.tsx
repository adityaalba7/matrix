import { Card } from "../components/ui/card";
import { BookOpen, IndianRupee, Video, Flame, BrainCircuit, ArrowRight, Zap, Target } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useUser } from "../../lib/userContext";
import api from "../../lib/api";

function ArcGauge({ value, max, label }: { value: number, max: number, label: string }) {
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const sweepAngle = 270;
  const startAngle = 135;
  const cx = 140;
  const cy = 140;

  const getCoordinatesForAngle = (angle: number) => {
    const radians = (angle * Math.PI) / 180;
    return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
  };

  const start = getCoordinatesForAngle(startAngle);
  const end = getCoordinatesForAngle(startAngle + sweepAngle);
  const largeArcFlag = sweepAngle > 180 ? 1 : 0;
  const pathData = [`M ${start.x} ${start.y}`, `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`].join(" ");

  const progress = value / max;
  const length = circumference * 0.75;
  const strokeDashoffset = length * (1 - progress);

  return (
    <Card className="p-8 w-full flex flex-col items-center justify-center bg-surface relative overflow-hidden shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border-none">
      <h2 className="text-center font-heading text-text-primary text-lg font-bold tracking-wide mb-6">TriMind Life Score</h2>
      <div className="relative flex flex-col items-center justify-center w-[280px] h-[280px] mx-auto mb-2">
        <svg className="w-full h-full absolute top-0 left-0 overflow-visible" viewBox="0 0 280 280">
          <defs>
            <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0EA882" />
              <stop offset="50%" stopColor="#5B47E0" />
              <stop offset="100%" stopColor="#E8620A" />
            </linearGradient>
          </defs>
          <path d={pathData} fill="none" stroke="#E8E6DF" strokeWidth="18" strokeLinecap="round" />
          <motion.path
            d={pathData} fill="none" stroke="url(#score-gradient)" strokeWidth="18" strokeLinecap="round"
            strokeDasharray={length}
            initial={{ strokeDashoffset: length }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="flex flex-col items-center justify-center z-10 pt-4">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-[72px] leading-none text-text-primary">{value}</span>
          </div>
          <span className="text-text-secondary text-[15px] font-medium tracking-wide mt-2 mb-3 font-mono">/ {max}</span>
          <span className="px-3.5 py-1.5 rounded-full bg-emerald/10 text-emerald text-[13px] font-bold tracking-wide uppercase border border-emerald/20">{label}</span>
        </div>
      </div>
    </Card>
  );
}

export default function HomeDashboard() {
  const { user } = useUser();
  const [dashData, setDashData] = useState<any>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, streakRes] = await Promise.all([
          api.get('/dashboard').then(r => r.data.data).catch(() => null),
          api.get('/study/streak').then(r => r.data.data).catch(() => ({ current_streak: 0 })),
        ]);
        if (dashRes) setDashData(dashRes);
        setStreak(streakRes?.current_streak || 0);
      } catch { /* silent */ }
    };
    fetchData();
  }, []);

  const score = user?.trimind_score || dashData?.trimind_score || 0;

  return (
    <div className="space-y-8 pb-10">
      <section>
        <ArcGauge value={score} max={1000} label={score > 500 ? "Great Progress" : "Getting Started"} />
      </section>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link to="/study" className="block">
            <Card className="h-full p-6 flex flex-col justify-between border-t-[3px] border-t-emerald bg-surface hover:bg-elevated transition-colors border-l-border-default border-r-border-default border-b-border-default">
              <div className="flex justify-between items-start mb-6">
                <BookOpen className="w-7 h-7 text-emerald" />
                <svg width="60" height="24" viewBox="0 0 60 24" className="opacity-80">
                  <path d="M0,20 L15,10 L30,15 L45,5 L60,8" fill="none" stroke="#0EA882" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="text-[32px] font-display text-text-primary mb-1">{dashData?.study?.topics_studied || 0}</div>
                <div className="text-xs text-text-secondary font-medium tracking-wide">Topics Strong</div>
              </div>
            </Card>
          </Link>
          <Link to="/finance" className="block">
            <Card className="h-full p-6 flex flex-col justify-between border-t-[3px] border-t-saffron bg-surface hover:bg-elevated transition-colors border-l-border-default border-r-border-default border-b-border-default">
              <div className="flex justify-between items-start mb-6">
                <IndianRupee className="w-7 h-7 text-saffron" />
                <svg width="60" height="24" viewBox="0 0 60 24" className="opacity-80">
                  <path d="M0,18 L15,15 L30,20 L45,8 L60,12" fill="none" stroke="#E8620A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="text-[32px] font-display text-text-primary mb-1">₹{Math.round((dashData?.finance?.remaining_paise || 0) / 100)}</div>
                <div className="text-xs text-text-secondary font-medium tracking-wide">Remaining this month</div>
              </div>
            </Card>
          </Link>
          <Link to="/interview" className="block">
            <Card className="h-full p-6 flex flex-col justify-between border-t-[3px] border-t-violet bg-surface hover:bg-elevated transition-colors border-l-border-default border-r-border-default border-b-border-default">
              <div className="flex justify-between items-start mb-6">
                <Video className="w-7 h-7 text-violet" />
                <svg width="60" height="24" viewBox="0 0 60 24" className="opacity-80">
                  <path d="M0,22 L15,14 L30,18 L45,6 L60,4" fill="none" stroke="#5B47E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="text-[32px] font-display text-text-primary mb-1">{dashData?.interview?.avg_score || 0}</div>
                <div className="text-xs text-text-secondary font-medium tracking-wide">Avg Session Score</div>
              </div>
            </Card>
          </Link>
        </div>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="h-full">
          <Card className="h-full border-l-[3px] border-l-saffron bg-surface p-6 flex flex-col justify-center border-t-border-default border-r-border-default border-b-border-default">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-5 h-5 text-saffron" />
              </div>
              <p className="text-[15px] font-medium leading-relaxed font-sans text-text-primary pt-1">
                {dashData?.nudge || "Complete a quiz to get personalized AI nudges!"}
              </p>
            </div>
            <div className="flex gap-3 pl-14">
              <Link to="/study" className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg bg-emerald text-surface hover:bg-emerald/90 transition-colors shadow-sm">
                <Zap className="w-4 h-4" /> Start revision
              </Link>
              <Link to="/finance" className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg bg-transparent border border-border-default text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors">
                See budget
              </Link>
            </div>
          </Card>
        </section>
        <section className="h-full">
          <Card className="h-full p-6 flex items-center gap-5 bg-surface border-border-default">
            <div className="w-14 h-14 rounded-2xl bg-saffron/10 flex items-center justify-center shrink-0">
              <Flame className="w-7 h-7 text-saffron" />
            </div>
            <div className="flex-1 pr-2">
              <div className="flex justify-between items-end mb-3">
                <span className="font-heading font-bold text-lg text-text-primary">{streak}-Day Streak</span>
              </div>
              <div className="h-2 w-full bg-elevated rounded-full overflow-hidden">
                <motion.div className="h-full bg-saffron rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min(streak * 7, 100)}%` }} transition={{ duration: 1, delay: 0.5 }} />
              </div>
            </div>
          </Card>
        </section>
      </div>
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Start Quiz", icon: Zap, to: "/study" },
            { label: "Log Expense", icon: IndianRupee, to: "/finance" },
            { label: "Mock Interview", icon: Video, to: "/interview" },
            { label: "View Goals", icon: Target, to: "/profile" }
          ].map((action, i) => (
            <Link key={i} to={action.to} className="block">
              <Card className="p-4 flex items-center justify-between group bg-surface border-border-default hover:bg-elevated cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-elevated group-hover:bg-surface flex items-center justify-center transition-colors">
                    <action.icon className="w-4 h-4 text-text-secondary group-hover:text-violet transition-colors" />
                  </div>
                  <span className="font-medium text-sm text-text-primary">{action.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-text-primary group-hover:translate-x-1 transition-all" />
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}