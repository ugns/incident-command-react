import { ActivityLog } from '../types/ActivityLog';
import { apiFetch } from '../api/api';
import { ACTIVITYLOGS_BASE } from '../constants/apis';

const API_BASE = ACTIVITYLOGS_BASE;

const activityLogService = {
  async list(token: string, onAuthError?: () => void): Promise<ActivityLog[]> {
    return apiFetch<ActivityLog[]>({
      path: API_BASE,
      token,
      onAuthError,
    });
  },

  // List activity logs by volunteer ID using Global Secondary Index
  async listByVolunteer(id: string, token: string, onAuthError?: () => void): Promise<ActivityLog[]> {
    return apiFetch<ActivityLog[]>({
      path: `${API_BASE}/volunteer/${id}`,
      token,
      onAuthError,
    });
  },

  // No get method as ActivityLog is immutable

  async create(data: Partial<ActivityLog>, token: string, onAuthError?: () => void): Promise<ActivityLog> {
    return apiFetch<ActivityLog>({
      path: API_BASE,
      method: 'POST',
      body: data,
      token,
      onAuthError,
    });
  },

  // No update method as ActivityLog is immutable

  // No delete method as ActivityLog is immutable
};

export default activityLogService;
