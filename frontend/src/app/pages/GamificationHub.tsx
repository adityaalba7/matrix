import { Card } from "../components/ui/card";
import { Trophy, Flame, Target, Lock, Crown, Swords, Share2, Hexagon } from "lucide-react";
import { motion } from "motion/react";

export default function GamificationHub() {
  return (
    <div className="space-y-8 pb-10">
      <Card className="p-8 bg-surface border-border-default border-t-[3px] border-t-emerald flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col items-center shrink-0 relative z-10 w-full md:w-auto">
          <div className="w-48 h-48 rounded-full border-[10px] border-primary-bg flex items-center justify-center relative shadow-sm">
            <svg className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#E8E6DF" strokeWidth="10" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="url(#score-grad-rewards)" strokeWidth="10" strokeDasharray="283" strokeDashoffset="80" strokeLinecap="round" />
              <defs>
                <linearGradient id="score-grad-rewards" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0EA882" />
                  <stop offset="50%" stopColor="#5B47E0" />
                  <stop offset="100%" stopColor="#E8620A" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex flex-col items-center">
              <span className="font-display text-[56px] text-text-primary leading-none">712</span>
              <span className="text-xs font-mono font-bold text-text-secondary mt-1">/ 1000</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full z-10 space-y-5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-heading font-bold text-2xl text-text-primary">Life Score</h2>
            <button className="flex items-center gap-2 bg-text-primary text-surface px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-text-primary/90 transition-colors">
              <Share2 className="w-4 h-4" /> Share Score
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-emerald">Academic</span>
                <span className="font-mono text-text-primary">74</span>
              </div>
              <div className="h-2.5 bg-primary-bg rounded-full border border-border-default overflow-hidden"><div className="h-full bg-emerald w-[74%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-saffron">Financial</span>
                <span className="font-mono text-text-primary">61</span>
              </div>
              <div className="h-2.5 bg-primary-bg rounded-full border border-border-default overflow-hidden"><div className="h-full bg-saffron w-[61%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-violet">Interview</span>
                <span className="font-mono text-text-primary">81</span>
              </div>
              <div className="h-2.5 bg-primary-bg rounded-full border border-border-default overflow-hidden"><div className="h-full bg-violet w-[81%]"></div></div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-surface border-border-default border-t-[3px] border-t-saffron flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-heading font-bold text-xl text-text-primary mb-2 flex items-center gap-2">
                <Flame className="w-5 h-5 text-saffron" /> Daily 60-second Blitz
              </h3>
              <p className="text-sm font-medium text-text-secondary">10 questions · 60 seconds · Streak: <span className="font-bold text-saffron">14</span></p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-saffron flex items-center justify-center shadow-sm relative">
              <span className="font-display text-xl text-saffron font-bold">60</span>
            </div>
          </div>
          
          <div className="bg-primary-bg p-4 rounded-xl border border-border-default mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">Friends Leaderboard</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm"><span className="flex items-center gap-2 font-medium"><span className="text-saffron">1.</span> Rohan</span><span className="font-mono font-bold">980</span></div>
              <div className="flex justify-between items-center text-sm"><span className="flex items-center gap-2 font-medium"><span className="text-border-hover">2.</span> Sneha</span><span className="font-mono font-bold">945</span></div>
              <div className="flex justify-between items-center text-sm font-bold text-saffron"><span className="flex items-center gap-2"><span className="text-saffron">3.</span> You</span><span className="font-mono font-bold">920</span></div>
            </div>
          </div>
          
          <button className="w-full bg-saffron text-surface py-3 rounded-xl font-bold shadow-md hover:bg-saffron/90 transition-colors">Start Blitz →</button>
        </Card>
        <Card className="p-6 bg-surface border border-border-default flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-xl text-text-primary flex items-center gap-2">
              <Crown className="w-5 h-5 text-violet" /> College Rank
            </h3>
            <select className="bg-primary-bg border border-border-default text-xs font-semibold px-3 py-1.5 rounded-lg text-text-secondary outline-none cursor-pointer">
              <option>This week</option>
              <option>This month</option>
              <option>Overall</option>
            </select>
          </div>
          
          <div className="flex items-end justify-center gap-4 mb-8 pt-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-border-default mb-2 border-2 border-surface shadow-sm relative"><span className="absolute -top-3 -right-2 text-xs font-bold bg-primary-bg border px-1 rounded shadow-sm text-text-secondary">2</span></div>
              <div className="w-16 h-16 bg-elevated rounded-t-xl flex items-center justify-center font-mono font-bold text-text-secondary border-t border-l border-r border-border-default">2nd</div>
            </div>
            <div className="flex flex-col items-center z-10 relative">
              <Crown className="w-6 h-6 text-saffron absolute -top-8 left-1/2 -translate-x-1/2 drop-shadow-sm" />
              <div className="w-12 h-12 rounded-full bg-border-default mb-2 border-2 border-saffron shadow-md relative"></div>
              <div className="w-16 h-20 bg-saffron/10 border-saffron/30 rounded-t-xl flex items-center justify-center font-mono font-bold text-saffron border-t border-l border-r">1st</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-border-default mb-2 border-2 border-surface shadow-sm relative"><span className="absolute -top-3 -right-2 text-xs font-bold bg-primary-bg border px-1 rounded shadow-sm text-text-secondary">3</span></div>
              <div className="w-16 h-12 bg-elevated rounded-t-xl flex items-center justify-center font-mono font-bold text-text-secondary border-t border-l border-r border-border-default">3rd</div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            <div className="flex items-center justify-between p-3 bg-primary-bg rounded-lg border border-border-default text-sm text-text-secondary"><span>4. Anonymous_Frog</span><span className="font-mono font-bold">14,200</span></div>
            <div className="flex items-center justify-between p-3 bg-violet/10 rounded-lg border border-violet/30 text-sm font-bold text-violet shadow-sm"><span>5. You</span><span className="font-mono font-bold">13,950</span></div>
            <div className="flex items-center justify-between p-3 bg-primary-bg rounded-lg border border-border-default text-sm text-text-secondary"><span>6. Hidden_Tiger</span><span className="font-mono font-bold">13,100</span></div>
          </div>
        </Card>

      </div>
      <section>
        <Card className="p-6 bg-surface border border-border-default">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-xl text-text-primary flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald" /> Learning Quest Map
            </h3>
            <span className="text-sm font-bold text-violet bg-violet/10 px-3 py-1.5 rounded-lg border border-violet/20">Next: Graphs & Trees</span>
          </div>
          
          <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
            <div className="min-w-[600px] h-[160px] relative flex items-center justify-center gap-2">
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-[2px] bg-border-default -z-10" />
              
              {[
                { name: "Arrays", status: "done", val: "100%" },
                { name: "Linked List", status: "done", val: "100%" },
                { name: "Trees", status: "current", val: "40%" },
                { name: "Graphs", status: "locked", val: "0%" },
                { name: "DP", status: "locked", val: "0%" },
              ].map((node, i) => (
                <div key={i} className="flex flex-col items-center relative z-10 px-4">
                  <div className={`w-16 h-16 flex items-center justify-center mb-2 shadow-sm transition-transform hover:scale-105 cursor-pointer
                    ${node.status === 'done' ? 'text-emerald' : node.status === 'current' ? 'text-violet drop-shadow-[0_0_10px_rgba(91,71,224,0.3)]' : 'text-border-default'}
                  `}>
                    <Hexagon className="w-16 h-16 absolute inset-0" fill="currentColor" stroke={node.status === 'current' ? '#5B47E0' : 'none'} strokeWidth="2" fillOpacity={node.status==='current'?0.1:1} />
                    <span className={`relative z-10 text-[10px] font-bold uppercase tracking-wider ${node.status === 'done' ? 'text-surface' : node.status === 'current' ? 'text-violet' : 'text-text-tertiary'}`}>
                      {node.val}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${node.status === 'done' ? 'text-text-primary' : node.status === 'current' ? 'text-violet' : 'text-text-tertiary'}`}>{node.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>
      <section>
        <Card className="p-6 bg-surface border border-border-default overflow-hidden relative">
          <h3 className="font-heading font-bold text-xl text-text-primary mb-1 flex items-center gap-2">
            <Lock className="w-5 h-5 text-text-secondary" /> Save to Unlock
          </h3>
          <p className="text-sm font-medium text-text-secondary mb-6">Stay under budget 7 days to unlock premium features. <span className="font-bold text-saffron">Day 4 of 7</span></p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-bg border border-border-default p-4 rounded-xl flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px] flex items-center justify-center z-20 group-hover:backdrop-blur-0 transition-all cursor-pointer">
                <Lock className="w-6 h-6 text-text-primary drop-shadow-sm group-hover:opacity-0 transition-opacity" />
              </div>
              <div className="w-10 h-10 bg-violet/10 text-violet rounded-lg flex items-center justify-center mb-3 z-10"><Video className="w-5 h-5" /></div>
              <div className="font-bold text-sm text-text-primary z-10">Advanced AI Mock</div>
            </div>
            <div className="bg-primary-bg border border-border-default p-4 rounded-xl flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px] flex items-center justify-center z-20 group-hover:backdrop-blur-0 transition-all cursor-pointer">
                <Lock className="w-6 h-6 text-text-primary drop-shadow-sm group-hover:opacity-0 transition-opacity" />
              </div>
              <div className="w-10 h-10 bg-emerald/10 text-emerald rounded-lg flex items-center justify-center mb-3 z-10"><BookOpen className="w-5 h-5" /></div>
              <div className="font-bold text-sm text-text-primary z-10">Deep Topic Map</div>
            </div>
            <div className="bg-primary-bg border border-border-default p-4 rounded-xl flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px] flex items-center justify-center z-20 group-hover:backdrop-blur-0 transition-all cursor-pointer">
                <Lock className="w-6 h-6 text-text-primary drop-shadow-sm group-hover:opacity-0 transition-opacity" />
              </div>
              <div className="w-10 h-10 bg-saffron/10 text-saffron rounded-lg flex items-center justify-center mb-3 z-10"><Flame className="w-5 h-5" /></div>
              <div className="font-bold text-sm text-text-primary z-10">Custom Roast</div>
            </div>
          </div>
        </Card>
      </section>
      <section>
        <Card className="p-6 bg-surface border border-border-default flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h3 className="font-heading font-bold text-xl text-text-primary mb-2 flex items-center gap-2">
              <Swords className="w-5 h-5 text-rose" /> Challenge a Friend
            </h3>
            <p className="text-sm font-medium text-text-secondary mb-4">Send a custom quiz link. Winner gets 50 XP.</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Friend's username..." className="flex-1 bg-primary-bg border border-border-default rounded-lg px-4 py-2.5 text-sm outline-none focus:border-rose shadow-sm" />
              <button className="bg-text-primary text-surface px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-text-primary/90 transition-colors shadow-sm">Send</button>
            </div>
          </div>
          
          <div className="flex-1 bg-primary-bg border border-border-default p-4 rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4">Last Challenge</h4>
            <div className="flex justify-between items-center px-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-rose/10 flex items-center justify-center mb-2 mx-auto relative">
                  <Crown className="w-5 h-5 text-rose absolute -top-4" />
                  <span className="font-display text-rose text-lg font-bold">85</span>
                </div>
                <div className="text-xs font-bold text-text-primary">You</div>
              </div>
              <span className="font-bold text-text-tertiary font-mono">VS</span>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-2 border-border-default flex items-center justify-center mb-2 mx-auto text-text-secondary">
                  <span className="font-display text-lg font-bold">72</span>
                </div>
                <div className="text-xs font-medium text-text-secondary">Rohan</div>
              </div>
            </div>
          </div>
        </Card>
      </section>

    </div>
  );
}