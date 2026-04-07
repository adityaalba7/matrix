import React, { useState } from 'react';
import { Card } from "../../components/ui/card";
import { Loader2, ArrowLeft, FileText, Upload, BrainCircuit, Type } from "lucide-react";
import { Link } from "react-router";
import { requestSmartNotesPdf, requestSmartNotesText } from "../../../lib/pythonApi";

export default function SmartNotes() {
  const [inputType, setInputType] = useState<"text" | "pdf">("pdf");
  
  // Inputs
  const [text, setText] = useState("");
  const [subject, setSubject] = useState("General");
  const [file, setFile] = useState<File | null>(null);

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeCard, setActiveCard] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputType === "text" && !text.trim()) return;
    if (inputType === "pdf" && !file) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      if (inputType === "pdf") {
        const data = await requestSmartNotesPdf(file!, subject);
        setResult(data);
      } else {
        const data = await requestSmartNotesText(text, subject);
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      alert("AI Notes parsing failed. Check the server connection.");
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
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary">Smart Notes Summarizer</h1>
          <p className="text-text-secondary font-medium">Upload a PDF or paste text to get a 1-page summary and flashcards.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card className="p-6 bg-surface border border-border-default h-fit">
          <div className="flex bg-primary-bg rounded-lg p-1 mb-6 border border-border-default">
            <button 
              className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-colors ${inputType === "pdf" ? "bg-surface shadow text-emerald" : "text-text-tertiary"}`}
              onClick={() => setInputType("pdf")}
            >
              <Upload className="w-4 h-4" /> PDF Upload
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-colors ${inputType === "text" ? "bg-surface shadow text-emerald" : "text-text-tertiary"}`}
              onClick={() => setInputType("text")}
            >
              <Type className="w-4 h-4" /> Paste Text
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Subject / Topic Focus</label>
              <input 
                type="text" 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full bg-primary-bg rounded-lg p-3 text-text-primary border border-border-default focus:border-violet focus:ring-1 focus:ring-violet outline-none transition-all"
                placeholder="e.g. Operating Systems, Quantum Physics"
              />
            </div>

            {inputType === "text" ? (
              <div>
                 <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Raw Notes</label>
                 <textarea 
                   value={text}
                   onChange={e => setText(e.target.value)}
                   className="w-full bg-primary-bg rounded-lg p-3 text-text-primary border border-border-default focus:border-violet focus:ring-1 focus:ring-violet outline-none transition-all resize-none min-h-[250px]"
                   placeholder="Paste your chaotic raw notes here..."
                   required={inputType === "text"}
                 />
              </div>
            ) : (
              <div className="border-2 border-dashed border-border-default rounded-xl p-8 text-center flex flex-col items-center justify-center bg-primary-bg hover:bg-elevated transition-colors relative cursor-pointer min-h-[250px]">
                <input 
                  type="file" 
                  accept=".pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={e => e.target.files && setFile(e.target.files[0])}
                  required={inputType === "pdf"}
                />
                <Upload className="w-10 h-10 text-emerald mb-3 opacity-80" />
                <p className="font-bold text-text-primary mb-1">
                  {file ? file.name : "Click or drag a PDF here"}
                </p>
                <p className="text-sm text-text-tertiary">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Max 10MB recommended"}
                </p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting || (inputType === "pdf" && !file) || (inputType === "text" && !text.trim())}
              className="w-full py-3.5 bg-emerald text-white rounded-lg font-bold hover:bg-emerald/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 mt-4"
            >
              {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing Notes...</> : <><BrainCircuit className="w-5 h-5" /> Generate Deep Notes</>}
            </button>
          </form>
        </Card>

        {/* Output Panel */}
        <div className="flex flex-col gap-6">
          {!result && !isSubmitting && (
            <div className="h-full min-h-[400px] rounded-xl border border-dashed border-border-default flex flex-col items-center justify-center text-text-tertiary p-8 text-center bg-surface/50">
              <BrainCircuit className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-medium text-text-secondary">Synthesizing knowledge...</p>
              <p className="text-sm">Upload or paste notes to generate flashcards and a summary.</p>
            </div>
          )}

          {isSubmitting && (
            <div className="h-full min-h-[400px] rounded-xl border border-border-default flex flex-col items-center justify-center text-text-secondary p-8 text-center bg-surface animate-pulse">
              <Loader2 className="w-12 h-12 mb-4 text-emerald animate-spin" />
              <p className="font-bold text-lg">AI is extracting concepts...</p>
              <p className="text-sm">This could take 10-20 seconds depending on text length.</p>
            </div>
          )}

          {result && !isSubmitting && (
            <>
              {/* 1-Page Summary */}
              <Card className="p-6 bg-surface border-t-4 border-t-emerald border-x border-b border-border-default">
                  <h3 className="font-display font-bold text-xl text-text-primary mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald" /> One-Page Summary
                  </h3>
                  <div className="prose prose-sm prose-invert text-text-secondary max-w-none whitespace-pre-wrap leading-relaxed">
                    {result.one_page_summary}
                  </div>
              </Card>

              {/* Topics & Key Points */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-surface border border-border-default">
                  <h4 className="font-bold text-emerald text-xs uppercase tracking-wider mb-2">Topics Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.topics_covered?.map((t: string, i: number) => (
                      <span key={i} className="bg-emerald/10 text-emerald text-xs px-2 py-1 rounded font-medium">{t}</span>
                    ))}
                  </div>
                </Card>
                <Card className="p-4 bg-surface border border-border-default">
                  <h4 className="font-bold text-emerald text-xs uppercase tracking-wider mb-2">Key Highlights</h4>
                  <ul className="text-sm text-text-secondary list-disc pl-4 space-y-1">
                    {result.key_points?.slice(0, 4).map((k: string, i: number) => <li key={i}>{k}</li>)}
                  </ul>
                </Card>
              </div>

              {/* Flashcards */}
              <div className="mt-2">
                 <h3 className="font-heading font-bold text-lg text-text-primary mb-3">Generated Flashcards ({result.flashcards?.length})</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.flashcards?.map((card: any, i: number) => (
                      <div key={i} className="group perspective-1000 h-[150px] cursor-pointer">
                        <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
                          {/* Front */}
                          <div className="absolute w-full h-full bg-surface border border-border-default rounded-xl p-4 flex flex-col justify-center items-center text-center backface-hidden shadow-sm">
                            <span className="absolute top-2 left-3 text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Q{i+1}</span>
                            <p className="font-bold text-text-primary text-sm">{card.front}</p>
                          </div>
                          {/* Back */}
                          <div className="absolute w-full h-full bg-emerald/10 border border-emerald/30 rounded-xl p-4 flex flex-col justify-center items-center text-center backface-hidden rotate-y-180 overflow-y-auto custom-scrollbar">
                            <p className="font-medium text-emerald text-sm leading-relaxed">{card.back}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                 </div>
                 {/* Need custom CSS mapping for 3D flip. Let's provide fallback simple cards if standard tailwind doesn't have it natively */}
                 <style dangerouslySetInnerHTML={{__html: `
                   .perspective-1000 { perspective: 1000px; }
                   .transform-style-3d { transform-style: preserve-3d; }
                   .backface-hidden { backface-visibility: hidden; }
                   .rotate-y-180 { transform: rotateY(180deg); }
                 `}} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
