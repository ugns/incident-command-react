import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Incident } from '../types/Incident';
import incidentService from '../services/incidentService';
import { AuthContext } from './AuthContext';
import { useCrudResource } from '../hooks/useCrudResource';

interface IncidentContextType {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
  selectedIncident: Incident | null;
  setSelectedIncident: (incident: Incident | null) => void;
  refresh: () => Promise<void>;
  addIncident: (data: Partial<Incident>) => Promise<Incident | null>;
  updateIncident: (id: string, data: Partial<Incident>) => Promise<Incident | null>;
  deleteIncident: (id: string) => Promise<void>;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Context
  const { token, logout } = useContext(AuthContext);

  // State
  const [selectedIncident, setSelectedIncidentState] = useState<Incident | null>(() => {
    const stored = localStorage.getItem('selectedIncident');
    return stored ? JSON.parse(stored) : null;
  });

  const handleList = useCallback((data: Incident[]) => {
    // Validate selectedIncident after fetching
    setSelectedIncidentState(prev => {
      if (!prev) return null;
      const found = data.find(i => i.incidentId === prev.incidentId);
      return found || null;
    });
  }, []);

  const crudOptions = useMemo(() => ({
    skipIfNoToken: true,
    onList: handleList,
  }), [handleList]);

  const { items, loading, error, refresh, add, update, remove } = useCrudResource<Incident>(
    incidentService,
    token,
    logout,
    crudOptions
  );

  useEffect(() => {
    // Only persist if selectedIncident is in incidents
    if (selectedIncident && items.some(i => i.incidentId === selectedIncident.incidentId)) {
      localStorage.setItem('selectedIncident', JSON.stringify(selectedIncident));
    } else {
      localStorage.removeItem('selectedIncident');
    }
  }, [selectedIncident, items]);

  // Provider
  const setSelectedIncident = (incident: Incident | null) => {
    setSelectedIncidentState(incident);
  };

  return (
    <IncidentContext.Provider value={{
      incidents: items,
      loading,
      error,
      selectedIncident,
      setSelectedIncident,
      refresh,
      addIncident: add,
      updateIncident: update,
      deleteIncident: remove
    }}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncident = () => {
  const ctx = useContext(IncidentContext);
  if (!ctx) throw new Error('useIncident must be used within an IncidentProvider');
  return ctx;
};
