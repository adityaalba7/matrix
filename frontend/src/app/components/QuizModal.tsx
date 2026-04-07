import { Card } from "./ui/card";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Brain, CheckCircle2, XCircle } from "lucide-react";
import { startQuiz, answerQuestion, endQuiz } from "../../lib/study";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function QuizModal({ isOpen, onClose, onComplete }: QuizModalProps) {
  const [step, setStep] = useState<'config' | 'loading' | 'quiz' | 'result'>('config');
  const [config, setConfig] = useState({ subject: 'DBMS', difficulty: 'medium', count: 5 });
  
  const [session, setSession] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  
  const [scoreData, setScoreData] = useState<any>(null);

  const handleStart = async () => {
    setStep('loading');
    try {
      const data = await startQuiz({
        source_type: 'topic',
        subject: config.subject,
        difficulty: config.difficulty,
        total_questions: config.count
      });
      setSession(data.session_id);
      setQuestions(data.questions);
      setStartTime(Date.now());
      setStep('quiz');
    } catch (err) {
      console.error(err);
      onClose();
    }
  };

  const handleAnswer = async (selectedOpt: string) => {
    const q = questions[currentIndex];
    
    try {
      await answerQuestion(session!, {
        question_text: q.question_text,
        correct_answer: q.correct_answer,
        user_answer: selectedOpt,
        is_correct: selectedOpt === q.correct_answer,
        concept_tag: q.concept_tag,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to submit answer. Please try again.');
      return;
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(c => c + 1);
    } else {
      setStep('loading');
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const res = await endQuiz(session!, timeTaken);
      setScoreData(res);
      setStep('result');
      onComplete(); // refresh parent dashboard
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-primary-bg/95 backdrop-blur-md">
          <div className="min-h-full flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg m-auto"
              >
              {step === 'config' && (
                <Card className="p-6 bg-surface shadow-xl border-border-default">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-heading font-bold text-text-primary">Panic Mode: Quick Quiz</h2>
                    <button onClick={onClose} className="text-text-tertiary hover:text-text-primary">✕</button>
                  </div>
                  <div className="space-y-4 mb-8">
                    <div>
                      <label className="text-sm font-medium text-text-secondary block mb-1">Subject</label>
                      <input 
                        type="text" 
                        value={config.subject} 
                        onChange={e => setConfig({...config, subject: e.target.value})}
                        className="w-full p-2.5 rounded-lg border border-border-default bg-primary-bg" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1">Difficulty</label>
                        <select 
                          value={config.difficulty} 
                          onChange={e => setConfig({...config, difficulty: e.target.value})}
                          className="w-full p-2.5 rounded-lg border border-border-default bg-primary-bg"
                        >
                          <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1">Questions</label>
                        <select 
                          value={config.count} 
                          onChange={e => setConfig({...config, count: parseInt(e.target.value)})}
                          className="w-full p-2.5 rounded-lg border border-border-default bg-primary-bg"
                        >
                          <option value={3}>3 Questions</option><option value={5}>5 Questions</option><option value={10}>10 Questions</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleStart}
                    className="w-full bg-rose text-surface font-bold py-3 rounded-lg hover:bg-rose/90 transition shadow-[0_4px_10px_rgba(217,59,59,0.3)]"
                  >
                    Generate AI Quiz
                  </button>
                </Card>
              )}

              {step === 'loading' && (
                <Card className="p-10 bg-surface shadow-xl flex flex-col items-center justify-center min-h-[300px] relative">
                  <button onClick={onClose} className="absolute top-6 right-6 text-text-tertiary hover:text-text-primary">✕</button>
                  <div className="w-12 h-12 border-4 border-emerald border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-text-secondary font-medium animate-pulse">AI is writing questions...</p>
                </Card>
              )}

              {step === 'quiz' && questions.length > 0 && (
                <Card className="p-6 bg-surface shadow-xl border-border-default">
                  <div className="flex justify-between items-center mb-6 text-sm font-bold text-text-tertiary">
                    <span>Q {currentIndex + 1} of {questions.length}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-emerald">{config.subject}</span>
                      <button onClick={onClose} className="text-text-tertiary hover:text-text-primary text-base">✕</button>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-6 leading-relaxed">
                    {questions[currentIndex].question_text}
                  </h3>
                  <div className="space-y-3">
                    {questions[currentIndex].options.map((opt: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className="w-full text-left p-4 rounded-xl border border-border-default hover:border-emerald hover:bg-emerald/5 transition-colors text-text-primary text-sm font-medium"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              {step === 'result' && scoreData && (
                <Card className="p-8 bg-surface shadow-xl border-border-default text-center">
                  <Brain className="w-16 h-16 text-emerald mx-auto mb-4" />
                  <h2 className="text-2xl font-display text-text-primary mb-2">Quiz Complete!</h2>
                  <div className="text-5xl font-display text-emerald my-6">{scoreData.score}%</div>
                  <p className="text-text-secondary mb-8">
                    You got {scoreData.correct} out of {scoreData.total} correct.
                  </p>
                  <button 
                    onClick={onClose}
                    className="w-full bg-emerald text-surface font-bold py-3 rounded-lg hover:bg-emerald/90 transition"
                  >
                    Return to Dashboard
                  </button>
                </Card>
              )}
            </motion.div>
            </AnimatePresence>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
