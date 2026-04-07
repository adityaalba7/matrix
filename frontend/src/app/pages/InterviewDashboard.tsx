import { Card } from "../components/ui/card";
import {
  Mic, Activity, Target, MessageSquare, AlertCircle, TrendingUp,
  Users, Video as VideoIcon, PhoneCall, Send, X, RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import {
  startInterviewSession,
  submitInterviewAnswer,
  endInterviewSession,
  getInterviewPerformance,
  getInterviewFillerStats,
  sendSalaryNegotiation,
} from "../../lib/interview";
import api from "../../lib/api";


export default function InterviewDashboard() {
  // ── Core Session State ──
  const [domain, setDomain] = useState("CS / DSA");
  const [roundType, setRoundType] = useState("Technical");
  const [session, setSession] = useState<any>(null);
  const [question, setQuestion] = useState<any>(null);
  const [questionNum, setQuestionNum] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [finalResult, setFinalResult] = useState<any>(null);

  // ── Stats from DB ──
  const [stats, setStats] = useState<any>({
    total_sessions: 0, avg_clarity: 0, avg_depth: 0,
    avg_confidence: 0, avg_structure: 0, total_filler_words: 0,
  });
  const [fillerStats, setFillerStats] = useState<{ total: number; top: [string, number][] }>({
    total: 0, top: [],
  });

  // ── Web Speech API ──
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // ── Salary Negotiation ──
  const [salaryMessages, setSalaryMessages] = useState<{ role: string; content: string }[]>([]);
  const [salaryInput, setSalaryInput] = useState("");
  const [salaryLoading, setSalaryLoading] = useState(false);

  // ── JD Analyzer ──
  const [jdText, setJdText] = useState("");
  const [jdResult, setJdResult] = useState<{ skills: string[]; plan: string } | null>(null);
  const [jdLoading, setJdLoading] = useState(false);

  // ── Mouth animation ──
  const [mouthOpen, setMouthOpen] = useState(false);

  // ─────────────── Init ───────────────
  useEffect(() => {
    loadStats();
    initSpeech();
    const mouth = setInterval(() => setMouthOpen(p => !p), 400 + Math.random() * 800);
    return () => clearInterval(mouth);
  }, []);

  const loadStats = async () => {
    const [perf, filler] = await Promise.all([
      getInterviewPerformance(),
      getInterviewFillerStats(),
    ]);
    if (perf) setStats(perf);
    if (filler) {
      const top = Object.entries(filler.breakdown || {})
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 5) as [string, number][];
      setFillerStats({ total: filler.total_filler_count || 0, top });
    }
  };

  const initSpeech = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
      }
      if (final) setAnswer(p => p + final);
    };
    rec.onend = () => setIsRecording(false);
    recognitionRef.current = rec;
  };

  // ─────────────── Interview Session ───────────────
  const handleStart = async () => {
    setLoading(true);
    setFeedback(null);
    setFinalResult(null);
    setSessionComplete(false);
    setQuestionNum(0);
    try {
      const data = await startInterviewSession(domain, roundType);
      setSession(data);
      setQuestion(data.first_question);
      setAnswer("");
    } catch (e: any) {
      alert("Failed to start session: " + (e?.response?.data?.message || e.message));
    }
    setLoading(false);
  };

  const handleReset = async () => {
    if (session && !sessionComplete) {
      try { await endInterviewSession(session.session_id); } catch {}
    }
    setSession(null);
    setQuestion(null);
    setAnswer("");
    setFeedback(null);
    setQuestionNum(0);
    setSessionComplete(false);
    setFinalResult(null);
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); }
    await loadStats();
  };

  const handleSubmit = async () => {
    if (!answer.trim() || !session || !question) return;
    setLoading(true);
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); }
    try {
      const data = await submitInterviewAnswer(
        session.session_id, question.question_text, answer, question.index
      );
      setFeedback(data);
      const nextNum = questionNum + 1;
      if (!data.is_last && data.next_question) {
        setQuestion(data.next_question);
        setQuestionNum(nextNum);
        setAnswer("");
        setFeedback(null);
        setTimeout(() => setFeedback(data), 100); // show feedback briefly then clear for next
      } else {
        // Last answer — end session
        const endData = await endInterviewSession(session.session_id);
        setFinalResult(endData);
        setSessionComplete(true);
        setQuestion(null);
        await loadStats();
      }
    } catch (e: any) {
      alert("Submit failed: " + (e?.response?.data?.message || e.message));
    }
    setLoading(false);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return alert("Speech Recognition not supported. Use Chrome.");
    if (isRecording) { recognitionRef.current.stop(); setIsRecording(false); }
    else { recognitionRef.current.start(); setIsRecording(true); }
  };

  // ─────────────── Salary Negotiation ───────────────
  const handleSalarySend = async () => {
    if (!salaryInput.trim() || salaryLoading) return;
    const msg = salaryInput.trim();
    setSalaryInput("");
    setSalaryLoading(true);
    // Optimistically show user message
    setSalaryMessages(p => [...p, { role: "user", content: msg }]);
    try {
      const data = await sendSalaryNegotiation(msg);
      // Backend returns full history array
      if (data?.history) {
        setSalaryMessages(data.history);
      } else if (data?.reply) {
        setSalaryMessages(p => [...p, { role: "assistant", content: data.reply }]);
      }
    } catch (e: any) {
      const errMsg = e?.response?.data?.message || e.message || "Unknown error";
      setSalaryMessages(p => [...p, { role: "assistant", content: `❌ HR unavailable: ${errMsg}` }]);
    }
    setSalaryLoading(false);
  };

  // ─────────────── JD Analyzer ───────────────
  const handleJDAnalyze = async () => {
    if (!jdText.trim()) return;
    setJdLoading(true);
    setJdResult(null);
    try {
      const res = await api.post("/interview/jd-analyze", { jd_text: jdText });
      setJdResult((res.data as any).data);
    } catch {
      setJdResult({ skills: ["React", "Node.js", "System Design"], plan: "AI analysis unavailable. Check your backend." });
    }
    setJdLoading(false);
  };

  const clarityScore = feedback?.scores?.clarity || 0;
  const sessionProgress = session ? `${questionNum + 1}/${session.total_questions}` : null;

  return (
    <div className="space-y-8 pb-10">

      {/* ── Stats Row ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Sessions Done", value: stats.total_sessions ?? 0, icon: VideoIcon, color: "text-violet" },
          { label: "Avg Clarity", value: stats.avg_clarity ? `${stats.avg_clarity}%` : "—", icon: Target, color: "text-emerald" },
          { label: "Avg Confidence", value: stats.avg_confidence ? `${stats.avg_confidence}%` : "—", icon: TrendingUp, color: "text-saffron" },
          { label: "Total Fillers", value: fillerStats.total ?? 0, icon: MessageSquare, color: "text-rose" },
        ].map((stat, i) => (
          <Card key={i} className="p-5 flex flex-col justify-center bg-surface border-t-[3px] border-t-violet border-border-default hover:bg-elevated transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-[28px] font-display text-text-primary leading-none">{stat.value}</span>
            </div>
            <div className="text-[12px] text-text-secondary font-medium uppercase tracking-wider">{stat.label}</div>
          </Card>
        ))}
      </section>

      {/* ── Main Interview Panel ── */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 flex flex-col" style={{ minHeight: 720 }}>
          <Card className="flex-1 p-8 bg-surface border border-border-default flex flex-col relative overflow-hidden">

            {/* Status badge */}
            <div className={`absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full border ${
              sessionComplete ? 'bg-emerald/10 border-emerald/20' :
              session ? 'bg-violet/10 border-violet/20' : 'bg-surface border-border-default'
            }`}>
              <Activity className={`w-4 h-4 animate-pulse ${sessionComplete ? 'text-emerald' : session ? 'text-violet' : 'text-text-tertiary'}`} />
              <span className={`text-xs font-mono font-bold tracking-widest uppercase ${sessionComplete ? 'text-emerald' : session ? 'text-violet' : 'text-text-tertiary'}`}>
                {sessionComplete ? 'Complete' : session ? `Q ${sessionProgress}` : 'Ready'}
              </span>
            </div>

            {/* AI Avatar */}
            <div className="flex-1 flex flex-col items-center justify-center py-8">
              <div className="relative w-32 h-32 mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_30px_rgba(91,71,224,0.2)]">
                  <polygon points="50 5,95 27.5,95 72.5,50 95,5 72.5,5 27.5" fill="#5B47E0" />
                  <polygon points="50 15,80 32,50 50,20 32" fill="rgba(255,255,255,0.15)" />
                  <polygon points="50 50,80 32,80 68,50 85" fill="rgba(0,0,0,0.2)" />
                  <rect x="30" y="38" width="12" height="4" rx="2" fill="#FFF" />
                  <rect x="58" y="38" width="12" height="4" rx="2" fill="#FFF" />
                  <motion.rect x="40" y="64" width="20"
                    height={mouthOpen ? 8 : 2} rx={mouthOpen ? 4 : 1} fill="#FFF"
                    animate={{ height: mouthOpen ? 8 : 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  />
                </svg>
              </div>

              {/* Session complete result */}
              <AnimatePresence>
                {sessionComplete && finalResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md text-center"
                  >
                    <p className="text-2xl font-bold text-emerald mb-2">Session Complete! 🎉</p>
                    <div className="grid grid-cols-2 gap-3 mt-4 text-left">
                      {[
                        { label: "Clarity", value: finalResult.session?.clarity_score },
                        { label: "Depth", value: finalResult.session?.depth_score },
                        { label: "Confidence", value: finalResult.session?.confidence_score },
                        { label: "Structure", value: finalResult.session?.structure_score },
                      ].map(m => (
                        <div key={m.label} className="bg-primary-bg border border-border-default rounded-lg p-3">
                          <div className="text-xs text-text-secondary mb-1">{m.label}</div>
                          <div className="text-2xl font-mono font-bold text-text-primary">{m.value ?? "—"}<span className="text-sm text-text-secondary">/100</span></div>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleReset} className="mt-5 w-full py-2 bg-violet text-surface font-bold rounded-lg hover:bg-violet/90 transition-colors flex items-center justify-center gap-2">
                      <RotateCcw className="w-4 h-4" /> Start New Session
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {!sessionComplete && (
                <p className="text-center font-sans text-lg font-medium text-text-primary max-w-md leading-relaxed min-h-[80px]">
                  {loading ? (
                    <span className="text-text-secondary animate-pulse">AI is thinking...</span>
                  ) : question ? (
                    <span>"{question.question_text}"</span>
                  ) : (
                    <span className="text-text-secondary">Select a domain and click <b>Start Session</b></span>
                  )}
                </p>
              )}
            </div>

            {/* Answer area */}
            {!sessionComplete && (
              <div className="bg-primary-bg p-4 rounded-xl border border-border-default mt-auto">
                {/* Per-answer feedback */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="mb-3 p-3 bg-emerald/10 border border-emerald/20 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-emerald">AI Feedback</span>
                        <div className="flex gap-2 text-xs font-mono">
                          <span className="text-violet">C: {feedback.scores?.clarity}</span>
                          <span className="text-saffron">D: {feedback.scores?.depth}</span>
                          <span className="text-emerald">S: {feedback.scores?.structure}</span>
                        </div>
                      </div>
                      <p className="text-xs text-text-primary">{feedback.feedback}</p>
                      {feedback.filler_words?.total_count > 0 && (
                        <p className="text-xs text-rose mt-1">⚠ {feedback.filler_words.total_count} filler word(s) detected</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-end gap-3">
                  <textarea
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder={isRecording ? "Listening… speak clearly" : "Type your answer or click the mic…"}
                    disabled={!question || loading}
                    rows={3}
                    className="flex-1 bg-transparent resize-none outline-none text-text-primary text-[15px] font-sans placeholder:text-text-tertiary disabled:opacity-40"
                  />
                  <button
                    onClick={toggleRecording}
                    disabled={!question || loading}
                    className={`p-3 rounded-xl transition-all mb-1 ${isRecording ? 'bg-rose text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]' : 'bg-surface border border-border-default text-text-secondary hover:bg-elevated'} disabled:opacity-40`}
                  >
                    <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
                  </button>
                </div>

                <div className="mt-3 flex gap-2 justify-between items-center">
                  {session && (
                    <button onClick={handleReset} className="text-xs text-text-secondary hover:text-rose transition-colors flex items-center gap-1">
                      <X className="w-3 h-3" /> End Session
                    </button>
                  )}
                  <div className="ml-auto flex gap-2">
                    {!session ? (
                      <button onClick={handleStart} disabled={loading}
                        className="px-6 py-2 bg-violet text-white text-sm font-bold rounded-lg hover:bg-violet/90 transition-colors disabled:opacity-50">
                        {loading ? "Starting…" : "Start Session"}
                      </button>
                    ) : (
                      <button onClick={handleSubmit} disabled={loading || !answer.trim()}
                        className="px-6 py-2 bg-emerald text-white text-sm font-bold rounded-lg hover:bg-emerald/90 transition-colors disabled:opacity-50">
                        {loading ? "Evaluating…" : "Submit Answer"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ── Right Panel ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Domain Setup */}
          <Card className="p-6 bg-surface border border-border-default flex flex-col gap-4">
            <h3 className="font-heading font-bold text-lg text-text-primary">Domain Setup</h3>
            <div className="grid grid-cols-2 gap-2">
              {["CS / DSA", "Frontend", "Backend", "System Design", "Data Science", "DevOps"].map(d => (
                <button key={d} disabled={!!session} onClick={() => setDomain(d)}
                  className={`py-2 px-2 text-xs font-medium rounded border transition-colors disabled:opacity-50 ${d === domain ? 'bg-violet/10 border-violet/30 text-violet font-bold' : 'bg-primary-bg border-border-default text-text-secondary hover:bg-elevated'}`}>
                  {d}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              {["Technical", "HR", "Mixed"].map(r => (
                <button key={r} disabled={!!session} onClick={() => setRoundType(r)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded border transition-colors disabled:opacity-50 ${r === roundType ? 'bg-saffron/10 border-saffron/30 text-saffron font-bold' : 'bg-primary-bg border-border-default text-text-secondary hover:bg-elevated'}`}>
                  {r}
                </button>
              ))}
            </div>
          </Card>

          {/* Filler Word Stats */}
          <Card className="p-6 bg-surface border border-border-default flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-violet/10 flex items-center justify-center text-violet">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-semibold text-[15px] text-text-primary">Filler Word Tracker</h3>
            </div>
            {fillerStats.top.length === 0 ? (
              <p className="text-xs text-text-tertiary text-center py-4">No data yet. Complete a session to see tracking.</p>
            ) : (
              <div className="space-y-2">
                {fillerStats.top.map(([word, count]) => {
                  const max = fillerStats.top[0]?.[1] || 1;
                  const pct = Math.round((count / max) * 100);
                  return (
                    <div key={word} className="flex items-center gap-2">
                      <span className="w-10 text-xs font-mono text-text-secondary shrink-0">{word}</span>
                      <div className="flex-1 h-1.5 bg-border-default rounded-full overflow-hidden">
                        <div className="h-full bg-rose rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-bold w-5 text-right">{count}</span>
                    </div>
                  );
                })}
                <div className="pt-2 border-t border-border-default flex justify-between items-center mt-2">
                  <span className="text-xs text-text-secondary">Total filler words used</span>
                  <span className="text-sm font-bold text-rose font-mono">{fillerStats.total}</span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* ── Bottom Feature Cards ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* Salary Negotiation Coach */}
        <Card className="p-5 bg-surface border border-border-default flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Salary Negotiation Coach</h3>
          </div>

          {/* Fixed-height scrollable chat — no gap */}
          <div className="h-44 overflow-y-auto flex flex-col gap-1.5 pr-1 mb-3">
            {salaryMessages.length === 0 && (
              <p className="text-xs text-text-tertiary text-center my-auto">Start the negotiation — HR is waiting</p>
            )}
            {salaryMessages.map((m, i) => (
              <div key={i} className={`text-[11px] px-3 py-2 rounded-lg max-w-[85%] shrink-0 ${
                m.role === "user"
                  ? "self-end bg-emerald/10 text-emerald border border-emerald/20"
                  : "self-start bg-primary-bg border border-border-default text-text-primary"
              }`}>
                {m.content}
              </div>
            ))}
            {salaryLoading && <div className="self-start text-[11px] text-text-tertiary animate-pulse px-2">HR is typing…</div>}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={salaryInput}
              onChange={e => setSalaryInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSalarySend()}
              placeholder="e.g. I'm expecting ₹18 LPA..."
              className="flex-1 bg-primary-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none text-text-primary placeholder:text-text-tertiary"
            />
            <button onClick={handleSalarySend} disabled={salaryLoading || !salaryInput.trim()}
              className="p-2 bg-emerald rounded-lg text-white disabled:opacity-50 hover:bg-emerald/90 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </Card>


        {/* JD Analyzer */}
        <Card className="p-5 bg-surface border border-border-default flex flex-col" style={{ minHeight: 320 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-violet/10 flex items-center justify-center text-violet">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">JD Analyzer</h3>
          </div>

          <textarea
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            placeholder="Paste any Job Description here →"
            rows={4}
            className="w-full bg-primary-bg border border-border-default rounded-lg px-3 py-2 text-xs outline-none mb-3 resize-none text-text-primary placeholder:text-text-tertiary"
          />

          {jdResult && (
            <div className="mb-3">
              <div className="flex gap-1.5 flex-wrap mb-2">
                {jdResult.skills.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-violet/10 text-violet text-[10px] font-bold rounded border border-violet/20">{s}</span>
                ))}
              </div>
              {jdResult.plan && (
                <p className="text-[11px] text-text-secondary leading-relaxed bg-primary-bg border border-border-default rounded-lg p-2">{jdResult.plan}</p>
              )}
            </div>
          )}

          <button onClick={handleJDAnalyze} disabled={jdLoading || !jdText.trim()}
            className="w-full text-xs font-semibold text-surface bg-violet py-2 rounded-lg hover:bg-violet/90 transition-colors mt-auto disabled:opacity-50">
            {jdLoading ? "Analyzing…" : "Extract Skills & Generate Plan →"}
          </button>
        </Card>

        {/* Bullshit Detector - live from last answer */}
        <Card className="p-5 bg-surface border border-border-default flex flex-col justify-between" style={{ minHeight: 320 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-saffron/10 flex items-center justify-center text-saffron">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Answer Quality Meter</h3>
          </div>

          {feedback ? (
            <div className="flex-1 space-y-3">
              {[
                { label: "Clarity", value: feedback.scores?.clarity, color: "bg-violet" },
                { label: "Depth", value: feedback.scores?.depth, color: "bg-saffron" },
                { label: "Confidence", value: feedback.scores?.confidence, color: "bg-emerald" },
                { label: "Structure", value: feedback.scores?.structure, color: "bg-rose" },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary font-medium">{m.label}</span>
                    <span className="font-mono font-bold text-text-primary">{m.value ?? 0}</span>
                  </div>
                  <div className="h-1.5 bg-border-default rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${m.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${m.value ?? 0}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-3 bg-violet/10 border border-violet/20 p-3 rounded-lg">
                <p className="text-xs font-bold text-violet mb-1">AI Feedback:</p>
                <p className="text-xs text-text-primary">{feedback.feedback}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-10 h-10 text-border-default mb-3" />
              <p className="text-xs text-text-tertiary">Submit your first answer to see real-time quality analysis</p>
            </div>
          )}
        </Card>

        {/* Mirror Mode */}
        <Card className="p-5 bg-surface border border-border-default flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-violet/10 flex items-center justify-center text-violet">
              <VideoIcon className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Mirror Mode</h3>
          </div>
          <MirrorMode />
        </Card>

        {/* Recent Session History */}
        <Card className="p-5 bg-surface border border-border-default flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-saffron/10 flex items-center justify-center text-saffron">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Score Progress</h3>
          </div>
          <ScoreProgress stats={stats} />
        </Card>

        {/* Start Company Simulated Call */}
        <Card className="p-5 bg-violet border-none hover:bg-violet/90 transition-colors flex flex-col justify-between shadow-[0_10px_30px_rgba(91,71,224,0.3)] cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-surface/20 flex items-center justify-center text-surface">
              <PhoneCall className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-bold text-lg text-surface">Company-Specific Prep</h3>
          </div>
          <p className="text-sm text-surface/80 mb-4 font-medium">Practice with domain tailored to your target company's interview style.</p>
          <div className="space-y-2 mt-auto">
            {["Google (System Design)", "Flipkart (DSA)", "Startup (HR + Culture)"].map(c => (
              <button key={c} onClick={async () => {
                // Parse: "Google (System Design)" -> domain="System Design", roundType="Technical"
                const match = c.match(/^(.+?)\s*\((.+)\)$/);
                const newDomain = match?.[2]?.includes("HR") ? "CS / DSA" : (match?.[2] || "CS / DSA");
                const newRound = match?.[2]?.includes("HR") ? "HR" : "Technical";
                setDomain(newDomain);
                setRoundType(newRound);
                // Reset any active session first, then start fresh
                if (session && !sessionComplete) {
                  try { await endInterviewSession(session.session_id); } catch {}
                }
                setSession(null); setQuestion(null); setAnswer("");
                setFeedback(null); setQuestionNum(0); setSessionComplete(false); setFinalResult(null);
                // Small delay to let state settle, then start
                setTimeout(async () => {
                  setLoading(true);
                  try {
                    const data = await startInterviewSession(newDomain, newRound);
                    setSession(data);
                    setQuestion(data.first_question);
                  } catch (e: any) {
                    alert("Failed to start: " + (e?.response?.data?.message || e.message));
                  }
                  setLoading(false);
                }, 100);
              }}
                className="w-full text-left text-xs font-semibold text-surface/90 bg-surface/10 border border-surface/20 px-3 py-2 rounded-lg hover:bg-surface/20 transition-colors">
                {c}
              </button>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

// ── Subcomponents ──

function MirrorMode() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  const toggle = async () => {
    if (active) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(t => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      setActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
        setActive(true);
      } catch { alert("Camera access denied."); }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full h-28 bg-primary-bg border border-border-default rounded-lg overflow-hidden relative flex items-center justify-center">
        <video ref={videoRef} muted className={`w-full h-full object-cover ${active ? 'block' : 'hidden'}`} />
        {!active && <span className="text-text-tertiary text-sm">📷 Camera off</span>}
        {active && <div className="absolute top-2 left-2 w-2 h-2 bg-rose rounded-full animate-pulse" />}
      </div>
      <button onClick={toggle}
        className={`w-full text-xs font-semibold py-2 rounded-lg border transition-colors ${active ? 'bg-rose/10 text-rose border-rose/30 hover:bg-rose/20' : 'bg-primary-bg text-text-secondary border-border-default hover:bg-elevated'}`}>
        {active ? "Stop Camera" : "Start Mirror Mode"}
      </button>
      <p className="text-[10px] text-text-tertiary text-center">Watch your body language and eye contact while answering</p>
    </div>
  );
}

function ScoreProgress({ stats }: { stats: any }) {
  const metrics = [
    { label: "Clarity", value: stats.avg_clarity, color: "text-violet border-violet" },
    { label: "Depth", value: stats.avg_depth, color: "text-saffron border-saffron" },
    { label: "Confidence", value: stats.avg_confidence, color: "text-emerald border-emerald" },
    { label: "Structure", value: stats.avg_structure, color: "text-rose border-rose" },
  ];

  if (!stats.total_sessions) {
    return <p className="text-xs text-text-tertiary text-center py-6">Complete a session to see your average scores</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map(m => (
        <div key={m.label} className={`flex flex-col items-center p-3 rounded-xl border-2 ${m.color} bg-primary-bg`}>
          <span className={`text-2xl font-mono font-bold ${m.color.split(" ")[0]}`}>{m.value ?? "—"}</span>
          <span className="text-[10px] text-text-secondary font-medium mt-1">{m.label}</span>
        </div>
      ))}
    </div>
  );
}