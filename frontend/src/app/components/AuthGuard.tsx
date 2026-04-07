import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/onboarding', { replace: true });
    }
  }, [navigate]);

  const token = localStorage.getItem('access_token');
  if (!token) return null;

  return <>{children}</>;
}
