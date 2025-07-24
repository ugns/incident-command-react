import React, { createContext, useState, useContext, useEffect } from 'react';
import { Period } from '../types/Period';
import periodService from '../services/periodService';

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

  // Fetch periods from API
  const refreshPeriods = async () => {
    setLoading(true);
    setError(null);
    try {
      // You may want to get the token from context or props if needed
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No auth token');
      const data = await periodService.list(token);
      setPeriods(data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch periods');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    refreshPeriods();
  }, []);

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
