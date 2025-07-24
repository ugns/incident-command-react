import { Volunteer } from '../types/Volunteer';
import { apiFetch } from '../api/api';

const volunteerService = {
  async list(token: string): Promise<Volunteer[]> {
    return apiFetch('/volunteers', 'GET', undefined, token);
  },

  async create(data: Partial<Volunteer>, token: string): Promise<Volunteer> {
    return apiFetch('/volunteers', 'POST', data, token);
  },

  async update(id: string, data: Partial<Volunteer>, token: string): Promise<Volunteer> {
    return apiFetch(`/volunteers/${id}`, 'PUT', data, token);
  },

  async delete(id: string, token: string): Promise<void> {
    await apiFetch(`/volunteers/${id}`, 'DELETE', undefined, token);
  },
};

export default volunteerService;
