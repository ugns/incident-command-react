import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Unit } from '../types/Unit';
import unitService from '../services/unitService';
import { AuthContext } from './AuthContext';
import { useCrudResource } from '../hooks/useCrudResource';

interface UnitContextType {
  units: Unit[];
  loading: boolean;
  error: string | null;
  selectedUnit: Unit | null;
  setSelectedUnit: (unit: Unit | null) => void;
  refresh: () => Promise<void>;
  addUnit: (data: Partial<Unit>) => Promise<Unit | null>;
  updateUnit: (id: string, data: Partial<Unit>) => Promise<Unit | null>;
  deleteUnit: (id: string) => Promise<void>;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Context
  const { token, logout } = useContext(AuthContext);

  // State
  const [selectedUnit, setSelectedUnitState] = useState<Unit | null>(() => {
    const stored = localStorage.getItem('selectedUnit');
    return stored ? JSON.parse(stored) : null;
  });
  const handleList = useCallback((data: Unit[]) => {
    // Validate selectedUnit after fetching
    setSelectedUnitState(prev => {
      if (!prev) return null;
      const found = data.find(u => u.unitId === prev.unitId);
      return found || null;
    });
  }, []);

  const crudOptions = useMemo(() => ({
    skipIfNoToken: true,
    onList: handleList,
  }), [handleList]);

  const { items, loading, error, refresh, add, update, remove } = useCrudResource<Unit>(
    unitService,
    token,
    logout,
    crudOptions
  );

  useEffect(() => {
    // Only persist if selectedUnit is in units
    if (selectedUnit && items.some(u => u.unitId === selectedUnit.unitId)) {
      localStorage.setItem('selectedUnit', JSON.stringify(selectedUnit));
    } else {
      localStorage.removeItem('selectedUnit');
    }
  }, [selectedUnit, items]);

  // Provider
  const setSelectedUnit = (unit: Unit | null) => {
    setSelectedUnitState(unit);
  };

  return (
    <UnitContext.Provider value={{
      units: items,
      loading,
      error,
      selectedUnit,
      setSelectedUnit,
      refresh,
      addUnit: add,
      updateUnit: update,
      deleteUnit: remove
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
