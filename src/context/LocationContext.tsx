import React, { createContext, useContext } from 'react';
import { Location } from '../types/Location';
import locationService from '../services/locationService';
import { AuthContext } from './AuthContext';
import { useCrudResource } from '../hooks/useCrudResource';

interface LocationContextType {
  locations: Location[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addLocation: (data: Partial<Location>) => Promise<Location | null>;
  updateLocation: (id: string, data: Partial<Location>) => Promise<Location | null>;
  deleteLocation: (id: string) => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Context
  const { token, logout } = useContext(AuthContext);

  const { items, loading, error, refresh, add, update, remove } = useCrudResource<Location>(
    locationService,
    token,
    logout
  );

  return (
    <LocationContext.Provider value={{
      locations: items,
      loading,
      error,
      refresh,
      addLocation: add,
      updateLocation: update,
      deleteLocation: remove
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within a LocationProvider');
  return ctx;
};
