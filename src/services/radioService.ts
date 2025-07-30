import { apiFetch } from '../api/api';
import { Radio } from '../types/Radio';
import { RADIOS_BASE } from '../constants/apis';

const API_BASE = RADIOS_BASE;

const radioService = {
  async list(token: string, onAuthError?: () => void): Promise<Radio[]> {
    return apiFetch({ 
      path: API_BASE, 
      token,
      onAuthError,
    });
  },
  async get(id: string, token: string, onAuthError?: () => void): Promise<Radio> {
    return apiFetch({ 
      path: `${API_BASE}/${id}`, 
      token,
      onAuthError
    });
  },
  async create(data: Partial<Radio>, token: string, onAuthError?: () => void): Promise<Radio> {
    return apiFetch({ 
      path: API_BASE, 
      method: 'POST', 
      body: data, 
      token,
      onAuthError
    });
  },
  async update(id: string, radio: Partial<Radio>, token: string, onAuthError?: () => void): Promise<Radio> {
    return apiFetch({ 
      path: `${API_BASE}/${id}`, 
      method: 'PUT', 
      body: radio, 
      token,
      onAuthError
    });
  },
  async remove(id: string, token: string, onAuthError?: () => void): Promise<void> {
    return apiFetch({ 
      path: `${API_BASE}/${id}`, 
      method: 'DELETE', 
      token,
      onAuthError
    });
  },
};

export default radioService;
