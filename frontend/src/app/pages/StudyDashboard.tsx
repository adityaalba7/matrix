import { Card } from "../components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { BookOpen, Brain, Clock, Target, Network, Activity, Swords, GraduationCap, AlertTriangle, Moon, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { getPerformance, getWeakTopics, getStreak } from "../../lib/study";
import { predictScore, startDebate, teachBack, getNightOwl, getMindMap } from "../../lib/python";
import { QuizModal } from "../components/QuizModal";
import { useUser } from "../../lib/userContext";

export default function StudyDashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<any>({ streak: 0, avgScore: 0, totalTopics: 0, timeLoggedText: '0h 0m' });
  const [radarData, setRadarData] = useState<{ subject: string, score: number }[]>([]);
  const [weakTopics, setWeakTopics] = useState<any[]>([]);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Mind Map
  const [mindMapTopic, setMindMapTopic] = useState('');
  const [mindMapData, setMindMapData] = useState<any>(null);
  const [mindMapLoading, setMindMapLoading] = useState(false);

  // Predict Score
  const [prediction, setPrediction] = useState<any>(null);

  // Debate
  const [debateTopic, setDebateTopic] = useState('');
  const [debateArg, setDebateArg] = useState('');
  const [debateResult, setDebateResult] = useState<any>(null);
  const [debateLoading, setDebateLoading] = useState(false);

  // Teach Back
  const [teachTopic, setTeachTopic] = useState('');
  const [teachExplanation, setTeachExplanation] = useState('');
  const [teachResult, setTeachResult] = useState<any>(null);
  const [teachLoading, setTeachLoading] = useState(false);

  // Night Owl
  const [nightOwl, setNightOwl] = useState<any>(null);

  const formatTime = (seconds: number) => {
    if (!seconds) return '0h';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  const fetchDashboardData = async () => {
    try {
      const [perfRes, weakRes, streakRes] = await Promise.all([
        getPerformance(), getWeakTopics(), getStreak()
      ]);
      setWeakTopics(weakRes.weak_topics || []);
      const p = perfRes.performance || [];
      const topics = p.map((t: any) => ({ subject: t.concept_tag || 'Gen', score: t.accuracy_pct }));
      setRadarData(topics.length > 0 ? topics : [
        { subject: 'OS', score: 0 }, { subject: 'DBMS', score: 0 }, { subject: 'DSA', score: 0 }
      ]);
      const avg = p.length > 0 ? Math.round(p.reduce((a: number, v: any) => a + v.accuracy_pct, 0) / p.length) : 0;
      setStats({ 
        streak: streakRes.current_streak, 
        avgScore: avg, 
        totalTopics: p.length,
        timeLoggedText: formatTime(perfRes.time_logged_seconds || 0)
      });
    } catch (err) { console.error("Failed to load study data", err); }
  };

  const fetchPrediction = async () => {
    try {
      const data = await predictScore(1, 'DBMS', 14);
      setPrediction(data);
    } catch { /* silent */ }
  };

  const fetchNightOwl = async () => {
    try {
      const data = await getNightOwl(1);
      setNightOwl(data);
    } catch { /* silent */ }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchPrediction();
    fetchNightOwl();
  }, []);

  const handleMindMap = async () => {
    if (!mindMapTopic.trim()) return;
    setMindMapLoading(true);
    try {
      const data = await getMindMap(mindMapTopic);
      setMindMapData(data);
    } catch (err) {
      console.error(err);
      alert('Mind Map generation failed. Check console for details.');
    }
    setMindMapLoading(false);
  };

  const handleDebate = async () => {
    if (!debateTopic.trim() || !debateArg.trim()) return;
    setDebateLoading(true);
    try {
      const data = await startDebate(debateTopic, debateArg);
      setDebateResult(data);
    } catch (err) {
      console.error(err);
      alert('Debate generation failed. Check console for details.');
    }
    setDebateLoading(false);
  };

  const handleTeachBack = async () => {
    if (!teachTopic.trim() || !teachExplanation.trim()) return;
    setTeachLoading(true);
    try {
      const data = await teachBack(teachTopic, teachExplanation);
      setTeachResult(data);
    } catch (err) {
      console.error(err);
      alert('Teach Back grading failed. Check console for details.');
    }
    setTeachLoading(false);
  };

  return (
    <div className="space-y-8 pb-10">
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} onComplete={fetchDashboardData} />

      {/* Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Topics Studied", value: stats.totalTopics.toString(), icon: BookOpen },
          { label: "Hours Logged", value: stats.timeLoggedText, icon: Clock },
          { label: "Current Streak", value: `${stats.streak}d`, icon: Brain },
          { label: "Avg Quiz Score", value: `${stats.avgScore}%`, icon: Target },
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

      {/* Radar + Start Quiz */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card className="p-6 md:p-8 bg-surface border border-border-default h-full flex flex-col">
            <h2 className="font-heading font-bold text-xl text-text-primary mb-4">Skills Radar</h2>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#E8E6DF" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B6B78', fontSize: 13, fontFamily: 'DM Sans', fontWeight: 600 }} />
                  <Radar name="Score" dataKey="score" stroke="#0EA882" strokeWidth={2} fill="#0EA882" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-text-secondary mb-3">Weak topics:</h3>
              <div className="flex gap-3 flex-wrap">
                {weakTopics.length > 0 ? weakTopics.slice(0,3).map((w, i) => (
                  <span key={i} className="px-4 py-1.5 rounded-full bg-rose/10 text-rose font-bold text-sm font-mono border border-rose/20">
                    {w.concept_tag} — {w.accuracy_pct}%
                  </span>
                )) : <span className="text-sm text-text-secondary">Take quizzes to identify weak topics.</span>}
              </div>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="p-6 bg-surface border border-border-default h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald/10 flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-emerald" />
            </div>
            <h3 className="font-heading font-bold text-xl text-text-primary mb-2">Ready to test yourself?</h3>
            <p className="text-sm text-text-secondary mb-6">AI-generated quiz to boost your TriMind Score.</p>
            <button onClick={() => setIsQuizOpen(true)} className="bg-emerald text-surface font-bold text-sm px-8 py-3 rounded-lg shadow-sm hover:bg-emerald/90 transition-colors w-full">
              Start AI Quiz
            </button>
          </Card>
        </div>
      </section>

      {/* 6 AI Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* 1. Concept Mind Map */}
        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald"><Network className="w-5 h-5" /></div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Concept Mind Map</h3>
          </div>
          {mindMapData ? (
            <div className="flex-1 mb-3">
              <div className="flex flex-wrap gap-2 mb-2">
                {mindMapData.nodes?.map((n: any) => (
                  <span key={n.id} className={`px-2 py-1 rounded-md text-xs font-medium ${
                    n.type === 'root' ? 'bg-emerald/20 text-emerald' : n.type === 'subtopic' ? 'bg-violet/10 text-violet' : 'bg-elevated text-text-secondary'
                  }`}>{n.label}</span>
                ))}
              </div>
              <button onClick={() => setMindMapData(null)} className="text-xs text-text-tertiary hover:text-text-primary">Try another →</button>
            </div>
          ) : (
            <div className="flex gap-2 mt-auto">
              <input type="text" placeholder="Enter any topic..." value={mindMapTopic} onChange={e => setMindMapTopic(e.target.value)}
                className="flex-1 bg-primary-bg border border-border-default rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald" />
              <button onClick={handleMindMap} disabled={mindMapLoading}
                className="bg-text-primary text-surface px-3 py-2 rounded-lg text-sm font-medium hover:bg-text-primary/90 transition-colors disabled:opacity-50">
                {mindMapLoading ? '...' : '→'}
              </button>
            </div>
          )}
        </Card>

        {/* 2. Predict My Score */}
        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald"><Activity className="w-5 h-5" /></div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Predict My Score</h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {prediction
              ? <>Based on {prediction.based_on_sessions} session(s) — you'll score <span className="font-bold text-emerald font-mono">{prediction.score_low}–{prediction.score_high}</span> in {prediction.subject}.</>
              : <>Complete quizzes to get AI score predictions.</>
            }
          </p>
          <div className="h-1.5 w-full bg-border-default rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald rounded-full transition-all" style={{ width: prediction ? `${prediction.score_high}%` : '0%' }}></div>
          </div>
        </Card>

        {/* 3. Debate Mode */}
        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald"><Swords className="w-5 h-5" /></div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Debate Mode</h3>
          </div>
          {debateResult ? (
            <div className="flex-1 text-sm space-y-2">
              <p className="text-text-primary font-medium">Counter: <span className="font-normal text-text-secondary">{debateResult.counterargument}</span></p>
              <p className="text-violet font-medium text-xs">Follow-up: {debateResult.follow_up_question}</p>
              <button onClick={() => setDebateResult(null)} className="text-xs text-text-tertiary hover:text-text-primary">New debate →</button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-auto">
              <input type="text" placeholder="Topic..." value={debateTopic} onChange={e => setDebateTopic(e.target.value)}
                className="bg-primary-bg border border-border-default rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald" />
              <div className="flex gap-2">
                <input type="text" placeholder="Your argument..." value={debateArg} onChange={e => setDebateArg(e.target.value)}
                  className="flex-1 bg-primary-bg border border-border-default rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald" />
                <button onClick={handleDebate} disabled={debateLoading}
                  className="bg-emerald text-surface px-3 py-2 rounded-lg text-sm hover:bg-emerald/90 disabled:opacity-50">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* 4. Teach It Back */}
        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald"><GraduationCap className="w-5 h-5" /></div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Teach It Back</h3>
          </div>
          {teachResult ? (
            <div className="flex-1 text-sm space-y-2">
              <div className="flex items-center gap-2"><span className="font-bold text-emerald text-lg">{teachResult.grade}</span><span className="text-text-secondary">({teachResult.score}/100)</span></div>
              <p className="text-text-secondary text-xs">{teachResult.strengths?.join(' • ')}</p>
              {teachResult.gaps?.length > 0 && <p className="text-rose text-xs">Gaps: {teachResult.gaps.join(' • ')}</p>}
              <button onClick={() => setTeachResult(null)} className="text-xs text-text-tertiary hover:text-text-primary">Try another →</button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-auto">
              <input type="text" placeholder="Topic (e.g. Recursion)" value={teachTopic} onChange={e => setTeachTopic(e.target.value)}
                className="bg-primary-bg border border-border-default rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald" />
              <div className="flex gap-2">
                <input type="text" placeholder="Explain in your words..." value={teachExplanation} onChange={e => setTeachExplanation(e.target.value)}
                  className="flex-1 bg-primary-bg border border-border-default rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald" />
                <button onClick={handleTeachBack} disabled={teachLoading}
                  className="bg-emerald text-surface px-3 py-2 rounded-lg text-sm hover:bg-emerald/90 disabled:opacity-50">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* 5. Night Owl Insight */}
        <Card className="p-5 bg-surface border border-border-default hover:bg-elevated transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-violet/10 flex items-center justify-center text-violet"><Moon className="w-5 h-5" /></div>
            <h3 className="font-heading font-semibold text-[15px] text-text-primary">Night Owl Insight</h3>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            {nightOwl
              ? <>You study best <span className="font-bold text-violet">{nightOwl.best_window_label}</span>. Avg score: {nightOwl.avg_score_in_window}%</>
              : <>Complete more quizzes to unlock your peak study window.</>
            }
          </p>
          <p className="text-xs text-text-tertiary">{nightOwl?.recommendation}</p>
        </Card>

        {/* 6. Panic Mode */}
        <Card onClick={() => setIsQuizOpen(true)} className="p-5 bg-surface border-2 border-rose/30 hover:border-rose/60 transition-colors flex flex-col justify-between shadow-[0_0_15px_rgba(217,59,59,0.05)] cursor-pointer group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-rose/10 flex items-center justify-center text-rose group-hover:scale-110 transition-transform"><AlertTriangle className="w-5 h-5" /></div>
            <h3 className="font-heading font-bold text-lg text-rose">Panic Mode</h3>
          </div>
          <p className="text-sm text-text-secondary mb-4">Exam soon? Generate rapid-fire questions now.</p>
          <div className="mt-auto text-sm font-bold text-surface bg-rose py-2.5 rounded-lg text-center w-full shadow-[0_4px_10px_rgba(217,59,59,0.3)]">Activate Emergency Prep</div>
        </Card>
      </section>
    </div>
  );
}