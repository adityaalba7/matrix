import React, { useState, useRef } from 'react';
import { Card } from "../../components/ui/card";
import { Loader2, ArrowLeft, Mic, PlayCircle, StopCircle, Upload, CheckCircle2, FileAudio, Check, X } from "lucide-react";
import { Link } from "react-router";
import { requestLectureAudio } from "../../../lib/pythonApi";

export default function LectureRecorder() {
  const [subject, setSubject] = useState("General");
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  // We are simulating recording by just letting them upload an audio file for now.
  // Actually implementing MediaRecorder API could take significant time to hook up properly with the backend's expectations.
  const handleSimulateRecordingToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setRecordingTime(0);
      const interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 5) {
             clearInterval(interval);
             setIsRecording(false);
             alert("Simulation over. Please upload an actual audio file below to parse.");
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const data = await requestLectureAudio(file, subject);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Whisper AI parsing failed. Ensure Groq API Key is valid and the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-10">
      <Link to="/tools" className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-violet/10 text-violet shrink-0">
          <Mic className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary">Lecture Recorder</h1>
          <p className="text-text-secondary font-medium">Record or upload an audio clip to instantly get notes and a quiz using Whisper UI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card className="p-6 bg-surface border border-border-default h-fit">
          <div className="flex flex-col items-center justify-center bg-primary-bg rounded-2xl py-10 mb-6 border-2 border-dashed border-border-default h-[250px]">
             
             {!isRecording ? (
               <button onClick={handleSimulateRecordingToggle} className="w-20 h-20 bg-rose/10 hover:bg-rose/20 text-rose rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
                 <Mic className="w-8 h-8" />
               </button>
             ) : (
               <button onClick={handleSimulateRecordingToggle} className="w-20 h-20 bg-rose text-white rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 animate-pulse shadow-[0_0_40px_rgba(244,63,94,0.4)]">
                 <StopCircle className="w-10 h-10" />
               </button>
             )}
             
             <div className="mt-6 font-mono text-xl font-bold text-text-primary tracking-widest">{formatTime(recordingTime)}</div>
             <p className="text-text-tertiary text-sm mt-2 font-medium">{isRecording ? "Recording in progress..." : "Tap to record (Simulation)"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Lecture Subject</label>
              <input 
                type="text" 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full bg-primary-bg rounded-lg p-3 text-text-primary border border-border-default focus:border-violet focus:ring-1 focus:ring-violet outline-none transition-all"
                placeholder="e.g. Distributed Systems 101"
              />
            </div>

            <div>
               <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Or Upload Audio File</label>
               <input 
                  type="file" 
                  accept="audio/*"
                  className="w-full bg-primary-bg rounded-lg p-2 text-text-primary border border-border-default outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet/10 file:text-violet hover:file:bg-violet/20"
                  onChange={e => e.target.files && setFile(e.target.files[0])}
                  required
                />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !file}
              className="w-full py-3.5 bg-violet text-white rounded-lg font-bold hover:bg-violet/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 mt-4"
            >
              {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Whispering to AI...</> : <><FileAudio className="w-5 h-5" /> Generate Lecture Notes</>}
            </button>
          </form>
        </Card>

        {/* Output Panel */}
        <div className="flex flex-col gap-6">
          {!result && !isSubmitting && (
            <div className="h-full min-h-[400px] rounded-xl border border-dashed border-border-default flex flex-col items-center justify-center text-text-tertiary p-8 text-center bg-surface/50">
              <PlayCircle className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-medium text-text-secondary">Waiting to hear lecture...</p>
              <p className="text-sm">Upload an audio dump to get structured material.</p>
            </div>
          )}

          {isSubmitting && (
            <div className="h-full min-h-[400px] rounded-xl border border-border-default flex flex-col items-center justify-center text-text-secondary p-8 text-center bg-surface animate-pulse">
              <Loader2 className="w-12 h-12 mb-4 text-violet animate-spin" />
              <p className="font-bold text-lg">AI is transcribing...</p>
              <p className="text-sm">Parsing the audio via Whisper and generating quizzes.</p>
            </div>
          )}

          {result && !isSubmitting && (
            <>
              {/* Summary */}
              <Card className="p-5 bg-surface border-l-4 border-l-violet border-y border-y-border-default border-r border-r-border-default">
                  <h4 className="font-bold text-violet text-sm uppercase tracking-wider mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Lecture Summary</h4>
                  <p className="text-sm text-text-primary leading-relaxed">{result.summary}</p>
              </Card>

              {/* Notes */}
              <Card className="p-4 bg-surface border border-border-default">
                  <h4 className="font-bold text-text-primary text-base mb-3">Structured Notes</h4>
                  <ul className="space-y-3 text-sm text-text-secondary">
                    {result.notes?.map((n: string, i: number) => (
                       <li key={i} className="flex gap-3 items-start">
                          <span className="w-5 h-5 rounded-full bg-violet/10 text-violet flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">{i+1}</span>
                          <span>{n}</span>
                       </li>
                    ))}
                  </ul>
              </Card>

              {/* Live Quiz */}
              <div>
                  <h4 className="font-heading font-bold text-xl text-text-primary mb-4 flex items-center gap-2">Practice Quiz</h4>
                  <div className="space-y-4">
                     {result.quiz?.map((q: any, i: number) => (
                        <Card key={i} className="p-5 bg-surface border border-border-default">
                           <p className="font-bold text-text-primary mb-4">Q{i+1}: {q.question}</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {q.options.map((opt: string, j: number) => (
                                 <div key={j} className={`p-3 rounded-lg border text-sm font-medium flex justify-between items-center transition-colors
                                    ${opt === q.answer ? 'bg-emerald/10 border-emerald/30 text-emerald' : 'bg-primary-bg border-border-default text-text-secondary'}`}
                                 >
                                    <span>{opt}</span>
                                    {opt === q.answer && <Check className="w-4 h-4" />}
                                 </div>
                              ))}
                           </div>
                        </Card>
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
