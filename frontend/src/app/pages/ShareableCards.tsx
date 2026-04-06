import { Card } from "../components/ui/card";
import { Download, Share2, Flame, BookOpen, Crown, Calendar } from "lucide-react";

const shareables = [
  {
    id: "roast",
    title: "AI Budget Roast",
    type: "Finance",
    preview: (
      <div className="w-full aspect-[9/16] bg-[#1A1D2E] rounded-xl flex flex-col items-center justify-center p-6 relative overflow-hidden border border-[#2A2E45] shadow-lg">
        <Flame className="w-12 h-12 text-saffron mb-6 opacity-80" />
        <p className="text-white/90 font-serif italic text-center text-lg leading-relaxed mb-8">"Another Uber? Your legs work fine, Aditya. You're not the CEO of Reliance yet."</p>
        <div className="text-saffron font-bold font-mono tracking-widest uppercase text-xs">@TriMind_AI</div>
      </div>
    )
  },
  {
    id: "study",
    title: "Study Report Card",
    type: "Academic",
    preview: (
      <div className="w-full aspect-[9/16] bg-[#FDFBF7] rounded-xl flex flex-col items-center p-8 relative overflow-hidden border-2 border-[#E8E6DF] shadow-md">
        <div className="absolute top-0 left-0 w-full h-12 bg-[#0EA882]" />
        <h3 className="font-heading font-bold text-2xl text-[#141417] mt-8 mb-2">Term Report</h3>
        <p className="text-[#6B6B78] font-mono text-xs uppercase tracking-widest mb-10">Aditya Sharma</p>
        <div className="w-32 h-32 rounded-full border-4 border-[#0EA882] flex items-center justify-center text-4xl font-display font-bold text-[#0EA882] mb-8">
          A-
        </div>
        <div className="w-full space-y-4">
          <div className="flex justify-between text-sm font-bold border-b border-[#E8E6DF] pb-2"><span className="text-[#141417]">Data Structures</span><span className="text-[#0EA882]">92%</span></div>
          <div className="flex justify-between text-sm font-bold border-b border-[#E8E6DF] pb-2"><span className="text-[#141417]">Operating Sys</span><span className="text-[#141417]/60">65%</span></div>
          <div className="flex justify-between text-sm font-bold border-b border-[#E8E6DF] pb-2"><span className="text-[#141417]">Algorithms</span><span className="text-[#0EA882]">88%</span></div>
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
      <div className="w-full aspect-[9/16] bg-surface rounded-xl flex flex-col items-center justify-center p-6 relative overflow-hidden border border-border-default shadow-md">
        <Crown className="w-8 h-8 text-violet mb-6 opacity-20 absolute top-8 left-8" />
        <div className="w-48 h-48 rounded-full border-[8px] border-primary-bg flex items-center justify-center relative shadow-sm mb-8">
          <svg className="absolute inset-[-8px] w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#E8E6DF" strokeWidth="8" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="url(#score-grad-share)" strokeWidth="8" strokeDasharray="289" strokeDashoffset="83" strokeLinecap="round" />
            <defs>
              <linearGradient id="score-grad-share" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0EA882" />
                <stop offset="50%" stopColor="#5B47E0" />
                <stop offset="100%" stopColor="#E8620A" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex flex-col items-center">
            <span className="font-display text-[56px] text-text-primary leading-none">712</span>
          </div>
        </div>
        <h3 className="font-heading font-bold text-2xl text-text-primary mb-2">Top 18%</h3>
        <p className="text-text-secondary font-medium text-sm text-center px-4">Aditya is crushing it across Academic, Finance, and Interviews.</p>
        <div className="mt-auto text-text-secondary font-bold font-mono tracking-widest uppercase text-[10px]">@TriMind_AI</div>
      </div>
    )
  },
  {
    id: "wrap",
    title: "Monthly Wrap",
    type: "Summary",
    preview: (
      <div className="w-full aspect-[9/16] bg-gradient-to-br from-violet to-saffron rounded-xl flex flex-col items-start justify-between p-8 relative overflow-hidden shadow-lg">
        <div className="w-full flex justify-between items-start">
          <h3 className="font-display font-bold text-4xl text-white leading-tight">May<br/>Wrap</h3>
          <Calendar className="w-8 h-8 text-white/50" />
        </div>
        
        <div className="space-y-6 w-full">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30 text-white">
            <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">Hours Studied</div>
            <div className="font-display text-3xl">42h</div>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30 text-white">
            <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">Money Saved</div>
            <div className="font-display text-3xl">₹3.4k</div>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30 text-white">
            <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">Interviews</div>
            <div className="font-display text-3xl">12 Mocked</div>
          </div>
        </div>

        <div className="w-full flex justify-between items-center text-white/80">
          <span className="font-bold text-sm">#TriMindWrap</span>
          <span className="font-mono tracking-widest text-[10px] uppercase">@TriMind_AI</span>
        </div>
      </div>
    )
  }
];

export default function ShareableCards() {
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
                <button className="flex-1 flex items-center justify-center gap-2 bg-surface border border-border-default text-text-primary font-semibold py-2.5 rounded-lg text-xs hover:bg-elevated transition-colors shadow-sm">
                  <Download className="w-4 h-4" /> PNG
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-2.5 rounded-lg text-xs hover:bg-[#1DA851] transition-colors shadow-sm">
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