import React, { createContext, useContext, useCallback, useState } from 'react';
import radioService from '../services/radioService';
import { Radio } from '../types/Radio';
import { usePeriod } from './PeriodContext';

interface RadioContextType {
  radios: Radio[];
  loading: boolean;
  refresh: () => Promise<void>;
  updateRadio: (radioId: string, radio: Partial<Radio>) => Promise<Radio>;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedPeriod } = usePeriod();
  const [radios, setRadios] = useState<Radio[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!selectedPeriod) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      const data = await radioService.list(token);
      setRadios(data);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  const updateRadio = useCallback(async (radioId: string, radio: Partial<Radio>) => {
    const token = localStorage.getItem('token') || '';
    const updated = await radioService.update(radioId, radio, token);
    await refresh();
    return updated;
  }, [refresh]);

  return (
    <RadioContext.Provider value={{ radios, loading, refresh, updateRadio }}>
      {children}
    </RadioContext.Provider>
  );
};

export const useRadios = () => {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error('useRadios must be used within a RadioProvider');
  return ctx;
};
