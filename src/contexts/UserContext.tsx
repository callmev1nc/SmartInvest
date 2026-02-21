/**
 * UserContext - Manages user data including name and risk profile
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { RiskProfile } from '@/constants/investment';
import { StorageHelper } from '@/utils/storage';

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
    const name = StorageHelper.get<string | null>(USER_NAME_KEY, null);
    const profile = StorageHelper.get<RiskProfile | null>(RISK_PROFILE_KEY, null);

    setUserNameState(name);
    setRiskProfileState(profile);
  };

  const setUserName = (name: string) => {
    StorageHelper.set(USER_NAME_KEY, name);
    setUserNameState(name);
  };

  const setRiskProfile = (profile: RiskProfile) => {
    StorageHelper.set(RISK_PROFILE_KEY, profile);
    setRiskProfileState(profile);
  };

  const clearUserData = () => {
    StorageHelper.remove(USER_NAME_KEY);
    StorageHelper.remove(RISK_PROFILE_KEY);
    setUserNameState(null);
    setRiskProfileState(null);
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
