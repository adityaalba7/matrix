import React, { useState } from 'react';
import { Card } from "../../components/ui/card";
import { Loader2, ArrowLeft, Briefcase, Map, Crosshair, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "react-router";
import { requestResumeGap } from "../../../lib/pythonApi";

export default function ResumeGap() {
  const [resumeText, setResumeText] = useState("");
  const [targetCompany, setTargetCompany] = useState("Google");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const data = await requestResumeGap(resumeText, targetCompany, targetRole);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("AI Analysis failed. Check the server connection.");
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
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-violet/10 text-violet shrink-0">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary">Resume Gap Detector</h1>
          <p className="text-text-secondary font-medium">Compare your resume to top tier companies and get a 30-day roadmap to fix the gaps.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Card */}
        <div className="lg:col-span-5">
           <Card className="p-6 bg-surface border border-border-default h-fit sticky top-6">
             <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                 <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Target Company</label>
                 <input 
                   type="text" 
                   value={targetCompany}
                   onChange={e => setTargetCompany(e.target.value)}
                   className="w-full bg-primary-bg rounded-lg p-3 text-text-primary border border-border-default focus:border-violet focus:ring-1 focus:ring-violet outline-none transition-all"
                   placeholder="e.g. Google, Microsoft, Stripe"
                   required
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Target Role</label>
                 <input 
                   type="text" 
                   value={targetRole}
                   onChange={e => setTargetRole(e.target.value)}
                   className="w-full bg-primary-bg rounded-lg p-3 text-text-primary border border-border-default focus:border-violet focus:ring-1 focus:ring-violet outline-none transition-all"
                   placeholder="e.g. SDE II, Frontend Engineer"
                   required
                 />
               </div>

               <div>
                 <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Paste Resume Raw Text</label>
                 <textarea 
                   value={resumeText}
                   onChange={e => setResumeText(e.target.value)}
                   className="w-full bg-primary-bg rounded-lg p-3 text-text-primary border border-border-default focus:border-violet focus:ring-1 focus:ring-violet outline-none transition-all resize-none min-h-[300px]"
                   placeholder="Paste the text from your PDF here..."
                   required
                 />
               </div>

               <button 
                 type="submit" 
                 disabled={isSubmitting || !resumeText.trim()}
                 className="w-full py-3.5 bg-violet text-white rounded-lg font-bold hover:bg-violet/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
               >
                 {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Gap...</> : <><Crosshair className="w-5 h-5" /> Detect Gaps</>}
               </button>
             </form>
           </Card>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {!result && !isSubmitting && (
            <div className="h-full min-h-[400px] rounded-xl border border-dashed border-border-default flex flex-col items-center justify-center text-text-tertiary p-8 text-center bg-surface/50">
              <Map className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-medium text-text-secondary">Ready to map your career.</p>
              <p className="text-sm">Submit your target to see what's missing.</p>
            </div>
          )}

          {isSubmitting && (
            <div className="h-full min-h-[400px] rounded-xl border border-border-default flex flex-col items-center justify-center text-text-secondary p-8 text-center bg-surface animate-pulse">
              <Loader2 className="w-12 h-12 mb-4 text-violet animate-spin" />
              <p className="font-bold text-lg">Cross-referencing requirements...</p>
              <p className="text-sm">Building your custom 30-day roadmap.</p>
            </div>
          )}

          {result && !isSubmitting && (
            <>
              {/* Score & Summary */}
              <Card className="p-6 bg-gradient-to-br from-violet/20 to-primary-bg border border-violet/30 flex items-start gap-6">
                 <div className="shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 border-violet relative">
                    <span className="font-display font-bold text-3xl text-text-primary">{result.match_score}%</span>
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider absolute -bottom-2 bg-primary-bg px-2">Match</span>
                 </div>
                 <div>
                    <h3 className="font-bold text-text-primary text-lg mb-2">Verdict</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{result.summary}</p>
                 </div>
              </Card>

              {/* The Gaps */}
              <div>
                 <h3 className="font-heading font-bold text-lg text-text-primary mb-3">Critical Gaps</h3>
                 <div className="space-y-3">
                    {result.gaps?.map((gap: any, i: number) => (
                       <Card key={i} className="p-4 bg-surface border-l-4 border-l-rose border-y border-y-border-default border-r border-r-border-default">
                          <div className="flex justify-between items-start mb-2">
                             <div className="font-bold text-text-primary text-base">{gap.skill}</div>
                             <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded tracking-wider
                                ${gap.priority === 'high' ? 'bg-rose/10 text-rose' : 'bg-saffron/10 text-saffron'}
                             `}>Priority: {gap.priority}</span>
                          </div>
                          <p className="text-sm text-text-secondary"><strong className="text-rose">Fix:</strong> {gap.how_to_fill}</p>
                       </Card>
                    ))}
                 </div>
              </div>

              {/* Day-by-Day Roadmap */}
              <div>
                 <h3 className="font-heading font-bold text-lg text-text-primary mb-3 mt-4 flex items-center gap-2"><Map className="w-5 h-5 text-violet"/> 30-Day Action Plan</h3>
                 <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-default before:to-transparent">
                    {result.roadmap?.map((rm: any, i: number) => (
                       <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border-default bg-surface text-text-tertiary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                             <TrendingUp className="w-4 h-4 text-violet" />
                          </div>
                          <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 bg-surface border border-border-default hover:border-violet/50 transition-colors">
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold font-mono text-violet bg-violet/10 px-2 py-1 rounded">{rm.day}</span>
                             </div>
                             <p className="text-sm text-text-primary font-medium mb-2">{rm.task}</p>
                             <p className="text-[11px] text-text-tertiary">Resource: {rm.resource}</p>
                          </Card>
                       </div>
                    ))}
                 </div>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}
