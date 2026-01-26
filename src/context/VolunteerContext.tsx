import React, { createContext, useContext } from 'react';
import { Volunteer } from '../types/Volunteer';
import volunteerService from '../services/volunteerService';
import { AuthContext } from './AuthContext';
import { useCrudResource } from '../hooks/useCrudResource';

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

  const { items, loading, error, refresh, add, update, remove } = useCrudResource<Volunteer>(
    volunteerService,
    token,
    logout
  );

  // Provider
  return (
    <VolunteerContext.Provider value={{ 
      volunteers: items, 
      loading, 
      error, 
      refresh, 
      addVolunteer: add, 
      updateVolunteer: update, 
      deleteVolunteer: remove 
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
