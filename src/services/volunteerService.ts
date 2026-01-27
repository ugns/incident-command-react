import { Volunteer } from '../types/Volunteer';
import { apiFetch } from '../api/api';
import { VOLUNTEERS_BASE } from '../constants/apis';
import type { ExportResult, ImportResult } from './types';

const API_BASE = VOLUNTEERS_BASE;

const volunteerService = {
  async list(token: string, onAuthError?: () => void): Promise<Volunteer[]> {
    return apiFetch<Volunteer[]>({
      path: API_BASE,
      token,
      onAuthError,
    });
  },

  async get(id: string, token: string, onAuthError?: () => void): Promise<Volunteer> {
    return apiFetch<Volunteer>({
      path: `${API_BASE}/${id}`,
      token,
      onAuthError,
    });
  },

  async create(data: Partial<Volunteer>, token: string, onAuthError?: () => void): Promise<Volunteer> {
    return apiFetch<Volunteer>({
      path: API_BASE,
      method: 'POST',
      body: data,
      token,
      onAuthError,
    });
  },

  async update(id: string, data: Partial<Volunteer>, token: string, onAuthError?: () => void): Promise<Volunteer> {
    return apiFetch<Volunteer>({
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

  async export(token: string, onAuthError?: () => void): Promise<ExportResult> {
    return apiFetch<ExportResult>({
      path: `${API_BASE}/export`,
      token,
      onAuthError,
      responseType: 'blob',
      accept: 'text/csv',
    });
  },

  async import(file: File, token: string, onAuthError?: () => void): Promise<ImportResult> {
    return apiFetch<ImportResult>({
      path: `${API_BASE}/import`,
      method: 'POST',
      body: file,
      token,
      onAuthError,
      json: false,
      contentType: 'text/csv',
    });
  },
};

export default volunteerService;
