import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Location } from '../types/Location';
import locationService from '../services/locationService';
import { AuthContext } from './AuthContext';

interface LocationContextType {
  locations: Location[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addLocation: (data: Partial<Location>) => Promise<Location | null>;
  updateLocation: (id: string, data: Partial<Location>) => Promise<Location | null>;
  deleteLocation: (id: string) => Promise<void>;
}

const LocationContext = createContext<LocationContextType>({} as LocationContextType);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Context
  const { token, logout } = useContext(AuthContext);

  // State
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Callbacks
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const data = await locationService.list(token, logout);
      setLocations(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  const addLocation = async (data: Partial<Location>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const newLocation = await locationService.create(data, token, logout);
      await refresh();
      return newLocation;
    } catch (err: any) {
      setError(err.message || 'Failed to add location');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async (id: string, data: Partial<Location>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const loc = await locationService.update(id, data, token, logout);
      await refresh();
      return loc;
    } catch (err: any) {
      setError(err.message || 'Failed to update location');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteLocation = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      await locationService.delete(id, token, logout);
      await refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete location');
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <LocationContext.Provider value={{
      locations,
      loading,
      error,
      refresh,
      addLocation,
      updateLocation,
      deleteLocation
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
