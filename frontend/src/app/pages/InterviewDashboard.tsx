import { Card } from "../components/ui/card";
import { Mic, Keyboard, Activity, Target, MessageSquare, AlertCircle, TrendingUp, Users, Video as VideoIcon, PhoneCall, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

export default function InterviewDashboard() {
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const keywords = ["Binary Search Tree", "O(log n)", "Time Complexity", "Pointers"];
  const matchedKeywords = answer.toLowerCase().includes("binary") ? ["Binary Search Tree"] : [];
  
  if (answer.toLowerCase().includes("time")) matchedKeywords.push("Time Complexity");
  if (answer.toLowerCase().includes("log")) matchedKeywords.push("O(log n)");

  const score = Math.floor((matchedKeywords.length / keywords.length) * 100);

  const [mouthOpen, setMouthOpen] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setMouthOpen(prev => !prev);
    }, 400 + Math.random() * 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Mock Interviews Done", value: "7", icon: VideoIcon },
          { label: "Avg Score", value: "68", icon: Target },
          { label: "Filler Words (Last)", value: "12", icon: MessageSquare },
          { label: "Best Domain", value: "DSA 84%", icon: TrendingUp },
        ].map((stat, i) => (
          <Card key={i} className="p-5 flex flex-col justify-center bg-surface border-t-[3px] border-t-violet border-l-border-default border-r-border-default border-b-border-default hover:bg-elevated transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className="w-5 h-5 text-violet" />
              <span className="text-[28px] font-display text-text-primary leading-none">{stat.value}</span>
            </div>
            <div className="text-[12px] text-text-secondary font-medium uppercase tracking-wider">{stat.label}</div>
          </Card>
        ))}
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 flex flex-col h-[700px]">
          <Card className="flex-1 p-8 bg-surface border border-border-default flex flex-col relative overflow-hidden">
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-violet/10 px-3 py-1.5 rounded-full border border-violet/20">
              <Activity className="w-4 h-4 text-violet animate-pulse" />
              <span className="text-xs font-mono text-violet font-bold tracking-widest uppercase">Live Session</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-10">
              <div className="relative w-40 h-40 mb-8">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_30px_rgba(91,71,224,0.15)]">
                  <polygon points="50 5, 95 27.5, 95 72.5, 50 95, 5 72.5, 5 27.5" fill="#5B47E0" />
                  <polygon points="50 15, 80 32, 50 50, 20 32" fill="rgba(255,255,255,0.15)" />
                  <polygon points="50 50, 80 32, 80 68, 50 85" fill="rgba(0,0,0,0.2)" />
                  <rect x="30" y="40" width="12" height="4" rx="2" fill="#FFFFFF" />
                  <rect x="58" y="40" width="12" height="4" rx="2" fill="#FFFFFF" />
                  <motion.rect 
                    x="40" y="65" width="20" height={mouthOpen ? 8 : 2} rx={mouthOpen ? 4 : 1} fill="#FFFFFF" 
                    animate={{ height: mouthOpen ? 8 : 2, rx: mouthOpen ? 4 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  />
                </svg>
              </div>

              <p className="text-center font-sans text-lg md:text-xl font-medium text-text-primary max-w-md leading-relaxed">
                "How would you explain the difference between a <span className="text-violet font-semibold">Binary Search Tree</span> and a regular Binary Tree?"
              </p>
            </div>
            <div className="bg-primary-bg p-4 rounded-xl border border-border-default mt-auto">
              <div className="flex justify-between items-center mb-3">
                <div className="flex gap-2 flex-wrap">
                  {keywords.map(kw => {
                    const matched = matchedKeywords.includes(kw);
                    return (
                      <span key={kw} className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors uppercase tracking-wider ${matched ? 'bg-emerald/15 text-emerald border border-emerald/30 shadow-sm' : 'bg-surface text-text-secondary border border-border-default'}`}>
                        {kw}
                      </span>
                    );
                  })}
                </div>
                <div className="w-12 h-12 rounded-full border-[3px] bg-surface flex items-center justify-center shrink-0 transition-colors duration-500 shadow-sm" style={{ borderColor: score > 50 ? '#0EA882' : '#E8E6DF' }}>
                  <span className="font-mono text-sm font-bold" style={{ color: score > 50 ? '#0EA882' : '#A8A8B3' }}>{score}%</span>
                </div>
              </div>
              
              <div className="flex items-end gap-3">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={isRecording ? "Listening..." : "Type your answer here..."}
                  className="flex-1 h-20 bg-transparent resize-none outline-none text-text-primary text-[15px] font-sans placeholder:text-text-tertiary"
                />
                <button 
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-3 rounded-xl transition-colors shadow-sm mb-1 ${isRecording ? 'bg-rose text-surface' : 'bg-surface border border-border-default text-text-secondary hover:bg-elevated'}`}
                >
                  {isRecording ? <Mic className="w-5 h-5 animate-pulse" /> : <Keyboard className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <Card className="p-6 bg-surface border border-border-default flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-text-primary">Domain</h3>
              <div className="bg-primary-bg p-1 rounded-lg flex items-center border border-border-default shadow-sm">
                <button className="px-4 py-1 rounded text-xs font-semibold bg-surface shadow-sm text-text-primary">Tech</button>
                <button className="px-4 py-1 rounded text-xs font-semibold text-text-secondary hover:text-text-primary">HR</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['CS / DSA', 'Frontend', 'Backend', 'Data', 'Systems', 'DevOps'].map((domain, i) => (
                <button key={domain} className={`py-2 px-2 text-xs font-medium rounded border transition-colors ${i===0 ? 'bg-violet/10 border-violet/30 text-violet font-bold' : 'bg-primary-bg border-border-default text-text-secondary hover:bg-elevated'}`}>{domain}</button>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-surface border border-border-default flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg text-text-primary">STAR Method Coach</h3>
              <span className="text-xs font-bold text-violet bg-violet/10 px-2 py-1 rounded-md">2/4 Done</span>
            </div>
            <div className="space-y-3 flex-1">
              {[
                { s: "Situation", desc: "Set the scene", done: true },
                { s: "Task", desc: "Describe your responsibility", done: true },
                { s: "Action", desc: "Explain steps you took", done: false, active: true },
                { s: "Result", desc: "Share outcomes", done: false },
              ].map((step, i) => (
                <div key={i} className={`p-3 rounded-xl border transition-colors ${step.active ? 'border-violet bg-violet/5' : 'border-border-default bg-primary-bg'}`}>
                  <div className="flex justify-between items-center cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step.done ? 'bg-emerald text-surface' : step.active ? 'bg-violet text-surface' : 'bg-border-default text-text-secondary'}`}>
                        {step.done ? '✓' : i+1}
                      </div>
                      <span className={`font-bold text-sm ${step.active ? 'text-violet' : 'text-text-primary'}`}>{step.s}</span>
                    </div>
                    {step.active && <ChevronDown className="w-4 h-4 text-violet" />}
                  </div>
                  {step.active && <p className="mt-2 text-xs text-text-secondary pl-8">{step.desc}</p>}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-surface border border-border-default flex flex-col">
            <h3 className="font-heading font-bold text-sm text-text-primary mb-4 text-center uppercase tracking-widest">Progress (This Month)</h3>
            <div className="flex justify-around items-center px-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-4 border-border-default flex items-center justify-center mb-2 mx-auto">
                  <span className="font-mono font-bold text-text-tertiary">42</span>
                </div>
                <div className="text-xs text-text-secondary font-medium">Session 1</div>
              </div>
              <div className="h-[2px] w-8 bg-border-default"></div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-4 border-violet flex items-center justify-center mb-2 mx-auto shadow-[0_0_15px_rgba(91,71,224,0.2)]">
                  <span className="font-mono font-bold text-violet">74</span>
                </div>
                <div className="text-xs font-bold text-violet">Session 7</div>
              </div>
            </div>
          </Card>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-violet/10 flex items-center justify-center text-violet">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Filler Word Detector</h3>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2"><span className="w-8 text-xs font-mono text-text-secondary">um</span><div className="h-1.5 bg-rose w-1/2 rounded-full"></div><span className="text-xs font-bold">14</span></div>
            <div className="flex items-center gap-2"><span className="w-8 text-xs font-mono text-text-secondary">like</span><div className="h-1.5 bg-saffron w-1/3 rounded-full"></div><span className="text-xs font-bold">8</span></div>
            <div className="flex items-center gap-2"><span className="w-8 text-xs font-mono text-text-secondary">so</span><div className="h-1.5 bg-violet w-[40%] rounded-full"></div><span className="text-xs font-bold">11</span></div>
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-border-default pt-3">
            <span className="text-xs text-text-secondary font-medium">Avg user: 6 words</span>
            <span className="text-sm font-bold text-violet font-mono">63/100 Fluency</span>
          </div>
        </Card>

        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center text-saffron">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Bullshit Detector</h3>
          </div>
          <p className="text-sm text-text-primary italic mb-3 leading-relaxed">"...and then I <span className="underline decoration-saffron decoration-wavy text-saffron font-semibold">handled the backend stuff</span> to make it scale."</p>
          <div className="bg-violet/10 border border-violet/20 p-3 rounded-lg mt-auto">
            <p className="text-xs font-bold text-violet mb-1">AI Follow-up:</p>
            <p className="text-xs text-text-primary font-medium">"Can you specify which 'backend stuff' you handled and the metrics you used to measure scale?"</p>
          </div>
        </Card>

        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Salary Negotiation Coach</h3>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <div className="bg-primary-bg p-2 rounded-lg rounded-tl-sm text-[11px] self-start border border-border-default max-w-[80%]">We can offer ₹12LPA.</div>
            <div className="bg-emerald/10 text-emerald border border-emerald/20 p-2 rounded-lg rounded-tr-sm text-[11px] self-end font-medium max-w-[80%]">I appreciate the offer. Based on market average...</div>
            <div className="text-[10px] text-saffron font-mono mt-1">↳ Coach: Good counter. Now justify with data.</div>
          </div>
          <div className="mt-auto flex gap-1 pt-2">
            <div className="h-1 flex-1 bg-emerald rounded-full"></div>
            <div className="h-1 flex-1 bg-emerald rounded-full"></div>
            <div className="h-1 flex-1 bg-border-default rounded-full"></div>
            <div className="h-1 flex-1 bg-border-default rounded-full"></div>
          </div>
        </Card>

        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-violet/10 flex items-center justify-center text-violet">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">JD Analyzer</h3>
          </div>
          <input type="text" placeholder="Paste any JD →" className="w-full bg-primary-bg border border-border-default rounded-lg px-3 py-2 text-sm outline-none mb-3" />
          <div className="flex gap-1.5 flex-wrap mb-4">
            <span className="px-2 py-1 bg-emerald/10 text-emerald text-[10px] font-bold rounded">React</span>
            <span className="px-2 py-1 bg-saffron/10 text-saffron text-[10px] font-bold rounded">GraphQL</span>
            <span className="px-2 py-1 bg-rose/10 text-rose text-[10px] font-bold rounded">Docker</span>
          </div>
          <button className="w-full text-xs font-semibold text-text-primary bg-primary-bg border border-border-default py-2 rounded-lg hover:bg-border-default transition-colors mt-auto">Generate 7-day plan →</button>
        </Card>

        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-violet/10 flex items-center justify-center text-violet">
              <VideoIcon className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Mirror Mode</h3>
          </div>
          <div className="w-full h-24 bg-primary-bg border border-border-default rounded-lg flex items-center justify-center mb-3 overflow-hidden relative">
            <div className="absolute inset-0 border-[3px] border-emerald/30 m-2 rounded-md border-dashed"></div>
            <span className="text-text-tertiary">📷 Camera</span>
          </div>
          <div className="flex gap-2 flex-wrap mt-auto">
            <span className="px-2 py-1 bg-saffron/10 text-saffron text-[10px] font-bold rounded">Eye contact: 3 breaks</span>
            <span className="px-2 py-1 bg-emerald/10 text-emerald text-[10px] font-bold rounded">Pace: Good</span>
          </div>
        </Card>

        <Card className="p-5 bg-violet border-none hover:bg-violet/90 transition-colors flex flex-col justify-between shadow-[0_10px_30px_rgba(91,71,224,0.3)] cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-surface/20 flex items-center justify-center text-surface">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-surface">Live Company Call</h3>
          </div>
          <p className="text-sm text-surface/80 mb-4 font-medium">Simulate an Infosys HR call instantly.</p>
          <div className="bg-surface/10 p-3 rounded-lg mt-auto border border-surface/20 backdrop-blur-sm">
            <p className="text-xs font-bold text-surface mb-1">Last Call Result:</p>
            <p className="text-[11px] text-surface/90 font-medium">Call with Riya · Infosys HR · Score: 71</p>
          </div>
        </Card>
      </section>
    </div>
  );
}