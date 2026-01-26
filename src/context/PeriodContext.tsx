import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { Period } from '../types/Period';
import periodService from '../services/periodService';
import { AuthContext } from './AuthContext';
import { useCrudResource } from '../hooks/useCrudResource';

interface PeriodContextType {
  periods: Period[];
  loading: boolean;
  error: string | null;
  selectedPeriod: Period | null;
  setSelectedPeriod: (period: Period | null) => void;
  refresh: () => Promise<void>;
  addPeriod: (data: Partial<Period>) => Promise<Period | null>;
  updatePeriod: (id: string, data: Partial<Period>) => Promise<Period | null>;
  deletePeriod: (id: string) => Promise<void>;
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined);

export const PeriodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Context
  const { token, logout } = useContext(AuthContext);

  // State
  const [selectedPeriod, setSelectedPeriodState] = useState<Period | null>(() => {
    const stored = localStorage.getItem('selectedPeriod');
    return stored ? JSON.parse(stored) : null;
  });
  const handleList = useCallback((data: Period[]) => {
    // Validate selectedPeriod after fetching
    setSelectedPeriodState(prev => {
      if (!prev) return null;
      const found = data.find(p => p.periodId === prev.periodId);
      return found || null;
    });
  }, []);

  const crudOptions = useMemo(() => ({
    skipIfNoToken: true,
    onList: handleList,
  }), [handleList]);

  const { items, loading, error, refresh, add, update, remove } = useCrudResource<Period>(
    periodService,
    token,
    logout,
    crudOptions
  );

  useEffect(() => {
    // Only persist if selectedPeriod is in periods
    if (selectedPeriod && items.some(p => p.periodId === selectedPeriod.periodId)) {
      localStorage.setItem('selectedPeriod', JSON.stringify(selectedPeriod));
    } else {
      localStorage.removeItem('selectedPeriod');
    }
  }, [selectedPeriod, items]);

  // Provider
  const setSelectedPeriod = (period: Period | null) => {
    setSelectedPeriodState(period);
  };

  return (
    <PeriodContext.Provider value={{
      periods: items,
      loading,
      error,
      selectedPeriod,
      setSelectedPeriod,
      refresh,
      addPeriod: add,
      updatePeriod: update,
      deletePeriod: remove,
    }}>
      {children}
    </PeriodContext.Provider>
  );
};

export const usePeriod = () => {
  const ctx = useContext(PeriodContext);
  if (!ctx) throw new Error('usePeriod must be used within a PeriodProvider');
  return ctx;
}
