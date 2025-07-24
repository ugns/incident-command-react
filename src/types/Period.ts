export interface Period {
  periodId: string;
  org_id: string;
  incidentName?: string; // Section 1
  startTime: string; // Section 2
  endTime: string; // Section 2
  name?: string; // Section 3
  icsPosition?: string; // Section 4
  homeAgency?: string; // Section 5
  description: string;
}