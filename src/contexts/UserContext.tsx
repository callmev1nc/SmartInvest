/**
 * UserContext - Manages user data including name and risk profile
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { RiskProfile } from '@/constants/investment';

interface UserContextType {
  userName: string | null;
  setUserName: (name: string) => void;
  riskProfile: RiskProfile | null;
  setRiskProfile: (profile: RiskProfile) => void;
  isOnboardingComplete: boolean;
  clearUserData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_NAME_KEY = 'smartinvest_user_name';
const RISK_PROFILE_KEY = 'smartinvest_risk_profile';

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState<string | null>(null);
  const [riskProfile, setRiskProfileState] = useState<RiskProfile | null>(null);

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const name = localStorage.getItem(USER_NAME_KEY);
      const profile = localStorage.getItem(RISK_PROFILE_KEY) as RiskProfile | null;

      setUserNameState(name);
      setRiskProfileState(profile);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const setUserName = (name: string) => {
    try {
      localStorage.setItem(USER_NAME_KEY, name);
      setUserNameState(name);
    } catch (error) {
      console.error('Failed to save user name:', error);
    }
  };

  const setRiskProfile = (profile: RiskProfile) => {
    try {
      localStorage.setItem(RISK_PROFILE_KEY, profile);
      setRiskProfileState(profile);
    } catch (error) {
      console.error('Failed to save risk profile:', error);
    }
  };

  const clearUserData = () => {
    try {
      localStorage.removeItem(USER_NAME_KEY);
      localStorage.removeItem(RISK_PROFILE_KEY);
      setUserNameState(null);
      setRiskProfileState(null);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  };

  const isOnboardingComplete = userName !== null;

  return (
    <UserContext.Provider
      value={{
        userName,
        setUserName,
        riskProfile,
        setRiskProfile,
        isOnboardingComplete,
        clearUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
