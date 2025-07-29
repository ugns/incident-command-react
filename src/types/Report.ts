import { Period } from './Period';
import { ActivityLog } from './ActivityLog';
import { Volunteer } from './Volunteer';
import { User } from './User';

export enum ReportType {
  ICS214 = 'ics214',
}

export interface Report {
  period: Period;
  activityLogs: ActivityLog[];
  volunteers?: Volunteer[];
  preparedBy: User;
  positionTitle: string;
}
