export interface Period {
  periodId: string;
  org_id: string;
  incidentId: string; // NEW: link to parent incident
  unitId: string; // NEW: link to parent unit
  startTime: string; // Section 2
  endTime: string; // Section 2
  name?: string; // Section 3
  icsPosition?: string; // Section 4
  homeAgency?: string; // Section 5
  description: string;
  notes?: string; //
}