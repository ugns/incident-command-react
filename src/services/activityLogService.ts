import { ActivityLog } from '../types/ActivityLog';
import { apiFetch } from '../api/api';

const activityLogService = {
  async list(token: string): Promise<ActivityLog[]> {
    return apiFetch('/activitylogs', 'GET', undefined, token);
  },
  async listByVolunteer(id: string, token: string): Promise<ActivityLog[]> {
    return apiFetch(`/activitylogs/${id}`, 'GET', undefined, token);
  },
  async create(data: ActivityLog, token: string): Promise<ActivityLog> {
    return apiFetch('/activitylogs', 'POST', data, token);
  },
};

export default activityLogService;
