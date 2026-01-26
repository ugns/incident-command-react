import React, { createContext, useContext, useState, useEffect } from 'react';
import { Radio } from '../types/Radio';
import radioService from '../services/radioService';
import { AuthContext } from './AuthContext';

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

  // State
  const [radios, setRadios] = useState<Radio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Callbacks
  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const data = await radioService.list(token, logout);
      setRadios(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch radios');
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  const addRadio = async (data: Partial<Radio>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const newRadio = await radioService.create(data, token, logout);
      await refresh();
      return newRadio;
    } catch (err: any) {
      setError(err.message || 'Failed to add radio');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const updateRadio = async (id: string, data: Partial<Radio>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const updated = await radioService.update(id, data, token, logout);
      await refresh();
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update radio');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteRadio = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      await radioService.delete(id, token, logout);
      await refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete radio');
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Provider
  return (
    <RadioContext.Provider value={{
      radios,
      loading,
      error,
      refresh,
      addRadio,
      updateRadio,
      deleteRadio
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
