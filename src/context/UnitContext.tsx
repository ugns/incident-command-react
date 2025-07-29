import React, { createContext, useContext, useState } from 'react';
import { Unit } from '../types/Unit';

interface UnitContextType {
  selectedUnit: Unit | null;
  setSelectedUnit: (unit: Unit | null) => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  return (
    <UnitContext.Provider value={{ selectedUnit, setSelectedUnit }}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = () => {
  const ctx = useContext(UnitContext);
  if (!ctx) throw new Error('useUnit must be used within a UnitProvider');
  return ctx;
};
