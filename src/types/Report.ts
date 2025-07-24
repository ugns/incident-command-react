import { Period } from './Period';
import { ActivityLog } from './ActivityLog';
import { Volunteer } from './Volunteer';
import { User } from './User';

export interface Report {
  period: Period;
  activityLogs: ActivityLog[];
  volunteers?: Volunteer[];
  preparedBy: User;
  positionTitle: string;
}
