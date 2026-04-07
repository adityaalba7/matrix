import { Card } from "../components/ui/card";
import { Download, Share2, Flame, BookOpen, Crown, Calendar, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import { useUser } from "../../lib/userContext";

export default function ShareableCards() {
  const { user } = useUser();
  const [dashData, setDashData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard');
        setDashData(res.data.data);
      } catch (err) {
        console.error("Failed to load dashboard data for shareables", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownload = async (id: string, fileName: string) => {
    const el = document.getElementById(`${id}-card`);
    if (!el) return;
    try {
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: null });
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Download failed.");
    }
  };

  const handleShare = async (id: string) => {
    const el = document.getElementById(`${id}-card`);
    if (!el) return;
    try {
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: null });
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (blob && navigator.share) {
        await navigator.share({
          files: [new File([blob], `${id}.png`, { type: 'image/png' })]
        });
      } else if (blob && navigator.clipboard) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        alert("Image copied to clipboard!");
      } else {
        alert("Sharing not fully supported on this OS.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20 text-text-secondary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Fallbacks if data is missing
  const topics = dashData?.study?.weak_topics || [];
  const topExpense = dashData?.finance?.top_category?.category || "Food & Dining";
  const name = user?.name || "Student";
  const score = dashData?.trimind_score || user?.trimind_score || 0;

  const shareables = [
    {
      id: "roast",
      title: "AI Budget Roast",
      type: "Finance",
      preview: (
        <div id="roast-card" className="w-full aspect-[9/16] bg-[#1A1D2E] rounded-xl flex flex-col items-center justify-center p-6 relative overflow-hidden shadow-lg border-2 border-[#2A2E45]">
          <Flame className="w-12 h-12 text-[#E8620A] mb-6 opacity-80" />
          <p className="text-white font-serif italic text-center text-lg leading-relaxed mb-8">
            "You keep spending all your money on {topExpense}. Do you run a charity for them or something? Get a grip, {name}."
          </p>
          <div className="text-[#E8620A] font-bold font-mono tracking-widest uppercase text-xs">@TriMind_AI</div>
        </div>
      )
    },
    {
      id: "study",
      title: "Study Report Card",
      type: "Academic",
      preview: (
        <div id="study-card" className="w-full aspect-[9/16] bg-[#FDFBF7] rounded-xl flex flex-col items-center p-8 relative overflow-hidden border-2 border-[#E8E6DF] shadow-md">
          <div className="absolute top-0 left-0 w-full h-12 bg-[#0EA882]" />
          <h3 className="font-heading font-bold text-2xl text-[#141417] mt-8 mb-2">Term Report</h3>
          <p className="text-[#6B6B78] font-mono text-xs uppercase tracking-widest mb-6">{name}</p>
          <div className="w-24 h-24 rounded-full border-4 border-[#0EA882] flex items-center justify-center text-3xl font-display font-bold text-[#0EA882] mb-6">
            {score > 800 ? "A+" : score > 600 ? "A" : score > 400 ? "B" : "C"}
          </div>
          <div className="w-full flex-1 space-y-4">
            {topics.length > 0 ? topics.slice(0,3).map((t: any, i: number) => (
              <div key={i} className="flex justify-between text-sm font-bold border-b border-[#E8E6DF] pb-2">
                <span className="text-[#141417] max-w-[120px] truncate" title={t.topic}>{t.topic}</span>
                <span className={t.accuracy > 70 ? "text-[#0EA882]" : "text-[#E8620A]"}>{t.accuracy}%</span>
              </div>
            )) : (
              <div className="text-sm text-center text-[#6B6B78] mt-10">Start taking quizzes to see your topics here!</div>
            )}
          </div>
          <div className="mt-auto text-[#6B6B78] font-bold font-mono tracking-widest uppercase text-[10px]">@TriMind_AI</div>
        </div>
      )
    },
    {
      id: "score",
      title: "Life Score",
      type: "Overall",
      preview: (
        <div id="score-card" className="w-full aspect-[9/16] rounded-xl flex flex-col items-center justify-center p-6 relative overflow-hidden border-2 border-[#E8E6DF] shadow-md" style={{ backgroundColor: '#ffffff' }}>
          <Crown className="w-8 h-8 text-[#5B47E0] mb-6 opacity-20 absolute top-8 left-8" />
          <div className="w-48 h-48 rounded-full border-[8px] border-[#FDFBF7] flex items-center justify-center relative shadow-sm mb-8">
            <svg className="absolute inset-[-8px] w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#E8E6DF" strokeWidth="8" />
              <circle cx="50" cy="50" r="46" fill="none" stroke="url(#score-grad-share)" strokeWidth="8" strokeDasharray="289" strokeDashoffset={289 * (1 - score / 1000)} strokeLinecap="round" />
              <defs>
                <linearGradient id="score-grad-share" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0EA882" />
                  <stop offset="50%" stopColor="#5B47E0" />
                  <stop offset="100%" stopColor="#E8620A" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex flex-col items-center">
              <span className="font-display text-[56px] text-black leading-none">{score}</span>
            </div>
          </div>
          <h3 className="font-heading font-bold text-2xl text-black mb-2">My Score</h3>
          <p className="text-[#6B6B78] font-medium text-sm text-center px-4">See how you match up across Academics, Finance, and Interviews.</p>
          <div className="mt-auto text-[#6B6B78] font-bold font-mono tracking-widest uppercase text-[10px]">@TriMind_AI</div>
        </div>
      )
    },
    {
      id: "wrap",
      title: "Monthly Wrap Status",
      type: "Summary",
      preview: (
        <div id="wrap-card" className="w-full aspect-[9/16] rounded-xl flex flex-col items-start justify-between p-8 relative overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #1A1D2E 0%, #1A0B2E 100%)' }}>
          <div className="w-full flex justify-between items-start">
            <h3 className="font-display font-bold text-3xl text-white leading-tight">Current<br/>Wrap</h3>
            <Calendar className="w-8 h-8 opacity-50" style={{ color: '#ffffff' }} />
          </div>
          
          <div className="space-y-6 w-full">
            <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-white">
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-1">Current Streak</div>
              <div className="font-display text-3xl">{dashData?.study?.streak_days || 0} <span className="text-lg">days</span></div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-white">
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-1">Budget Used</div>
              <div className="font-display text-3xl">{dashData?.finance?.budget_used_percent || 0}%</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-white">
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-1">Interviews</div>
              <div className="font-display text-3xl">{dashData?.interview?.sessions_this_week || 0} <span className="text-lg">mocked</span></div>
            </div>
          </div>

          <div className="w-full flex justify-between items-center text-white/80 mt-auto pt-4">
            <span className="font-bold text-xs uppercase tracking-wider">#TriMindWrap</span>
            <span className="font-mono tracking-widest text-[9px] uppercase">@TriMind_AI</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {shareables.map((item) => (
          <div key={item.id} className="flex flex-col">
            <div className="mb-4 shadow-xl rounded-xl bg-surface p-2 border border-border-default hover:-translate-y-1 transition-transform duration-300">
              {item.preview}
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="font-heading font-bold text-[15px] text-text-primary">{item.title}</h3>
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider bg-primary-bg px-2 py-1 rounded border border-border-default">{item.type}</span>
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => handleDownload(item.id, item.title)} className="flex-1 flex items-center justify-center gap-2 bg-surface border border-border-default text-text-primary font-semibold py-2.5 rounded-lg text-xs hover:bg-elevated transition-colors shadow-sm">
                  <Download className="w-4 h-4" /> PNG
                </button>
                <button onClick={() => handleShare(item.id)} className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-2.5 rounded-lg text-xs hover:bg-[#1DA851] transition-colors shadow-sm">
                  <Share2 className="w-4 h-4" /> WhatsApp
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}