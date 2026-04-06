import { createContext, useContext } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  college?: string;
  monthly_budget?: number;
  trimind_score?: number;
  streak_days?: number;
  exam_date?: string;
  onboarding_goal?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (u: User | null) => void;
}

export const UserContext = createContext<UserContextType>({ user: null, setUser: () => {} });

export const useUser = () => useContext(UserContext);
