export enum ActivityLogAction {
  CheckIn = 'checkin',
  CheckOut = 'checkout',
  Dispatch = 'dispatch',
  RadioAssigned = 'assigned',
  RadioReturned = 'returned',
}

export interface ActivityLog {
  logId?: string;
  org_id?: string;
  periodId: string;
  volunteerId: string;
  timestamp?: string;
  action: string;
  location?: string;
  details?: string;
  // ...additional metadata fields as needed
}
