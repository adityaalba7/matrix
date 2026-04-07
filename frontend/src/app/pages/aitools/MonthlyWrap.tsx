import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Card } from "../../components/ui/card";
import { Loader2, ArrowLeft, CalendarDays, Sparkles, Share2, Download, Music, Flame } from "lucide-react";
import { Link } from "react-router";
import { requestMonthlyWrap } from "../../../lib/pythonApi";

export default function MonthlyWrap() {
  const [month, setMonth] = useState("April 2026");
  const [hours, setHours] = useState("45");
  const [subjects, setSubjects] = useState("DSA, OS, Networking");
  const [quizzesTaken, setQuizzesTaken] = useState("12");
  const [quizzesPassed, setQuizzesPassed] = useState("10");
  const [streak, setStreak] = useState("14");
  
  const wrapRef = useRef<HTMLDivElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const subArr = subjects.split(',').map(s=>s.trim()).filter(Boolean);

    try {
      const data = await requestMonthlyWrap({
        month,
        subjects_studied: subArr,
        total_study_hours: parseFloat(hours),
        quizzes_taken: parseInt(quizzesTaken),
        quizzes_passed: parseInt(quizzesPassed),
        flashcards_reviewed: 154,
        streak_days: parseInt(streak),
        goals_set: ["Master Trees", "Build Project"],
        goals_achieved: ["Master Trees"],
        mood_entries: []
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("AI Generation failed. Check server connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (!wrapRef.current) return;
    try {
      const canvas = await html2canvas(wrapRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `TriMind_Wrap_${month.replace(/\s+/g, '_')}.png`;
      link.href = image;
      link.click();
    } catch (err: any) {
      console.error("Download failed", err);
      alert("Failed to download: " + (err.message || err.toString()));
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <Link to="/tools" className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-violet/10 text-violet shrink-0">
          <CalendarDays className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary">Monthly Wrap</h1>
          <p className="text-text-secondary font-medium">Generate a Spotify-style recap of your learning journey to share with friends.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Form Column */}
        <Card className="p-6 bg-surface border border-border-default h-fit">
           <form onSubmit={handleSubmit} className="space-y-4">
             
             <div>
               <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Target Month</label>
               <input type="text" value={month} onChange={e=>setMonth(e.target.value)} className="w-full bg-primary-bg rounded-lg py-2.5 px-3 text-sm text-text-primary border border-border-default outline-none" required />
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Study Hours</label>
                   <input type="number" value={hours} onChange={e=>setHours(e.target.value)} className="w-full bg-primary-bg rounded-lg py-2.5 px-3 text-sm text-text-primary border border-border-default outline-none" required />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Longest Streak</label>
                   <input type="number" value={streak} onChange={e=>setStreak(e.target.value)} className="w-full bg-primary-bg rounded-lg py-2.5 px-3 text-sm text-text-primary border border-border-default outline-none" required />
                 </div>
             </div>

             <div>
               <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Subjects Studied</label>
               <input type="text" value={subjects} onChange={e=>setSubjects(e.target.value)} className="w-full bg-primary-bg rounded-lg py-2.5 px-3 text-sm text-text-primary border border-border-default outline-none" placeholder="e.g. Algorithms, DBMS" required />
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Quizzes Taken</label>
                   <input type="number" value={quizzesTaken} onChange={e=>setQuizzesTaken(e.target.value)} className="w-full bg-primary-bg rounded-lg py-2.5 px-3 text-sm text-text-primary border border-border-default outline-none" required />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Quizzes Passed</label>
                   <input type="number" value={quizzesPassed} onChange={e=>setQuizzesPassed(e.target.value)} className="w-full bg-primary-bg rounded-lg py-2.5 px-3 text-sm text-text-primary border border-border-default outline-none" required />
                 </div>
             </div>

             <button 
               type="submit" 
               disabled={isSubmitting}
               className="w-full py-3 bg-violet text-white rounded-lg font-bold hover:bg-violet/90 transition-colors mt-4 disabled:opacity-50 flex justify-center items-center gap-2"
             >
               {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating Vibe...</> : <><Sparkles className="w-5 h-5" /> Create Monthly Wrap</>}
             </button>
           </form>
        </Card>

        {/* Output Column */}
        <div className="flex flex-col gap-4 items-center">
          {!result && !isSubmitting && (
            <div className="w-full min-h-[400px] rounded-xl border border-dashed border-border-default flex flex-col items-center justify-center text-text-tertiary p-8 text-center bg-surface/50">
              <Music className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-medium text-text-secondary">Ready to drop your mix.</p>
              <p className="text-sm">Submit your stats to generate your custom card.</p>
            </div>
          )}

          {isSubmitting && (
            <div className="w-full min-h-[400px] rounded-xl border border-border-default flex flex-col items-center justify-center text-text-secondary p-8 text-center bg-surface animate-pulse">
              <Loader2 className="w-12 h-12 mb-4 text-violet animate-spin" />
              <p className="font-bold text-lg">Curating your timeline...</p>
              <p className="text-sm">Writing the perfect headline.</p>
            </div>
          )}

          {result && !isSubmitting && (
            <div className="w-full flex flex-col">
              {/* The Wrap Story Card */}
              <div 
                ref={wrapRef}
                className="w-full rounded-2xl p-6 relative overflow-hidden flex flex-col gap-6 shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #1A0B2E 0%, #7c3aed 40%, #10b981 100%)' }}
              >
                {/* Background Blurs via Radial Gradient (html2canvas safe) */}
                <div className="absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.4) 0%, rgba(244,63,94,0) 70%)' }}></div>
                <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(16,185,129,0) 70%)' }}></div>

                {/* Header */}
                <div className="relative z-10 flex justify-between items-start">
                  <h3 className="font-bold leading-none tracking-tighter text-2xl" style={{ fontFamily: 'Inter, sans-serif', color: '#ffffff' }}>
                    TRIMIND<br/>WRAP
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded" style={{ color: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.1)' }}>{month}</span>
                </div>

                {/* Headline */}
                <div className="relative z-10">
                  <p className="text-lg font-medium italic leading-snug" style={{ color: '#f59e0b' }}>
                    "{result.headline}"
                  </p>
                </div>

                {/* Big Stat */}
                <div className="relative z-10 flex items-end gap-4">
                  <div>
                    <div className="font-bold text-5xl tracking-tighter leading-none" style={{ fontFamily: 'Inter, sans-serif', color: '#ffffff' }}>
                      {result.shareable_summary?.hours || hours}h
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Total Time Studied</p>
                  </div>
                  <div className="flex items-center gap-3 border p-3 rounded-xl ml-auto" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}>
                    <Flame className="w-6 h-6 shrink-0" style={{ color: '#f43f5e' }} />
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>Top Streak</div>
                      <div className="font-bold text-lg" style={{ color: '#ffffff' }}>{result.shareable_summary?.streak || streak} Days</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="relative z-10 pt-4 border-t flex justify-between items-end" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest block mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Your Vibe</span>
                    <span className="font-bold text-sm" style={{ color: '#ffffff' }}>{result.shareable_summary?.personality || result.study_personality}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-widest block mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Top Subject</span>
                    <span className="font-bold text-sm px-2 py-0.5 rounded" style={{ color: '#10b981', background: 'rgba(16,185,129,0.15)' }}>
                      {result.shareable_summary?.top_subject}
                    </span>
                  </div>
                </div>

                {/* Branding */}
                <div className="relative z-10 flex justify-between items-center">
                  <div className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm" style={{ backgroundColor: '#ffffff', color: '#000000' }}>TriMind AI</div>
                  <div className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>@trimind_ai</div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 w-full mt-4">
                <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 bg-surface border border-border-default text-text-primary font-semibold py-2.5 rounded-lg text-xs hover:bg-elevated transition-colors shadow-sm">
                  <Download className="w-4 h-4" /> Download IG Story
                </button>
                <button onClick={async () => {
                  try {
                    if (!wrapRef.current) return;
                    const canvas = await html2canvas(wrapRef.current, { scale: 2, useCORS: true, backgroundColor: null });
                    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
                    if (blob && navigator.share) {
                      const file = new File([blob], 'trimind-wrap.png', { type: 'image/png' });
                      await navigator.share({
                        title: 'My TriMind Wrap',
                        text: 'Check out my monthly study stats on TriMind!',
                        files: [file]
                      });
                    } else if (blob && navigator.clipboard) {
                       await navigator.clipboard.write([
                         new ClipboardItem({ 'image/png': blob })
                       ]);
                       alert("Image copied to clipboard! You can paste and share it anywhere.");
                    } else {
                       alert("Sharing isn't fully supported on this browser. Use the Download button instead!");
                    }
                  } catch (err) {
                    console.error("Share failed", err);
                  }
                }} className="flex-1 flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-lg text-xs transition-colors shadow-sm" style={{ background: '#25D366' }}>
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>

              {/* Stats Story Text Below */}
              {result.stats_story && (
                <Card className="p-5 bg-surface border border-border-default mt-4">
                  <h4 className="font-bold text-text-primary text-sm uppercase tracking-wider mb-2">Your Story</h4>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{result.stats_story}</p>
                </Card>
              )}

              {result.next_month_goals?.length > 0 && (
                <Card className="p-5 bg-surface border border-border-default mt-3">
                  <h4 className="font-bold text-violet text-sm uppercase tracking-wider mb-2">Goals for Next Month</h4>
                  <ul className="space-y-2">
                    {result.next_month_goals.map((g: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="w-5 h-5 rounded-full bg-violet/10 text-violet flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">{i+1}</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
