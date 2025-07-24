import { Period } from '../types/Period';
import { apiFetch } from '../api/api';

const periodService = {
  async list(token: string): Promise<Period[]> {
    return apiFetch('/ics214/periods', 'GET', undefined, token);
  },
  async get(id: string, token: string): Promise<Period> {
    return apiFetch(`/ics214/periods/${id}`, 'GET', undefined, token);
  },
  async create(data: Partial<Period>, token: string): Promise<Period> {
    return apiFetch('/ics214/periods', 'POST', data, token);
  },
  async update(id: string, data: Partial<Period>, token: string): Promise<Period> {
    return apiFetch(`/ics214/periods/${id}`, 'PUT', data, token);
  },
  async delete(id: string, token: string): Promise<void> {
    await apiFetch(`/ics214/periods/${id}`, 'DELETE', undefined, token);
  },
};

export default periodService;
