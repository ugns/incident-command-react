import { Organization } from '../types/Organization';
import { apiFetch } from '../api/api';
import { ORGANIZATIONS_BASE } from '../constants/apis';

const API_BASE = ORGANIZATIONS_BASE;

const organizationService = {
  async list(token: string, onAuthError?: () => void): Promise<Organization[]> {
    return apiFetch<Organization[]>({
      path: API_BASE,
      token,
      onAuthError,
    });
  },

  async get(id: string, token: string, onAuthError?: () => void): Promise<Organization> {
    return apiFetch<Organization>({
      path: `${API_BASE}/${id}`,
      token,
      onAuthError,
    });
  },

  async create(data: Partial<Organization>, token: string, onAuthError?: () => void): Promise<Organization> {
    return apiFetch<Organization>({
      path: API_BASE,
      method: 'POST',
      body: data,
      token,
      onAuthError,
    });
  },

  async update(id: string, data: Partial<Organization>, token: string, onAuthError?: () => void): Promise<Organization> {
    return apiFetch<Organization>({
      path: `${API_BASE}/${id}`,
      method: 'PUT',
      body: data,
      token,
      onAuthError,
    });
  },
  
  async delete(id: string, token: string, onAuthError?: () => void): Promise<void> {
    await apiFetch<void>({
      path: `${API_BASE}/${id}`,
      method: 'DELETE',
      token,
      onAuthError,
    });
  },
};

export default organizationService;
