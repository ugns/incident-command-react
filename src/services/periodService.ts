import { Period } from '../types/Period';
import { apiFetch } from '../api/api';

const periodService = {
  async list(token: string): Promise<Period[]> {
    return apiFetch('/periods', 'GET', undefined, token);
  },
  async get(id: string, token: string): Promise<Period> {
    return apiFetch(`/periods/${id}`, 'GET', undefined, token);
  },
  async create(data: Partial<Period>, token: string): Promise<Period> {
    return apiFetch('/periods', 'POST', data, token);
  },
  async update(id: string, data: Partial<Period>, token: string): Promise<Period> {
    return apiFetch(`/periods/${id}`, 'PUT', data, token);
  },
  async delete(id: string, token: string): Promise<void> {
    await apiFetch(`/periods/${id}`, 'DELETE', undefined, token);
  },
};

export default periodService;
