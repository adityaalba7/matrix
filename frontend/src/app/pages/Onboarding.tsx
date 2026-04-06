import { Card } from "../components/ui/card";
import { BookOpen, IndianRupee, Video, ArrowRight, Triangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    setSelected(id);
  };

  return (
    <div className="min-h-screen bg-surface px-6 py-12 flex flex-col relative overflow-hidden items-center justify-center">
      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">
        
        <div className="flex items-center gap-2 mb-12">
          <Triangle className="w-8 h-8 text-text-primary fill-text-primary" />
          <span className="font-heading font-bold text-xl tracking-wide text-text-primary">TriMind</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center w-full"
            >
              <h1 className="font-display text-4xl md:text-5xl text-text-primary leading-tight text-center tracking-tight mb-4">
                What brings you here?
              </h1>
              <p className="text-text-secondary font-sans text-lg font-medium tracking-wide mb-12 text-center">
                We'll personalise everything from your answer.
              </p>

              <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
                {[
                  { id: "placed", title: "Get Placed", subtitle: "Aptitude, DSA, & Mock Interviews", icon: Video, color: "violet", accent: "#5B47E0" },
                  { id: "money", title: "Control My Money", subtitle: "Budget tracking & saving goals", icon: IndianRupee, color: "saffron", accent: "#E8620A" },
                  { id: "exam", title: "Crack My Exam", subtitle: "GATE, CAT, or Semester prep", icon: BookOpen, color: "emerald", accent: "#0EA882" },
                ].map((goal, i) => {
                  const isSelected = selected === goal.id;
                  
                  return (
                    <Card 
                      key={goal.id}
                      onClick={() => handleSelect(goal.id)}
                      className={`w-full md:w-[280px] h-[180px] p-6 flex flex-col cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                        isSelected ? 'border-transparent shadow-md' : 'hover:border-border-hover'
                      }`}
                      style={{
                        borderLeftWidth: '3px',
                        borderLeftColor: goal.accent,
                        borderColor: isSelected ? goal.accent : undefined,
                        borderWidth: isSelected ? '2px' : undefined,
                        backgroundColor: isSelected ? `${goal.accent}15` : undefined,
                      }}
                    >
                      <div className="flex flex-col gap-4 relative z-10 h-full">
                        <goal.icon className="w-8 h-8" style={{ color: goal.accent }} />
                        <div className="mt-auto">
                          <h2 className="font-heading font-bold text-xl text-text-primary mb-1">{goal.title}</h2>
                          <p className="text-text-secondary text-sm font-medium leading-relaxed">{goal.subtitle}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {selected && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setStep(2)}
                  className="mt-12 flex items-center gap-2 bg-text-primary text-surface font-medium px-8 py-3.5 rounded-xl text-sm hover:bg-text-primary/90 transition-colors"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center w-full max-w-md"
            >
              <h1 className="font-display text-4xl text-text-primary leading-tight text-center tracking-tight mb-8">
                When is the big day?
              </h1>
              
              <Card className="w-full p-6 bg-surface mb-6">
                <div className="flex justify-between items-center mb-6 px-2">
                  <span className="font-heading font-semibold text-lg">August 2026</span>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full border border-border-default flex items-center justify-center text-text-tertiary">{'<'}</div>
                    <div className="w-8 h-8 rounded-full border border-border-default flex items-center justify-center text-text-primary">{'>'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4 text-text-tertiary font-medium">
                  <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium">
                  {Array.from({ length: 31 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                        i === 14 ? 'bg-violet text-surface shadow-sm' : 'hover:bg-elevated text-text-primary'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </Card>

              <div className="w-full bg-elevated p-4 rounded-xl border-l-[3px] border-l-violet flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet/10 flex items-center justify-center shrink-0">
                  <span className="text-violet font-bold text-sm">AI</span>
                </div>
                <p className="text-sm font-medium text-text-primary">
                  I'll map your study plan backwards from this date.
                </p>
              </div>

              <button
                onClick={() => setStep(3)}
                className="mt-8 flex items-center gap-2 bg-text-primary text-surface font-medium px-8 py-3.5 rounded-xl text-sm hover:bg-text-primary/90 transition-colors"
              >
                Set my date
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center w-full max-w-md"
            >
              <h1 className="font-display text-4xl text-text-primary leading-tight text-center tracking-tight mb-4">
                What's your monthly budget?
              </h1>
              <p className="text-text-secondary font-sans text-lg font-medium tracking-wide mb-12 text-center">
                Keep it realistic. We'll help you stick to it.
              </p>

              <div className="flex items-center gap-2 mb-8">
                <span className="font-display text-5xl text-saffron">₹</span>
                <input 
                  type="text" 
                  value="8,000" 
                  readOnly 
                  className="font-display text-6xl text-text-primary bg-transparent w-48 outline-none"
                />
              </div>

              <div className="w-full h-2 bg-elevated rounded-full mb-8 relative">
                <div className="absolute left-0 top-0 h-full w-[40%] bg-saffron rounded-full"></div>
                <div className="absolute left-[40%] top-1/2 -translate-y-1/2 w-6 h-6 bg-surface border-2 border-saffron rounded-full shadow-sm"></div>
              </div>

              <Card className="w-full p-4 bg-surface text-center mb-10 border-border-default">
                <p className="text-text-secondary text-sm font-medium">That's <span className="font-bold text-text-primary">₹267/day</span> for everything.</p>
              </Card>

              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 bg-violet text-surface font-medium px-8 py-3.5 rounded-xl text-sm hover:bg-violet/90 transition-colors shadow-sm"
              >
                Launch TriMind
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute bottom-[-60px] flex gap-2">
          {[1, 2, 3].map(d => (
            <div 
              key={d} 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${step === d ? 'bg-text-primary w-6' : 'bg-border-default'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}