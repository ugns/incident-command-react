import { Volunteer } from '../types/Volunteer';
import { apiFetch } from '../api/api';

const volunteerService = {
  async list(token: string, onAuthError?: () => void): Promise<Volunteer[]> {
    return apiFetch<Volunteer[]>({
      path: '/volunteers',
      token,
      onAuthError,
    });
  },

  async get(id: string, token: string, onAuthError?: () => void): Promise<Volunteer> {
    return apiFetch<Volunteer>({
      path: `/volunteers/${id}`,
      token,
      onAuthError,
    });
  },

  async create(data: Partial<Volunteer>, token: string, onAuthError?: () => void): Promise<Volunteer> {
    return apiFetch<Volunteer>({
      path: '/volunteers',
      method: 'POST',
      body: data,
      token,
      onAuthError,
    });
  },

  async update(id: string, data: Partial<Volunteer>, token: string, onAuthError?: () => void): Promise<Volunteer> {
    return apiFetch<Volunteer>({
      path: `/volunteers/${id}`,
      method: 'PUT',
      body: data,
      token,
      onAuthError,
    });
  },
  
  async delete(id: string, token: string, onAuthError?: () => void): Promise<void> {
    await apiFetch<void>({
      path: `/volunteers/${id}`,
      method: 'DELETE',
      token,
      onAuthError,
    });
  },
};

export default volunteerService;
