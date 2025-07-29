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
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Context
  const { token } = useContext(AuthContext);

  // State
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncidentState] = useState<Incident | null>(() => {
    const stored = localStorage.getItem('selectedIncident');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <IncidentContext.Provider value={{ incidents, loading, error, selectedIncident, setSelectedIncident, refresh: fetchIncidents }}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncident = () => {
  const ctx = useContext(IncidentContext);
  if (!ctx) throw new Error('useIncident must be used within an IncidentProvider');
  return ctx;
};
