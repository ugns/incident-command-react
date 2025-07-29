// Radio model/type for use across the app


export enum RadioStatus {
  Available = 'available',
  Assigned = 'assigned',
  Maintenance = 'maintenance',
  Retired = 'retired',
}

export interface Radio {
  radioId: string;
  name: string;
  serialNumber?: string;
  assignedToVolunteerId?: string;
  status?: RadioStatus;
  hostAgency?: string; // Agency that owns/loans the radio
  notes?: string;
  // Add more fields as needed
}
