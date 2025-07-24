export interface Period {
  periodId: string;
  org_id: string;
  startTime: string;
  endTime: string;
  description: string;
  name?: string; // Section 3
  icsPosition?: string; // Section 4
  homeAgency?: string; // Section 5
}