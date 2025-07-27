import { ActivityLog } from '../types/ActivityLog';
import { apiFetch } from '../api/api';

const activityLogService = {
  async list(token: string, onAuthError?: () => void): Promise<ActivityLog[]> {
    return apiFetch<ActivityLog[]>({
      path: '/activitylogs',
      token,
      onAuthError,
    });
  },
  async listByVolunteer(id: string, token: string, onAuthError?: () => void): Promise<ActivityLog[]> {
    return apiFetch<ActivityLog[]>({
      path: `/activitylogs/volunteer/${id}`,
      token,
      onAuthError,
    });
  },
  async create(data: Partial<ActivityLog>, token: string, onAuthError?: () => void): Promise<ActivityLog> {
    return apiFetch<ActivityLog>({
      path: '/activitylogs',
      method: 'POST',
      body: data,
      token,
      onAuthError,
    });
  },
};

export default activityLogService;
