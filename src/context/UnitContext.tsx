import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Unit } from '../types/Unit';
import unitService from '../services/unitService';
import { AuthContext } from './AuthContext';

interface UnitContextType {
  units: Unit[];
  loading: boolean;
  error: string | null;
  selectedUnit: Unit | null;
  setSelectedUnit: (unit: Unit | null) => void;
  refresh: () => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Context
  const { token } = useContext(AuthContext);

  // State
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnitState] = useState<Unit | null>(() => {
    const stored = localStorage.getItem('selectedUnit');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Callbacks
  const fetchUnits = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await unitService.list(token);
      setUnits(data);
      // Validate selectedUnit after fetching
      setSelectedUnitState(prev => {
        if (!prev) return null;
        const found = data.find(u => u.unitId === prev.unitId);
        return found || null;
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch units');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Effects
  useEffect(() => {
    fetchUnits();
    const interval = setInterval(fetchUnits, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [fetchUnits]);

  useEffect(() => {
    // Only persist if selectedUnit is in units
    if (selectedUnit && units.some(u => u.unitId === selectedUnit.unitId)) {
      localStorage.setItem('selectedUnit', JSON.stringify(selectedUnit));
    } else {
      localStorage.removeItem('selectedUnit');
    }
  }, [selectedUnit, units]);

  // Provider
  const setSelectedUnit = (unit: Unit | null) => {
    setSelectedUnitState(unit);
  };

  return (
    <UnitContext.Provider value={{ units, loading, error, selectedUnit, setSelectedUnit, refresh: fetchUnits }}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = () => {
  const ctx = useContext(UnitContext);
  if (!ctx) throw new Error('useUnit must be used within a UnitProvider');
  return ctx;
};
