import React, { createContext, useState, useContext, useEffect } from 'react';
import { Period } from '../types/Period';
import periodService from '../services/periodService';
import { AuthContext } from './AuthContext';

interface PeriodContextType {
  periods: Period[];
  refreshPeriods: () => Promise<void>;
  selectedPeriod: Period | null;
  setSelectedPeriod: (period: Period | null) => void;
  loading: boolean;
  error: string | null;
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined);

export const usePeriod = () => {
  const ctx = useContext(PeriodContext);
  if (!ctx) throw new Error('usePeriod must be used within a PeriodProvider');
  return ctx;
};

export const PeriodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriodState] = useState<Period | null>(() => {
    const stored = localStorage.getItem('selectedPeriod');
    return stored ? JSON.parse(stored) : null;
  });
  const { logout } = useContext(AuthContext);

  // Fetch periods from API
  const refreshPeriods = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No auth token');
      const data = await periodService.list(token, logout);
      setPeriods(data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch periods');
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Initial fetch
  useEffect(() => {
    refreshPeriods();
  }, [refreshPeriods, logout]);

  // Update localStorage whenever selectedPeriod changes
  useEffect(() => {
    if (selectedPeriod) {
      localStorage.setItem('selectedPeriod', JSON.stringify(selectedPeriod));
    } else {
      localStorage.removeItem('selectedPeriod');
    }
  }, [selectedPeriod]);

  // Wrapper to update state and localStorage
  const setSelectedPeriod = (period: Period | null) => {
    setSelectedPeriodState(period);
  };

  return (
    <PeriodContext.Provider value={{ periods, refreshPeriods, selectedPeriod, setSelectedPeriod, loading, error }}>
      {children}
    </PeriodContext.Provider>
  );
};
