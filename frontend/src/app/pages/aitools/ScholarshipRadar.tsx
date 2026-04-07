import React, { useState } from 'react';
import { Card } from "../../components/ui/card";
import { Loader2, ArrowLeft, GraduationCap, MapPin, Sparkles, Building2, CheckCircle2, IndianRupee } from "lucide-react";
import { Link } from "react-router";
import { requestScholarships } from "../../../lib/pythonApi";

export default function ScholarshipRadar() {
  const [cgpa, setCgpa] = useState("8.0");
  const [income, setIncome] = useState("5.0");
  const [category, setCategory] = useState("General");
  const [stateName, setStateName] = useState("Maharashtra");
  const [collegeType, setCollegeType] = useState("Government");
  const [course, setCourse] = useState("B.Tech");
  const [year, setYear] = useState("2");
  const [gender, setGender] = useState("Male");
  const [interests, setInterests] = useState("Technology, Research");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const intArr = interests.split(',').map(s=>s.trim()).filter(Boolean);

    try {
      const data = await requestScholarships({
        cgpa: parseFloat(cgpa),
        family_income_lpa: parseFloat(income),
        category,
        state: stateName,
        college_type: collegeType,
        course,
        year_of_study: parseInt(year),
        disabilities: false,
        gender,
        interests: intArr
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("AI matching failed. Check server connection.");
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
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary">Scholarship Radar</h1>
          <p className="text-text-secondary font-medium">Find real Indian scholarships based on your exact profile and demographics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Form Column */}
        <div className="lg:col-span-5">
           <Card className="p-6 bg-surface border border-border-default h-fit sticky top-6">
             <form onSubmit={handleSubmit} className="space-y-4">
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">CGPA</label>
                   <input type="number" step="0.1" value={cgpa} onChange={e=>setCgpa(e.target.value)} className="w-full bg-primary-bg rounded py-2 px-3 text-sm text-text-primary border border-border-default outline-none" required />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Family Income (LPA)</label>
                   <input type="number" step="0.1" value={income} onChange={e=>setIncome(e.target.value)} className="w-full bg-primary-bg rounded py-2 px-3 text-sm text-text-primary border border-border-default outline-none" required />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Category</label>
                   <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full bg-primary-bg rounded py-2 px-3 text-sm text-text-primary border border-border-default outline-none">
                     <option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>EWS</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Gender</label>
                   <select value={gender} onChange={e=>setGender(e.target.value)} className="w-full bg-primary-bg rounded py-2 px-3 text-sm text-text-primary border border-border-default outline-none">
                     <option>Male</option><option>Female</option><option>Other</option>
                   </select>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Home State</label>
                   <input type="text" value={stateName} onChange={e=>setStateName(e.target.value)} className="w-full bg-primary-bg rounded py-2 px-3 text-sm text-text-primary border border-border-default outline-none" required />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">College Type</label>
                   <select value={collegeType} onChange={e=>setCollegeType(e.target.value)} className="w-full bg-primary-bg rounded py-2 px-3 text-sm text-text-primary border border-border-default outline-none">
                     <option>Government</option><option>Private</option><option>Aided</option>
                   </select>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Course</label>
                   <input type="text" value={course} onChange={e=>setCourse(e.target.value)} className="w-full bg-primary-bg rounded py-2 px-3 text-sm text-text-primary border border-border-default outline-none" placeholder="e.g. B.Tech" required />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Year of Study</label>
                   <input type="number" value={year} onChange={e=>setYear(e.target.value)} className="w-full bg-primary-bg rounded py-2 px-3 text-sm text-text-primary border border-border-default outline-none" required />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Special Interests</label>
                 <input type="text" value={interests} onChange={e=>setInterests(e.target.value)} className="w-full bg-primary-bg rounded py-2 px-3 text-sm text-text-primary border border-border-default outline-none" placeholder="e.g. AI, Sports, Music" />
               </div>

               <button 
                 type="submit" 
                 disabled={isSubmitting}
                 className="w-full py-3 bg-emerald text-white rounded-lg font-bold hover:bg-emerald/90 transition-colors mt-6 disabled:opacity-50 flex justify-center items-center gap-2"
               >
                 {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Scanning...</> : <><Sparkles className="w-5 h-5" /> Find Scholarships</>}
               </button>
             </form>
           </Card>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {!result && !isSubmitting && (
            <div className="h-full min-h-[500px] rounded-xl border border-dashed border-border-default flex flex-col items-center justify-center text-text-tertiary p-8 text-center bg-surface/50">
              <MapPin className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-medium text-text-secondary">Radar is offline.</p>
              <p className="text-sm">Enter your demographic details to locate funding.</p>
            </div>
          )}

          {isSubmitting && (
            <div className="h-full min-h-[500px] rounded-xl border border-border-default flex flex-col items-center justify-center text-text-secondary p-8 text-center bg-surface animate-pulse">
              <Loader2 className="w-12 h-12 mb-4 text-emerald animate-spin" />
              <p className="font-bold text-lg">Searching databases...</p>
              <p className="text-sm">Matching your profile against central and state schemas.</p>
            </div>
          )}

          {result && !isSubmitting && (
            <>
              {/* Top Banner */}
              <Card className="p-6 bg-gradient-to-r from-emerald/20 to-primary-bg border border-emerald/30 flex items-center justify-between">
                 <div>
                    <h2 className="text-text-primary font-bold text-lg mb-1">Total Potential Funding</h2>
                    <p className="text-sm text-text-secondary">If you apply and secure these matches.</p>
                 </div>
                 <div className="text-right">
                    <span className="font-display text-3xl font-bold text-emerald">{result.total_potential_amount}</span>
                 </div>
              </Card>

              {/* Priority Action */}
              {result.priority_apply?.length > 0 && (
                <Card className="p-4 bg-saffron/10 border border-saffron/30">
                   <h4 className="font-bold text-saffron text-xs uppercase tracking-wider mb-2">High Priority Matches</h4>
                   <div className="flex gap-2 flex-wrap">
                     {result.priority_apply.map((p: string, i: number) => (
                        <span key={i} className="bg-saffron text-white text-xs px-2 py-1 rounded font-bold">{p}</span>
                     ))}
                   </div>
                </Card>
              )}

              <h3 className="font-heading font-bold text-lg text-text-primary mt-2">Available Scholarships ({result.scholarships?.length})</h3>

              {/* ScholarCards */}
              <div className="space-y-4">
                 {result.scholarships?.map((sch: any, i: number) => (
                    <Card key={i} className="p-5 bg-surface border border-border-default hover:border-emerald/50 transition-colors">
                       <div className="flex justify-between items-start mb-3">
                          <div>
                             <h4 className="font-bold text-text-primary text-base leading-tight mb-1">{sch.name}</h4>
                             <p className="text-xs text-text-secondary flex items-center gap-1"><Building2 className="w-3 h-3"/> {sch.provider}</p>
                          </div>
                          <div className="text-right shrink-0">
                             <span className="bg-emerald/10 text-emerald font-bold px-2 py-1 rounded text-xs block mb-1">{sch.amount_per_year}</span>
                             <span className="text-[10px] text-text-tertiary">Match: <strong className="text-text-primary">{sch.eligibility_match}</strong></span>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 my-4 p-3 bg-primary-bg rounded-lg border border-border-default">
                          <div>
                             <span className="block text-[10px] uppercase font-bold text-text-tertiary mb-1">Deadline</span>
                             <span className="text-xs font-medium text-rose">{sch.deadline}</span>
                          </div>
                          <div>
                             <span className="block text-[10px] uppercase font-bold text-text-tertiary mb-1">Apply Via</span>
                             <span className="text-xs font-medium text-text-secondary">{sch.apply_link_type}</span>
                          </div>
                       </div>

                       <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-text-tertiary">Requirements to Check</span>
                          {sch.requirements?.map((req: string, j: number) => (
                             <div key={j} className="flex items-start gap-2 text-xs text-text-secondary">
                                <CheckCircle2 className="w-3 h-3 text-emerald mt-0.5 shrink-0" />
                                <span>{req}</span>
                             </div>
                          ))}
                       </div>
                    </Card>
                 ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
