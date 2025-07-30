import { Period } from '../types/Period';
import { apiFetch } from '../api/api';
import { PERIODS_BASE } from '../constants/apis';

const API_BASE = PERIODS_BASE;

const periodService = {
  async list(token: string, onAuthError?: () => void): Promise<Period[]> {
    return apiFetch<Period[]>({
      path: API_BASE,
      token,
      onAuthError,
    });
  },
  async get(id: string, token: string, onAuthError?: () => void): Promise<Period> {
    return apiFetch<Period>({
      path: `${API_BASE}/${id}`,
      token,
      onAuthError,
    });
  },
  async create(data: Partial<Period>, token: string, onAuthError?: () => void): Promise<Period> {
    return apiFetch<Period>({
      path: API_BASE,
      method: 'POST',
      body: data,
      token,
      onAuthError,
    });
  },
  async update(id: string, data: Partial<Period>, token: string, onAuthError?: () => void): Promise<Period> {
    return apiFetch<Period>({
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

export default periodService;
