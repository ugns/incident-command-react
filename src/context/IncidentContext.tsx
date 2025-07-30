import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Incident } from '../types/Incident';
import incidentService from '../services/incidentService';
import { AuthContext } from './AuthContext';

interface IncidentContextType {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
  selectedIncident: Incident | null;
  setSelectedIncident: (incident: Incident | null) => void;
  refresh: () => void;
  addIncident: (data: Partial<Incident>) => Promise<Incident | null>;
  updateIncident: (id: string, data: Partial<Incident>) => Promise<Incident | null>;
  deleteIncident: (id: string) => Promise<void>;
}   

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Context
  const { token, logout } = useContext(AuthContext);

  // State
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncidentState] = useState<Incident | null>(() => {
    const stored = localStorage.getItem('selectedIncident');
    return stored ? JSON.parse(stored) : null;
  });

  // Callbacks
  const fetchIncidents = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await incidentService.list(token);
      setIncidents(data);
      // Validate selectedIncident after fetching
      setSelectedIncidentState(prev => {
        if (!prev) return null;
        const found = data.find(i => i.incidentId === prev.incidentId);
        return found || null;
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  }, [token]);

    const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const data = await incidentService.list(token, logout);
      setIncidents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  const addIncident = async (data: Partial<Incident>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const newIncident = await incidentService.create(data, token, logout);
      await refresh();
      return newIncident;
    } catch (err: any) {
      setError(err.message || 'Failed to add incident');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateIncident = async (id: string, data: Partial<Incident>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const updated = await incidentService.update(id, data, token, logout);
      await refresh();
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update incident');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteIncident = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      await incidentService.delete(id, token, logout);
      await refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete incident');
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [fetchIncidents]);

  useEffect(() => {
    // Only persist if selectedIncident is in incidents
    if (selectedIncident && incidents.some(i => i.incidentId === selectedIncident.incidentId)) {
      localStorage.setItem('selectedIncident', JSON.stringify(selectedIncident));
    } else {
      localStorage.removeItem('selectedIncident');
    }
  }, [selectedIncident, incidents]);

  // Provider
  const setSelectedIncident = (incident: Incident | null) => {
    setSelectedIncidentState(incident);
  };

  return (
    <IncidentContext.Provider value={{
      incidents,
      loading,
      error,
      selectedIncident,
      setSelectedIncident,
      refresh,
      addIncident,
      updateIncident,
      deleteIncident
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
