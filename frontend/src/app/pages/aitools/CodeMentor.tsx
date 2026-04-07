import React, { useState } from 'react';
import { Card } from "../../components/ui/card";
import { Loader2, ArrowLeft, Code2, Bug, CheckCircle2, Terminal } from "lucide-react";
import { Link } from "react-router";
import { requestCodeMentor } from "../../../lib/pythonApi";

export default function CodeMentor() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [errorMsg, setErrorMsg] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const data = await requestCodeMentor(code, language, errorMsg);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("AI Mentoring failed. Check the server connection.");
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
          <Code2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary">Code Mentor</h1>
          <p className="text-text-secondary font-medium">Don't just fix errors—understand them.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card className="p-6 bg-surface border border-border-default h-fit">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-text-secondary uppercase tracking-wide">Language</label>
              <select 
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="bg-primary-bg rounded py-1 px-3 text-sm text-text-primary border border-border-default focus:border-violet focus:ring-1 focus:ring-violet outline-none transition-all"
              >
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
              </select>
            </div>

            <div>
              <div className="relative rounded-lg overflow-hidden border border-border-default focus-within:border-violet focus-within:ring-1 focus-within:ring-violet transition-all">
                <div className="flex items-center justify-between px-3 py-2 bg-primary-bg/50 border-b border-border-default">
                  <span className="text-xs font-mono text-text-tertiary">source.{language.toLowerCase()}</span>
                </div>
                <textarea 
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full bg-[#1e1e1e] p-4 text-white font-mono text-sm outline-none resize-none min-h-[250px]"
                  placeholder={`// Paste your broken code here...`}
                  spellCheck="false"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Error Message (Optional)</label>
              <textarea 
                value={errorMsg}
                onChange={e => setErrorMsg(e.target.value)}
                className="w-full bg-primary-bg rounded-lg p-3 border border-border-default focus:border-violet focus:ring-1 focus:ring-violet outline-none transition-all resize-none min-h-[80px] font-mono text-xs text-rose"
                placeholder="Paste the console error output if any..."
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !code.trim()}
              className="w-full py-3.5 bg-violet text-white rounded-lg font-bold hover:bg-violet/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Terminal className="w-5 h-5" /> Debug & Explain</>}
            </button>
          </form>
        </Card>

        {/* Output Panel */}
        <div className="flex flex-col gap-4">
          {!result && !isSubmitting && (
            <div className="h-full min-h-[300px] rounded-xl border border-dashed border-border-default flex flex-col items-center justify-center text-text-tertiary p-8 text-center bg-surface/50">
              <Bug className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-medium text-text-secondary">Waiting for code...</p>
              <p className="text-sm">Submit your snippet to get a detailed breakdown.</p>
            </div>
          )}

          {isSubmitting && (
            <div className="h-full min-h-[300px] rounded-xl border border-border-default flex flex-col items-center justify-center text-text-secondary p-8 text-center bg-surface animate-pulse">
              <Loader2 className="w-12 h-12 mb-4 text-violet animate-spin" />
              <p className="font-bold text-lg">Running diagnostics...</p>
              <p className="text-sm">Finding bugs and preparing the lesson.</p>
            </div>
          )}

          {result && !isSubmitting && (
            <>
              {/* Problem Explanation */}
              <Card className="p-5 bg-surface border-l-4 border-l-rose border-y border-y-border-default border-r border-r-border-default">
                  <h4 className="font-bold text-rose text-sm uppercase tracking-wider mb-2 flex items-center gap-2"><Bug className="w-4 h-4"/> The Problem</h4>
                  <p className="text-sm text-text-primary leading-relaxed">{result.problem_explanation}</p>
              </Card>

              {/* Fixed Code Viewer */}
              <Card className="bg-[#1e1e1e] border border-border-default overflow-hidden rounded-xl">
                 <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/20">
                    <div className="flex gap-2 items-center">
                       <CheckCircle2 className="w-4 h-4 text-emerald" />
                       <span className="text-xs font-mono text-white/50 uppercase font-bold tracking-wider">The Pro Fix</span>
                    </div>
                 </div>
                 <div className="p-4 overflow-x-auto">
                    <pre className="text-sm font-mono text-emerald/90 whitespace-pre-wrap leading-tight">
                        {result.fixed_code}
                    </pre>
                 </div>
              </Card>

              {/* The Lesson */}
              <Card className="p-5 bg-surface border border-border-default">
                  <h4 className="font-bold text-violet text-sm uppercase tracking-wider mb-2 flex items-center gap-2">🎓 The Lesson</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{result.lesson}</p>
              </Card>

              {/* Clean Code Tip */}
              <Card className="p-4 bg-emerald/10 border border-emerald/20 text-emerald rounded-xl">
                  <span className="font-bold uppercase tracking-wider text-[10px] mb-1 block opacity-80">Clean Code Tip</span>
                  <p className="font-medium text-sm leading-relaxed">{result.clean_code_tip}</p>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
