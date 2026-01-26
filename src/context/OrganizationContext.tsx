import React, { createContext, useContext } from 'react';
import { Organization } from '../types/Organization';
import organizationService from '../services/organizationService';
import { AuthContext } from './AuthContext';
import { useCrudResource } from '../hooks/useCrudResource';

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

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Context
  const { token, logout } = useContext(AuthContext);

  const { items, loading, error, refresh, add, update, remove } = useCrudResource<Organization>(
    organizationService,
    token,
    logout
  );

  // Provider
  return (
    <OrganizationContext.Provider value={{ 
      organizations: items, 
      loading, 
      error, 
      refresh, 
      addOrganization: add, 
      updateOrganization: update, 
      deleteOrganization: remove 
    }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganizations = () => {
  const ctx = useContext(OrganizationContext);
  if (!ctx) throw new Error('useOrganizations must be used within a OrganizationProvider');
  return ctx;
};
