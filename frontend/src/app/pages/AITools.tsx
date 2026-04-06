import { Card } from "../components/ui/card";
import { MessageCircle, Mic, FileText, Briefcase, Smile, RefreshCw, IndianRupee, GraduationCap, Moon, Flame, Calendar, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const aiTools = [
  { id: "whatsapp", title: "WhatsApp Chat Parser", desc: "Paste group chat → AI detects exam dates → builds study plan", icon: MessageCircle, color: "emerald" },
  { id: "lecture", title: "Lecture Recorder", desc: "Record 10 mins → get notes + quiz instantly", icon: Mic, color: "violet" },
  { id: "notes", title: "Smart Notes Summarizer", desc: "Upload PDF → flashcards + 1-page summary", icon: FileText, color: "emerald" },
  { id: "resume-gap", title: "Resume Gap Detector", desc: "Upload resume + target company → 30-day roadmap", icon: Briefcase, color: "violet" },
  { id: "mood", title: "Mood-Adaptive Session", desc: "Tell AI how you feel → session adjusts automatically", icon: Smile, color: "saffron" },
  { id: "spaced", title: "Spaced Repetition Engine", desc: "AI re-asks your wrong answers in disguise 3 days later", icon: RefreshCw, color: "emerald" },
  { id: "cgpa", title: "CGPA to Package Estimator", desc: "Enter CGPA + college tier → likely package range", icon: IndianRupee, color: "saffron" },
  { id: "scholarship", title: "Scholarship Radar", desc: "Based on your profile → find scholarships you qualify for", icon: GraduationCap, color: "emerald" },
  { id: "sleep", title: "Sleep & Study Correlation", desc: "Log sleep → AI shows your peak performance pattern", icon: Moon, color: "violet" },
  { id: "roast", title: "Roast My Resume", desc: "Upload resume → get savage + actionable AI feedback", icon: Flame, color: "rose" },
  { id: "wrap", title: "Monthly Wrap", desc: "Spotify-style monthly recap → shareable story card", icon: Calendar, color: "violet" },
  { id: "twin", title: "Student Twin Match", desc: "Find another student with same goals + gaps as you", icon: Users, color: "saffron" },
];

export default function AITools() {
  return (
    <div className="space-y-6 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {aiTools.map((tool) => (
          <Link key={tool.id} to={`/tools/${tool.id}`} className="block h-full">
            <Card className="p-5 h-full flex flex-col bg-surface border border-border-default hover:bg-elevated transition-colors cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${tool.color}/10 text-${tool.color} shrink-0`}>
                  <tool.icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-violet transition-colors group-hover:translate-x-1" />
              </div>
              <h3 className="font-heading font-bold text-[15px] text-text-primary mb-1.5 line-clamp-1">{tool.title}</h3>
              <p className="text-[12px] text-text-secondary leading-relaxed font-medium line-clamp-2 mb-4">{tool.desc}</p>
              
              <div className="mt-auto pt-4 border-t border-border-default">
                <span className={`text-[11px] font-bold uppercase tracking-wider text-${tool.color} group-hover:underline`}>Open Tool</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}