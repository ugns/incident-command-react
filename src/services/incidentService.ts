import { Incident } from '../types/Incident';
import { apiFetch } from '../api/api';
import { INCIDENTS_BASE } from '../constants/apis';
import type { ExportResult } from './types';

const API_BASE = INCIDENTS_BASE;

const incidentService = {
  async list(token: string, onAuthError?: () => void): Promise<Incident[]> {
    return apiFetch<Incident[]>({
      path: API_BASE,
      token,
      onAuthError,
    });
  },

  async get(id: string, token: string, onAuthError?: () => void): Promise<Incident> {
    return apiFetch<Incident>({
      path: `${API_BASE}/${id}`,
      token,
      onAuthError,
    });
  },

  async create(data: Partial<Incident>, token: string, onAuthError?: () => void): Promise<Incident> {
    return apiFetch<Incident>({
      path: API_BASE,
      method: 'POST',
      body: data,
      token,
      onAuthError,
    });
  },

  async update(id: string, data: Partial<Incident>, token: string, onAuthError?: () => void): Promise<Incident> {
    return apiFetch<Incident>({
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
};

export default incidentService;
