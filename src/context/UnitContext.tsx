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
  addUnit: (data: Partial<Unit>) => Promise<Unit | null>;
  updateUnit: (id: string, data: Partial<Unit>) => Promise<Unit | null>;
  deleteUnit: (id: string) => Promise<void>;
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


  // CRUD functions
  const addUnit = async (data: Partial<Unit>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const newUnit = await unitService.create(data, token);
      await fetchUnits();
      return newUnit;
    } catch (err: any) {
      setError(err.message || 'Failed to add unit');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUnit = async (id: string, data: Partial<Unit>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const updated = await unitService.update(id, data, token);
      await fetchUnits();
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update unit');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteUnit = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      await unitService.delete(id, token);
      await fetchUnits();
    } catch (err: any) {
      setError(err.message || 'Failed to delete unit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UnitContext.Provider value={{
      units,
      loading,
      error,
      selectedUnit,
      setSelectedUnit,
      refresh: fetchUnits,
      addUnit,
      updateUnit,
      deleteUnit
    }}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = () => {
  const ctx = useContext(UnitContext);
  if (!ctx) throw new Error('useUnit must be used within a UnitProvider');
  return ctx;
};
