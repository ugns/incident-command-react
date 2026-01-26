import React, { createContext, useContext } from 'react';
import { Radio } from '../types/Radio';
import radioService from '../services/radioService';
import { AuthContext } from './AuthContext';
import { useCrudResource } from '../hooks/useCrudResource';

interface RadioContextType {
  radios: Radio[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addRadio: (data: Partial<Radio>) => Promise<Radio | null>;
  updateRadio: (id: string, data: Partial<Radio>) => Promise<Radio | null>;
  deleteRadio: (id: string) => Promise<void>;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Context
  const { token, logout } = useContext(AuthContext);

  const { items, loading, error, refresh, add, update, remove } = useCrudResource<Radio>(
    radioService,
    token,
    logout
  );

  // Provider
  return (
    <RadioContext.Provider value={{
      radios: items,
      loading,
      error,
      refresh,
      addRadio: add,
      updateRadio: update,
      deleteRadio: remove
    }}>
      {children}
    </RadioContext.Provider>
  );
};

export const useRadios = () => {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error('useRadios must be used within a RadioProvider');
  return ctx;
};
