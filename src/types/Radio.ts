// Radio model/type for use across the app


export enum RadioStatus {
  Available = 'available',
  Assigned = 'assigned',
  Maintenance = 'maintenance',
  Retired = 'retired',
}

export interface Radio {
  org_id: string; // Organization ID for ownership context
  radioId: string;
  name: string;
  serialNumber?: string;
  assignedToVolunteerId?: string;
  status?: RadioStatus;
  hostAgency?: string; // Agency that owns/loans the radio
  notes?: string;
  // Add more fields as needed
}
