import React, { useState } from 'react';
import { Card } from "../../components/ui/card";
import { Loader2, ArrowLeft, Target, IndianRupee, Landmark, TrendingUp } from "lucide-react";
import { Link } from "react-router";
import { requestCGPAEstimate } from "../../../lib/pythonApi";

export default function CGPAEstimator() {
  const [cgpa, setCgpa] = useState("8.0");
  const [tier, setTier] = useState("Tier 2");
  const [branch, setBranch] = useState("Computer Science");
  const [year, setYear] = useState("2026");
  const [skillsStr, setSkillsStr] = useState("React, Python, Node.js");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const skillsArray = skillsStr.split(",").map(s => s.trim()).filter(Boolean);

    try {
      const data = await requestCGPAEstimate(parseFloat(cgpa), tier, branch, parseInt(year), skillsArray);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("AI estimation failed. Check the server connection.");
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
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald/10 text-emerald shrink-0">
          <IndianRupee className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary">CGPA to Package Estimator</h1>
          <p className="text-text-secondary font-medium">Get a realistic projection of your placement package.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card className="p-6 bg-surface border border-border-default h-fit">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">CGPA</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={e => setCgpa(e.target.value)}
                  className="w-full bg-primary-bg rounded-lg p-3 text-text-primary border border-border-default focus:border-violet focus:ring-1 focus:ring-violet outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Graduation Year</label>
                <input 
                  type="number"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="w-full bg-primary-bg rounded-lg p-3 text-text-primary border border-border-default focus:border-violet focus:ring-1 focus:ring-violet outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">College Tier</label>
                <select 
                  value={tier}
                  onChange={e => setTier(e.target.value)}
                  className="w-full bg-primary-bg rounded-lg p-3 text-text-primary border border-border-default focus:border-violet focus:ring-1 focus:ring-violet outline-none transition-all"
                >
                  <option value="Tier 1 (IIT/NIT/BITS)">Tier 1 (IIT/NIT/BITS)</option>
                  <option value="Tier 2">Tier 2</option>
                  <option value="Tier 3">Tier 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Branch</label>
                <input 
                  type="text" 
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  className="w-full bg-primary-bg rounded-lg p-3 text-text-primary border border-border-default focus:border-violet focus:ring-1 focus:ring-violet outline-none transition-all"
                  placeholder="e.g. CSE, ECE"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Top Skills (Comma Separated)</label>
              <textarea 
                value={skillsStr}
                onChange={e => setSkillsStr(e.target.value)}
                className="w-full bg-primary-bg rounded-lg p-3 text-text-primary border border-border-default focus:border-violet focus:ring-1 focus:ring-violet outline-none transition-all resize-none min-h-[100px]"
                placeholder="Python, React, AWS, Docker..."
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3.5 bg-emerald text-white rounded-lg font-bold hover:bg-emerald/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Estimating...</> : <><TrendingUp className="w-5 h-5" /> Calculate Estimate</>}
            </button>
          </form>
        </Card>

        {/* Output Panel */}
        <div className="flex flex-col gap-6">
          {!result && !isSubmitting && (
            <div className="h-full min-h-[300px] rounded-xl border border-dashed border-border-default flex flex-col items-center justify-center text-text-tertiary p-8 text-center bg-surface/50">
              <Landmark className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-medium text-text-secondary">Awaiting inputs...</p>
              <p className="text-sm">Submit your profile to see your market worth.</p>
            </div>
          )}

          {isSubmitting && (
            <div className="h-full min-h-[300px] rounded-xl border border-border-default flex flex-col items-center justify-center text-text-secondary p-8 text-center bg-surface animate-pulse">
              <Loader2 className="w-12 h-12 mb-4 text-emerald animate-spin" />
              <p className="font-bold text-lg">Analyzing market trends...</p>
              <p className="text-sm">Cross-referencing your profile with recent campus data.</p>
            </div>
          )}

          {result && !isSubmitting && (
            <>
              {/* Range Card */}
              <Card className="p-6 bg-gradient-to-br from-emerald/10 to-primary-bg border border-emerald/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><IndianRupee className="w-32 h-32 text-emerald" /></div>
                <h2 className="text-emerald font-mono text-sm tracking-widest uppercase mb-4">Estimated Range</h2>
                
                <div className="flex items-end gap-2 mb-2">
                  <span className="font-display text-5xl text-text-primary font-bold">{result.likely_package_range?.expected_lpa || result.likely_package_range?.max_lpa}</span>
                  <span className="text-2xl text-text-secondary mb-1">LPA</span>
                </div>
                <p className="text-sm text-text-secondary font-medium">
                  Min: <span className="text-text-primary">{result.likely_package_range?.min_lpa} LPA</span> • 
                  Max: <span className="text-text-primary">{result.likely_package_range?.max_lpa} LPA</span>
                </p>
              </Card>
              
              <Card className="bg-surface border border-border-default p-4">
                  <p className="text-sm text-text-primary italic leading-relaxed border-l-2 border-emerald pl-3">"{result.honest_assessment}"</p>
              </Card>

              {/* Roles Breakdown */}
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-base text-text-primary px-1">Expected Salary by Role</h3>
                {result.salary_by_role?.map((role: any, i: number) => (
                  <Card key={i} className="p-4 bg-surface border border-border-default flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-text-primary">{role.role}</h4>
                      <p className="text-xs text-text-secondary mt-1">Targets: {role.companies?.join(", ")}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-emerald font-bold">{role.median_lpa} LPA</div>
                      <div className="text-[10px] text-text-tertiary">Range: {role.min_lpa}-{role.max_lpa} LPA</div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Improvement Tips */}
              <Card className="p-5 bg-surface border border-border-default">
                  <h4 className="font-bold text-saffron text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><Target className="w-4 h-4"/> How to Maximize This</h4>
                  <ul className="space-y-2 text-sm text-text-secondary list-disc pl-4">
                    {result.improvement_tips?.map((tip: string, i: number) => <li key={i}>{tip}</li>)}
                  </ul>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
