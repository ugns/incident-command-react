import React, { createContext, useContext, useState, useEffect } from 'react';
import { Volunteer } from '../types/Volunteer';
import volunteerService from '../services/volunteerService';
import { AuthContext } from './AuthContext';

interface VolunteerContextType {
  volunteers: Volunteer[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addVolunteer: (data: Partial<Volunteer>) => Promise<Volunteer | null>;
  updateVolunteer: (id: string, data: Partial<Volunteer>) => Promise<Volunteer | null>;
  deleteVolunteer: (id: string) => Promise<void>;
}

const VolunteerContext = createContext<VolunteerContextType | undefined>(undefined);

export const VolunteerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Context
  const { token, logout } = useContext(AuthContext);

  // State
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Callbacks
  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const data = await volunteerService.list(token, logout);
      setVolunteers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch volunteers');
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  const addVolunteer = async (data: Partial<Volunteer>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const newVolunteer = await volunteerService.create(data, token, logout);
      await refresh();
      return newVolunteer;
    } catch (err: any) {
      setError(err.message || 'Failed to add volunteer');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateVolunteer = async (id: string, data: Partial<Volunteer>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const updated = await volunteerService.update(id, data, token, logout);
      await refresh();
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update volunteer');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteVolunteer = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      await volunteerService.delete(id, token, logout);
      await refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete volunteer');
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
    <VolunteerContext.Provider value={{ 
      volunteers, 
      loading, 
      error, 
      refresh, 
      addVolunteer, 
      updateVolunteer, 
      deleteVolunteer 
   }}>
      {children}
    </VolunteerContext.Provider>
  );
};

export const useVolunteers = () => {
  const ctx = useContext(VolunteerContext);
  if (!ctx) throw new Error('useVolunteers must be used within a VolunteerProvider');
  return ctx;
};
