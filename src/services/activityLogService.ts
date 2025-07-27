import { ActivityLog } from '../types/ActivityLog';
import { apiFetch } from '../api/api';

const activityLogService = {
  async list(token: string, onAuthError?: () => void): Promise<ActivityLog[]> {
    return apiFetch<ActivityLog[]>({
      path: '/activity-log',
      method: 'GET',
      token,
      responseType: 'json',
      onAuthError,
    });
  },
  async listByVolunteer(id: string, token: string, onAuthError?: () => void): Promise<ActivityLog[]> {
    return apiFetch<ActivityLog[]>({
      path: `/activity-log/volunteer/${id}`,
      method: 'GET',
      token,
      responseType: 'json',
      onAuthError,
    });
  },
  async create(data: Partial<ActivityLog>, token: string, onAuthError?: () => void): Promise<ActivityLog> {
    return apiFetch<ActivityLog>({
      path: '/activity-log',
      method: 'POST',
      body: data,
      token,
      onAuthError,
    });
  },
};

export default activityLogService;
