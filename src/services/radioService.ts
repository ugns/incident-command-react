import { apiFetch } from '../api/api';
import { Radio } from '../types/Radio';
import { RADIOS_BASE } from '../constants/apis';

const API_BASE = RADIOS_BASE;

const radioService = {
  async list(token: string, onAuthError?: () => void): Promise<Radio[]> {
    return apiFetch<Radio[]>({ 
      path: API_BASE, 
      token,
      onAuthError,
    });
  },

  async get(id: string, token: string, onAuthError?: () => void): Promise<Radio> {
    return apiFetch<Radio>({ 
      path: `${API_BASE}/${id}`, 
      token,
      onAuthError
    });
  },

  async create(data: Partial<Radio>, token: string, onAuthError?: () => void): Promise<Radio> {
    return apiFetch<Radio>({ 
      path: API_BASE, 
      method: 'POST', 
      body: data, 
      token,
      onAuthError
    });
  },

  async update(id: string, data: Partial<Radio>, token: string, onAuthError?: () => void): Promise<Radio> {
    return apiFetch<Radio>({ 
      path: `${API_BASE}/${id}`, 
      method: 'PUT', 
      body: data, 
      token,
      onAuthError
    });
  },

  async remove(id: string, token: string, onAuthError?: () => void): Promise<void> {
    return apiFetch<void>({ 
      path: `${API_BASE}/${id}`, 
      method: 'DELETE', 
      token,
      onAuthError
    });
  },
};

export default radioService;
