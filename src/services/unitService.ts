import { Unit } from '../types/Unit';
import { apiFetch } from '../api/api';

const unitService = {
  async list(token: string, onAuthError?: () => void): Promise<Unit[]> {
    return apiFetch<Unit[]>({
      path: '/units',
      token,
      onAuthError,
    });
  },

  async get(id: string, token: string, onAuthError?: () => void): Promise<Unit> {
    return apiFetch<Unit>({
      path: `/units/${id}`,
      token,
      onAuthError,
    });
  },

  async create(data: Partial<Unit>, token: string, onAuthError?: () => void): Promise<Unit> {
    return apiFetch<Unit>({
      path: '/units',
      method: 'POST',
      body: data,
      token,
      onAuthError,
    });
  },

  async update(id: string, data: Partial<Unit>, token: string, onAuthError?: () => void): Promise<Unit> {
    return apiFetch<Unit>({
      path: `/units/${id}`,
      method: 'PUT',
      body: data,
      token,
      onAuthError,
    });
  },

  async delete(id: string, token: string, onAuthError?: () => void): Promise<void> {
    await apiFetch<void>({
      path: `/units/${id}`,
      method: 'DELETE',
      token,
      onAuthError,
    });
  },
};

export default unitService;
