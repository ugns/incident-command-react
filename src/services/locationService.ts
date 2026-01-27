import { apiFetch } from '../api/api';
import { Location } from '../types/Location';
import { LOCATIONS_BASE } from '../constants/apis';
import type { ExportResult, ImportResult } from './types';

const locationService = {
  async list(token: string, onAuthError?: () => void): Promise<Location[]> {
    return apiFetch<Location[]>({
      path: LOCATIONS_BASE,
      token,
      onAuthError,
    });
  },

  async get(id: string, token: string, onAuthError?: () => void): Promise<Location> {
    return apiFetch<Location>({
      path: `${LOCATIONS_BASE}/${id}`,
      token,
      onAuthError,
    });
  },

  async create(data: Partial<Location>, token: string, onAuthError?: () => void): Promise<Location> {
    return apiFetch<Location>({
      path: LOCATIONS_BASE,
      method: 'POST',
      body: data,
      token,
      onAuthError,
    });
  },

  async update(id: string, data: Partial<Location>, token: string, onAuthError?: () => void): Promise<Location> {
    return apiFetch<Location>({
      path: `${LOCATIONS_BASE}/${id}`,
      method: 'PUT',
      body: data,
      token,
      onAuthError,
    });
  },

  async delete(id: string, token: string, onAuthError?: () => void): Promise<void> {
    return apiFetch<void>({
      path: `${LOCATIONS_BASE}/${id}`,
      method: 'DELETE',
      token,
      onAuthError,
    });
  },

  async export(token: string, onAuthError?: () => void): Promise<ExportResult> {
    return apiFetch<ExportResult>({
      path: `${LOCATIONS_BASE}/export`,
      token,
      onAuthError,
      responseType: 'blob',
      accept: 'text/csv',
    });
  },

  async import(file: File, token: string, onAuthError?: () => void): Promise<ImportResult> {
    return apiFetch<ImportResult>({
      path: `${LOCATIONS_BASE}/import`,
      method: 'POST',
      body: file,
      token,
      onAuthError,
      json: false,
      contentType: 'text/csv',
    });
  },
};

export default locationService;
