import React, { useState } from 'react';
import { Card } from "../../components/ui/card";
import { Loader2, Flame, ArrowLeft, Target, AlertTriangle, Lightbulb } from "lucide-react";
import { Link } from "react-router";
import { requestRoastResume } from "../../../lib/pythonApi";

// Response Types based on API
// { overall_roast: string; roast_score: number; roast_items: {section, roast, actionable_fix, severity}[]; what_works: string[]; priority_fixes: string[]; final_verdict: string; }

export default function RoastResume() {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [intensity, setIntensity] = useState("savage");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const data = await requestRoastResume(resumeText, targetRole, intensity);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("AI Roast failed. Check the server connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <Link to="/tools" className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-rose/10 text-rose shrink-0">
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary">Roast My Resume</h1>
          <p className="text-text-secondary font-medium">Savage, actionable AI feedback to fix your flaws.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card className="p-6 bg-surface border border-border-default">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Target Role</label>
              <input 
                type="text" 
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full bg-primary-bg rounded-lg p-3 text-text-primary border border-border-default focus:border-violet focus:ring-1 focus:ring-violet outline-none transition-all placeholder:text-text-tertiary"
                placeholder="e.g. SDE at Google, Frontend Developer"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Roast Level</label>
              <select 
                value={intensity}
                onChange={e => setIntensity(e.target.value)}
                className="w-full bg-primary-bg rounded-lg p-3 text-text-primary border border-border-default focus:border-violet focus:ring-1 focus:ring-violet outline-none transition-all"
              >
                <option value="light">Mild & Constructive</option>
                <option value="medium">Sharp & Witty</option>
                <option value="savage">Absolutely Savage 🔥</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Paste Resume Text</label>
              <textarea 
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                className="w-full bg-primary-bg rounded-lg p-3 text-text-primary border border-border-default focus:border-violet focus:ring-1 focus:ring-violet outline-none transition-all resize-none min-h-[300px]"
                placeholder="Paste the raw text of your resume here..."
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !resumeText.trim()}
              className="w-full py-3.5 bg-rose text-white rounded-lg font-bold hover:bg-rose/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Roasting...</> : <><Flame className="w-5 h-5" /> Start Roast</>}
            </button>
          </form>
        </Card>

        {/* Output Panel */}
        <div className="flex flex-col gap-6">
          {!result && !isSubmitting && (
            <div className="h-full min-h-[300px] rounded-xl border border-dashed border-border-default flex flex-col items-center justify-center text-text-tertiary p-8 text-center bg-surface/50">
              <Target className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-medium text-text-secondary">Waiting to roast...</p>
              <p className="text-sm">Submit your resume to see your score and feedback.</p>
            </div>
          )}

          {isSubmitting && (
            <div className="h-full min-h-[300px] rounded-xl border border-border-default flex flex-col items-center justify-center text-text-secondary p-8 text-center bg-surface animate-pulse">
              <Loader2 className="w-12 h-12 mb-4 text-rose animate-spin" />
              <p className="font-bold text-lg">AI is reading your resume...</p>
              <p className="text-sm">Preparing savage commentary.</p>
            </div>
          )}

          {result && !isSubmitting && (
            <>
              {/* Score Card */}
              <Card className="p-6 bg-gradient-to-br from-[#1E1624] to-[#120F16] border border-rose/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20"><Flame className="w-32 h-32 text-rose" /></div>
                <h2 className="text-rose font-mono text-sm tracking-widest uppercase mb-1">Cringe Score</h2>
                <div className="font-display text-6xl text-white font-bold mb-4">{result.roast_score}<span className="text-2xl text-white/50">/100</span></div>
                <p className="text-white/80 font-serif italic text-lg leading-relaxed relative z-10 border-l-4 border-rose pl-4 py-1">"{result.overall_roast}"</p>
              </Card>

              {/* Actionable Roasts */}
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-lg text-text-primary px-1">Specific Flaws</h3>
                {result.roast_items?.map((item: any, i: number) => (
                  <Card key={i} className="p-5 bg-surface border-l-4 border-l-rose border-y border-y-border-default border-r border-r-border-default relative overflow-hidden">
                    <div className="flex items-start justify-between mb-3">
                      <span className="bg-rose/10 text-rose font-bold uppercase text-[10px] px-2 py-1 rounded tracking-wider">{item.section}</span>
                      <span className="text-text-tertiary text-xs uppercase tracking-wider font-bold">Severity: {item.severity}</span>
                    </div>
                    <p className="text-text-primary font-medium mb-3">"{item.roast}"</p>
                    <div className="bg-emerald/10 p-3 rounded-lg border border-emerald/20 flex gap-2 items-start mt-2">
                       <Lightbulb className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                       <p className="text-sm text-text-secondary"><strong className="text-emerald">Fix:</strong> {item.actionable_fix}</p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Priority & Strengths */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-surface border border-border-default">
                  <h4 className="font-bold text-emerald text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><Target className="w-4 h-4"/> What Works</h4>
                  <ul className="space-y-2 text-sm text-text-secondary list-disc pl-4">
                    {result.what_works?.map((w: string, i: number) => <li key={i}>{w}</li>)}
                  </ul>
                </Card>
                <Card className="p-4 bg-surface border border-border-default">
                  <h4 className="font-bold text-rose text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> DO THIS NOW</h4>
                  <ul className="space-y-2 text-sm text-text-secondary list-decimal pl-4">
                    {result.priority_fixes?.map((w: string, i: number) => <li key={i}>{w}</li>)}
                  </ul>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
