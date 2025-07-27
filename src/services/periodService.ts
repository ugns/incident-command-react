import { Period } from '../types/Period';
import { apiFetch } from '../api/api';

const periodService = {
  async list(token: string, onAuthError?: () => void): Promise<Period[]> {
    return apiFetch<Period[]>({
      path: '/periods',
      method: 'GET',
      token,
      responseType: 'json',
      onAuthError,
    });
  },
  async get(id: string, token: string, onAuthError?: () => void): Promise<Period> {
    return apiFetch<Period>({
      path: `/periods/${id}`,
      method: 'GET',
      token,
      onAuthError,
    });
  },
  async create(data: Partial<Period>, token: string, onAuthError?: () => void): Promise<Period> {
    return apiFetch<Period>({
      path: '/periods',
      method: 'POST',
      body: data,
      token,
      onAuthError,
    });
  },
  async update(id: string, data: Partial<Period>, token: string, onAuthError?: () => void): Promise<Period> {
    return apiFetch<Period>({
      path: `/periods/${id}`,
      method: 'PUT',
      body: data,
      token,
      onAuthError,
    });
  },
  async delete(id: string, token: string, onAuthError?: () => void): Promise<void> {
    await apiFetch<void>({
      path: `/periods/${id}`,
      method: 'DELETE',
      token,
      onAuthError,
    });
  },
};

export default periodService;
