import React, { createContext, useContext, useState } from 'react';
import { Incident } from '../types/Incident';

interface IncidentContextType {
  selectedIncident: Incident | null;
  setSelectedIncident: (incident: Incident | null) => void;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  return (
    <IncidentContext.Provider value={{ selectedIncident, setSelectedIncident }}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncident = () => {
  const ctx = useContext(IncidentContext);
  if (!ctx) throw new Error('useIncident must be used within an IncidentProvider');
  return ctx;
};
