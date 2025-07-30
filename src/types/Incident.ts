export interface Incident {
  incidentId: string;
  org_id: string;
  name: string;
  description?: string;
  notes?: string;
  // ...other fields as needed
}
