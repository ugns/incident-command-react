export interface Incident {
  incidentId: string;
  org_id: string;
  name: string;
  description?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  // ...other fields as needed
}
