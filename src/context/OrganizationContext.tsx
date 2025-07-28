import React, { createContext, useContext, useState, useEffect } from 'react';
import { Organization } from '../types/Organization';
import organizationService from '../services/organizationService';
import { AuthContext } from './AuthContext';

interface OrganizationContextType {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addOrganization: (data: Partial<Organization>) => Promise<Organization | null>;
  updateOrganization: (id: string, data: Partial<Organization>) => Promise<Organization | null>;
  deleteOrganization: (id: string) => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganizations = () => {
  const ctx = useContext(OrganizationContext);
  if (!ctx) throw new Error('useOrganizations must be used within a OrganizationProvider');
  return ctx;
};

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useContext(AuthContext);

  // Fetch organizations from API
  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || '';
      const data = await organizationService.list(token, logout);
      setOrganizations(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Initial fetch
  useEffect(() => {
    refresh();
  }, [refresh]);

  const addOrganization = async (data: Partial<Organization>) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || '';
      const newOrganization = await organizationService.create(data, token, logout);
      await refresh();
      return newOrganization;
    } catch (err: any) {
      setError(err.message || 'Failed to add organization');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrganization = async (id: string, data: Partial<Organization>) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || '';
      const updated = await organizationService.update(id, data, token, logout);
      await refresh();
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update organization');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrganization = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || '';
      await organizationService.delete(id, token, logout);
      await refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrganizationContext.Provider value={{ organizations, loading, error, refresh, addOrganization, updateOrganization, deleteOrganization }}>
      {children}
    </OrganizationContext.Provider>
  );
};
