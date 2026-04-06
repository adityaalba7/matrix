import { Card } from "../components/ui/card";
import { BookOpen, IndianRupee, Video, ArrowRight, Triangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { register, login } from "../../lib/auth";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [budget] = useState(800000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const navigate = useNavigate();

  const alreadyLoggedIn = !!localStorage.getItem('access_token');
  
  useEffect(() => {
    if (alreadyLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [alreadyLoggedIn, navigate]);

  if (alreadyLoggedIn) {
    return null;
  }

  const handleSelect = (id: string) => setSelected(id);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (authMode === 'signup') {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          onboarding_goal: selected,
          monthly_budget: budget,
        });
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
      }
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error?.message;
      setError(msg || (authMode === 'signup' ? "Registration failed. Try again." : "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface px-6 py-12 flex flex-col relative overflow-hidden items-center justify-center">
      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">
        
        <div className="flex items-center gap-2 mb-12">
          <Triangle className="w-8 h-8 text-text-primary fill-text-primary" />
          <span className="font-heading font-bold text-xl tracking-wide text-text-primary">TriMind</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center w-full"
            >
              <h1 className="font-display text-4xl md:text-5xl text-text-primary leading-tight text-center tracking-tight mb-4">
                What brings you here?
              </h1>
              <p className="text-text-secondary font-sans text-lg font-medium tracking-wide mb-12 text-center">
                We'll personalise everything from your answer.
              </p>

              <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
                {[
                  { id: "placed", title: "Get Placed", subtitle: "Aptitude, DSA, & Mock Interviews", icon: Video, accent: "#5B47E0" },
                  { id: "money", title: "Control My Money", subtitle: "Budget tracking & saving goals", icon: IndianRupee, accent: "#E8620A" },
                  { id: "exam", title: "Crack My Exam", subtitle: "GATE, CAT, or Semester prep", icon: BookOpen, accent: "#0EA882" },
                ].map((goal) => {
                  const isSelected = selected === goal.id;
                  return (
                    <Card 
                      key={goal.id}
                      onClick={() => handleSelect(goal.id)}
                      className={`w-full md:w-[280px] h-[180px] p-6 flex flex-col cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                        isSelected ? 'border-transparent shadow-md' : 'hover:border-border-hover'
                      }`}
                      style={{
                        borderLeftWidth: '3px',
                        borderLeftColor: goal.accent,
                        borderColor: isSelected ? goal.accent : undefined,
                        borderWidth: isSelected ? '2px' : undefined,
                        backgroundColor: isSelected ? `${goal.accent}15` : undefined,
                      }}
                    >
                      <div className="flex flex-col gap-4 relative z-10 h-full">
                        <goal.icon className="w-8 h-8" style={{ color: goal.accent }} />
                        <div className="mt-auto">
                          <h2 className="font-heading font-bold text-xl text-text-primary mb-1">{goal.title}</h2>
                          <p className="text-text-secondary text-sm font-medium leading-relaxed">{goal.subtitle}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {selected && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setStep(2)}
                  className="mt-12 flex items-center gap-2 bg-text-primary text-surface font-medium px-8 py-3.5 rounded-xl text-sm hover:bg-text-primary/90 transition-colors"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center w-full max-w-md"
            >
              <h1 className="font-display text-4xl text-text-primary leading-tight text-center tracking-tight mb-8">
                {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
              </h1>

              <div className="w-full flex mb-6 bg-elevated rounded-xl p-1">
                <button
                  onClick={() => { setAuthMode('signup'); setError(null); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    authMode === 'signup' ? 'bg-surface text-text-primary shadow-sm' : 'text-text-tertiary'
                  }`}
                >Sign Up</button>
                <button
                  onClick={() => { setAuthMode('login'); setError(null); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    authMode === 'login' ? 'bg-surface text-text-primary shadow-sm' : 'text-text-tertiary'
                  }`}
                >Sign In</button>
              </div>

              <Card className="w-full p-6 bg-surface mb-6 flex flex-col gap-4">
                {error && <div className="text-rose text-sm font-medium bg-rose/10 p-3 rounded-lg">{error}</div>}
                
                {authMode === 'signup' && (
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-primary-bg border border-border-default rounded-lg px-4 py-3 text-sm outline-none focus:border-violet transition-colors" 
                  />
                )}
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-primary-bg border border-border-default rounded-lg px-4 py-3 text-sm outline-none focus:border-violet transition-colors" 
                />
                <input 
                  type="password" 
                  placeholder="Password (min 8 chars)" 
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-primary-bg border border-border-default rounded-lg px-4 py-3 text-sm outline-none focus:border-violet transition-colors" 
                />
              </Card>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-violet text-surface font-medium px-8 py-3.5 rounded-xl text-sm hover:bg-violet/90 transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? (authMode === 'signup' ? 'Creating...' : 'Signing in...') : (authMode === 'signup' ? 'Create Account' : 'Sign In')}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-[-60px] flex gap-2">
          {[1, 2].map(d => (
            <div 
              key={d} 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${step === d ? 'bg-text-primary w-6' : 'bg-border-default'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}