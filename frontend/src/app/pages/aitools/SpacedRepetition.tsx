import React, { useState } from 'react';
import { Card } from "../../components/ui/card";
import { Loader2, ArrowLeft, RefreshCw, Layers, CheckCircle2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";
import { requestSpacedRepetition } from "../../../lib/pythonApi";

export default function SpacedRepetition() {
  const [subject, setSubject] = useState("Computer Science");
  const [topic, setTopic] = useState("Binary Search Trees");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) return;

    setIsSubmitting(true);
    setResult(null);
    setRevealedCards({});

    try {
      const data = await requestSpacedRepetition({
        subject,
        topic,
        previous_results: [
           { card_id: "c1", question: "What is the time complexity of searching in a perfectly balanced BST?", was_correct: false, difficulty: 3 },
           { card_id: "c2", question: "In a worst case scenario, what structure does a BST resemble?", was_correct: false, difficulty: 2 }
        ]
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("AI Generation failed. Check server connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCard = (card: any, type: "review" | "new") => {
    const isRevealed = revealedCards[card.card_id];
    
    return (
       <Card key={card.card_id} className={`p-5 border ${type === 'review' ? 'border-rose/30 bg-rose/5' : 'border-emerald/30 bg-emerald/5'}`}>
          <div className="flex justify-between items-start mb-3">
             <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${type === 'review' ? 'bg-rose/20 text-rose' : 'bg-emerald/20 text-emerald'}`}>
               {type === 'review' ? 'Disguised Review' : 'New Concept'}
             </span>
             <span className="text-[10px] uppercase font-bold text-text-tertiary">Next: {card.next_review_date}</span>
          </div>
          
          <div className="mb-4">
            <p className="font-bold text-text-primary text-sm leading-relaxed">
              {type === 'review' ? card.disguised_question : card.question}
            </p>
            {type === 'review' && (
              <p className="text-[11px] text-text-tertiary mt-2 italic flex items-start gap-1">
                <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" /> Original: {card.question}
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-border-default">
             <button 
                onClick={() => toggleReveal(card.card_id)}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${isRevealed ? 'text-violet' : 'text-text-secondary hover:text-text-primary'}`}
             >
                {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isRevealed ? "Hide Answer" : "Reveal Answer"}
             </button>
             
             {isRevealed && (
               <div className="mt-3 p-3 bg-surface rounded-lg border border-border-default">
                 <p className="text-sm text-text-primary leading-relaxed font-medium">{card.answer}</p>
                 <div className="flex gap-2 mt-3 pt-3 border-t border-border-default">
                    <button className="flex-1 py-1.5 text-xs font-bold bg-rose/10 text-rose rounded hover:bg-rose/20 transition-colors">Hard</button>
                    <button className="flex-1 py-1.5 text-xs font-bold bg-saffron/10 text-saffron rounded hover:bg-saffron/20 transition-colors">Good</button>
                    <button className="flex-1 py-1.5 text-xs font-bold bg-emerald/10 text-emerald rounded hover:bg-emerald/20 transition-colors">Easy</button>
                 </div>
               </div>
             )}
          </div>
       </Card>
    );
  };

  return (
    <div className="space-y-6 pb-10">
      <Link to="/tools" className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald/10 text-emerald shrink-0">
          <RefreshCw className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary">Spaced Repetition Engine</h1>
          <p className="text-text-secondary font-medium">AI re-asks your missed questions in disguise so you actually learn, not memorize.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form Column */}
        <div>
           <Card className="p-6 bg-surface border border-border-default">
             <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Broad Subject</label>
                 <input type="text" value={subject} onChange={e=>setSubject(e.target.value)} className="w-full bg-primary-bg rounded-lg py-2.5 px-3 text-sm text-text-primary border border-border-default outline-none transition-all focus:border-emerald focus:ring-1 focus:ring-emerald" required />
               </div>
               <div>
                 <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Specific Topic</label>
                 <input type="text" value={topic} onChange={e=>setTopic(e.target.value)} className="w-full bg-primary-bg rounded-lg py-2.5 px-3 text-sm text-text-primary border border-border-default outline-none transition-all focus:border-emerald focus:ring-1 focus:ring-emerald" required />
               </div>

               <div className="p-3 bg-rose/10 border border-rose/20 rounded-lg text-xs leading-relaxed text-text-secondary">
                  <strong className="text-rose">Simulated State:</strong> Passing 2 incorrect answers from a previous session to force the AI to disguise them.
               </div>

               <button 
                 type="submit" 
                 disabled={isSubmitting}
                 className="w-full py-3 bg-emerald text-white rounded-lg font-bold hover:bg-emerald/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
               >
                 {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Fetching Cards...</> : <><Layers className="w-5 h-5" /> Generate Deck</>}
               </button>
             </form>
           </Card>
        </div>

        {/* Output Column */}
        <div className="flex flex-col gap-6">
          {!result && !isSubmitting && (
            <div className="min-h-[300px] rounded-xl border border-dashed border-border-default flex flex-col items-center justify-center text-text-tertiary p-8 text-center bg-surface/50">
              <RefreshCw className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-medium text-text-secondary">Deck empty.</p>
              <p className="text-sm">Submit a topic to pull your spaced repetition cards.</p>
            </div>
          )}

          {isSubmitting && (
            <div className="min-h-[300px] rounded-xl border border-border-default flex flex-col items-center justify-center text-text-secondary p-8 text-center bg-surface animate-pulse">
              <Loader2 className="w-12 h-12 mb-4 text-emerald animate-spin" />
              <p className="font-bold text-lg">AI is disguising questions...</p>
              <p className="text-sm">Rewriting missed questions so you can't cheat via memory.</p>
            </div>
          )}

          {result && !isSubmitting && (
            <>
              <Card className="p-5 bg-surface border border-border-default flex items-start gap-4">
                 <div className="w-10 h-10 rounded-full bg-emerald/10 text-emerald flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="font-bold text-text-primary text-base mb-1">Deck Overview</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{result.performance_summary}</p>
                 </div>
              </Card>

              {result.cards_to_review?.length > 0 && (
                <div>
                   <h3 className="font-bold text-lg text-text-primary mb-3">Review Cards (Disguised)</h3>
                   <div className="space-y-4">
                      {result.cards_to_review.map((card: any) => renderCard(card, 'review'))}
                   </div>
                </div>
              )}

              {result.new_cards?.length > 0 && (
                <div className="mt-2">
                   <h3 className="font-bold text-lg text-text-primary mb-3">New Concepts</h3>
                   <div className="space-y-4">
                      {result.new_cards.map((card: any) => renderCard(card, 'new'))}
                   </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
