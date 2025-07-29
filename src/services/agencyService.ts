// agencyService.ts - API service for Agency CRUD operations
import { Agency } from '../types/Agency';
import { apiFetch } from '../api/api';

const API_BASE = '/agency';

const agencyService = {
  async list(token: string, onAuthError?: () => void): Promise<Agency[]> {
    return apiFetch<Agency[]>({
      path: API_BASE,
      token,
      onAuthError,
    });
  },

  async get(id: string, token: string, onAuthError?: () => void): Promise<Agency> {
    return apiFetch<Agency>({
      path: `${API_BASE}/${id}`,
      token,
      onAuthError,
    });
  },

  async create(data: Partial<Agency>, token: string, onAuthError?: () => void): Promise<Agency> {
    return apiFetch<Agency>({
      path: `${API_BASE}`,
      method: 'POST',
      body: data,
      token,
      onAuthError,
    });
  },


  async update(id: string, data: Partial<Agency>, token: string, onAuthError?: () => void): Promise<Agency> {
    return apiFetch<Agency>({
      path: `${API_BASE}/${id}`,
      method: 'PUT',
      body: data,
      token,
      onAuthError,
    });
  },


  async delete(id: string, token: string, onAuthError?: () => void): Promise<Agency> {
    return apiFetch<Agency>({
      path: `${API_BASE}/${id}`,
      method: 'DELETE',
      token,
      onAuthError,
    });
  },
};

export default agencyService;
