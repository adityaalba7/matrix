import { Outlet, useLocation } from "react-router";
import { Sidebar, TopBar } from "./LayoutUI";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserContext, User } from "../../lib/userContext";
import api from "../../lib/api";
import AuthGuard from "./AuthGuard";

export default function RootLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.data.user);
      } catch {
        // token invalid — AuthGuard will handle redirect
      }
    };
    fetchUser();
  }, []);

  let greeting = user ? `Good morning, ${user.name.split(' ')[0]}` : "Good morning";
  if (location.pathname === "/study") greeting = "Study Focus";
  if (location.pathname === "/finance") greeting = "Finance Tracker";
  if (location.pathname === "/interview") greeting = "Interview Prep";
  if (location.pathname === "/profile") greeting = "Your Profile";
  if (location.pathname === "/rewards") greeting = "Gamification Hub";
  if (location.pathname === "/tools") greeting = "AI Tools";
  if (location.pathname === "/share") greeting = "Shareable Cards";

  return (
    <AuthGuard>
      <UserContext.Provider value={{ user, setUser }}>
        <div className="flex min-h-screen bg-primary-bg">
          <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} userName={user?.name} />
          
          <div className="flex-1 flex flex-col min-w-0 md:ml-[56px] lg:ml-[240px] transition-all duration-300">
            <div className="w-full max-w-[1160px] mx-auto flex-1 px-6 sm:px-10 py-8">
              <TopBar greeting={greeting} onMenuClick={() => setMobileOpen(true)} />
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </UserContext.Provider>
    </AuthGuard>
  );
}
