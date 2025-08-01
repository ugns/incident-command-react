import { Unit } from '../types/Unit';
import { apiFetch } from '../api/api';
import { UNITS_BASE } from '../constants/apis';

const API_BASE = UNITS_BASE;

const unitService = {
  async list(token: string, onAuthError?: () => void): Promise<Unit[]> {
    return apiFetch<Unit[]>({
      path: API_BASE,
      token,
      onAuthError,
    });
  },

  async get(id: string, token: string, onAuthError?: () => void): Promise<Unit> {
    return apiFetch<Unit>({
      path: `${API_BASE}/${id}`,
      token,
      onAuthError,
    });
  },

  async create(data: Partial<Unit>, token: string, onAuthError?: () => void): Promise<Unit> {
    return apiFetch<Unit>({
      path: API_BASE,
      method: 'POST',
      body: data,
      token,
      onAuthError,
    });
  },

  async update(id: string, data: Partial<Unit>, token: string, onAuthError?: () => void): Promise<Unit> {
    return apiFetch<Unit>({
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

export default unitService;
