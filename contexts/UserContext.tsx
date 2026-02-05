/**
 * UserContext - Manages user data including name and risk profile
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import type { RiskProfile } from '@/constants/investment';

interface UserContextType {
  userName: string | null;
  setUserName: (name: string) => Promise<void>;
  riskProfile: RiskProfile | null;
  setRiskProfile: (profile: RiskProfile) => Promise<void>;
  isOnboardingComplete: boolean;
  clearUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

const USER_NAME_KEY = 'user_name';
const RISK_PROFILE_KEY = 'risk_profile';

export function UserProvider({ children }: UserProviderProps) {
  const [userName, setUserNameState] = useState<string | null>(null);
  const [riskProfile, setRiskProfileState] = useState<RiskProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [name, profile] = await Promise.all([
        SecureStore.getItemAsync(USER_NAME_KEY),
        SecureStore.getItemAsync(RISK_PROFILE_KEY),
      ]);

      setUserNameState(name);
      setRiskProfileState((profile || null) as RiskProfile | null);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUserName = async (name: string) => {
    try {
      await SecureStore.setItemAsync(USER_NAME_KEY, name);
      setUserNameState(name);
    } catch (error) {
      console.error('Failed to save user name:', error);
      throw error;
    }
  };

  const setRiskProfile = async (profile: RiskProfile) => {
    try {
      await SecureStore.setItemAsync(RISK_PROFILE_KEY, profile);
      setRiskProfileState(profile);
    } catch (error) {
      console.error('Failed to save risk profile:', error);
      throw error;
    }
  };

  const clearUserData = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(USER_NAME_KEY),
        SecureStore.deleteItemAsync(RISK_PROFILE_KEY),
      ]);
      setUserNameState(null);
      setRiskProfileState(null);
    } catch (error) {
      console.error('Failed to clear user data:', error);
      throw error;
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

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
