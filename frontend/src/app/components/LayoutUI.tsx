import { Link, useLocation } from "react-router";
import { Home, BookOpen, IndianRupee, Video, User, Bell, Menu, X, Triangle, Trophy, Sparkles, Share } from "lucide-react";
import { cn } from "../../lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const tabs = [
  { name: "Home", path: "/", icon: Home, accent: "border-text-primary text-text-primary", bgHover: "hover:bg-white/5", activeBg: "bg-white/5" },
  { name: "Study", path: "/study", icon: BookOpen, accent: "border-emerald text-emerald", bgHover: "hover:bg-white/5", activeBg: "bg-white/5" },
  { name: "Finance", path: "/finance", icon: IndianRupee, accent: "border-saffron text-saffron", bgHover: "hover:bg-white/5", activeBg: "bg-white/5" },
  { name: "Interview", path: "/interview", icon: Video, accent: "border-violet text-violet", bgHover: "hover:bg-white/5", activeBg: "bg-white/5" },
  { name: "Profile", path: "/profile", icon: User, accent: "border-text-primary text-text-primary", bgHover: "hover:bg-white/5", activeBg: "bg-white/5" },
  { name: "Rewards", path: "/rewards", icon: Trophy, accent: "border-emerald text-emerald", bgHover: "hover:bg-white/5", activeBg: "bg-white/5" },
  { name: "AI Tools", path: "/tools", icon: Sparkles, accent: "border-violet text-violet", bgHover: "hover:bg-white/5", activeBg: "bg-white/5" },
  { name: "Share", path: "/share", icon: Share, accent: "border-saffron text-saffron", bgHover: "hover:bg-white/5", activeBg: "bg-white/5" },
];

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (v: boolean) => void }) {
  const location = useLocation();
  const path = location.pathname;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar-bg">
      <div className="h-20 flex items-center px-6">
        <Triangle className="w-7 h-7 text-white fill-white/20" />
        <span className="ml-3 font-heading font-bold text-white text-xl tracking-wide lg:block md:hidden block">TriMind</span>
        <button className="md:hidden ml-auto p-2" onClick={() => setMobileOpen(false)}>
          <X className="w-5 h-5 text-[#6B7080]" />
        </button>
      </div>
      
      <nav className="flex-1 py-4 px-3 space-y-1">
        {tabs.map((tab) => {
          const isActive = path === tab.path;
          return (
            <Link
              key={tab.name}
              to={tab.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center h-10 px-3 rounded-lg transition-all duration-200 group border-l-[3px]",
                isActive 
                  ? cn(tab.accent, tab.activeBg)
                  : "border-transparent text-[#6B7080] hover:text-[#E8E6DF] hover:bg-white/5"
              )}
              title={tab.name}
            >
              <tab.icon className={cn("w-[18px] h-[18px] shrink-0", isActive ? "" : "group-hover:scale-110 transition-transform")} />
              <span className={cn("ml-3 font-medium text-[14px] lg:block md:hidden block", isActive ? "text-[#E8E6DF]" : "")}>{tab.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center px-2 lg:justify-start md:justify-center justify-start">
          <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center overflow-hidden shrink-0">
             <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="ml-3 lg:block md:hidden block">
            <div className="text-sm font-medium text-[#E8E6DF]">Aditya</div>
            <div className="text-[11px] text-emerald font-semibold uppercase tracking-wider">Pro Plan</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block fixed inset-y-0 left-0 z-40 lg:w-[240px] md:w-[56px] transition-all duration-300 shadow-[2px_0_10px_rgba(0,0,0,0.05)]">
        <SidebarContent />
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[260px] z-50 md:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function TopBar({ greeting = "Good morning, Aditya", onMenuClick }: { greeting?: string, onMenuClick: () => void }) {
  const location = useLocation();
  const path = location.pathname;
  const currentTab = tabs.find(t => t.path === path) || tabs[0];
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  
  return (
    <div className="flex justify-between items-center pb-8 pt-2 bg-transparent">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[13px] font-medium text-text-secondary mb-1">
            <Link to="/" className="hover:text-text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-text-primary font-semibold">{currentTab.name}</span>
          </div>
          <h1 className="text-[28px] font-medium text-text-primary font-heading tracking-tight">{greeting}</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <span className="hidden sm:block text-text-secondary text-sm font-medium">{currentDate}</span>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-elevated rounded-full transition-colors">
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-saffron rounded-full border-2 border-primary-bg" />
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-surface shadow-sm border border-border-default flex items-center justify-center overflow-hidden">
            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
