import React, { createContext, useState, useContext, useEffect } from 'react';
import { Period } from '../types/Period';
import periodService from '../services/periodService';
import { AuthContext } from './AuthContext';

interface PeriodContextType {
  periods: Period[];
  refresh: () => Promise<void>;
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
  // Context
  const { token, logout } = useContext(AuthContext);

  // State
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriod, setSelectedPeriodState] = useState<Period | null>(() => {
    const stored = localStorage.getItem('selectedPeriod');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Callbacks
  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const data = await periodService.list(token, logout);
      setPeriods(data);
      // Validate selectedPeriod after fetching
      setSelectedPeriodState(prev => {
        if (!prev) return null;
        const found = data.find(p => p.periodId === prev.periodId);
        return found || null;
      });
    } catch (e: any) {
      setError(e.message || 'Failed to fetch periods');
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  // Effects
  useEffect(() => {
    refresh();
  }, [refresh, logout]);

  useEffect(() => {
    // Only persist if selectedPeriod is in periods
    if (selectedPeriod && periods.some(p => p.periodId === selectedPeriod.periodId)) {
      localStorage.setItem('selectedPeriod', JSON.stringify(selectedPeriod));
    } else {
      localStorage.removeItem('selectedPeriod');
    }
  }, [selectedPeriod, periods]);

  // Provider
  const setSelectedPeriod = (period: Period | null) => {
    setSelectedPeriodState(period);
  };

  return (
    <PeriodContext.Provider value={{ periods, refresh, selectedPeriod, setSelectedPeriod, loading, error }}>
      {children}
    </PeriodContext.Provider>
  );
};
