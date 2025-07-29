// Location model/type for use with AssignmentBoard and other features


export enum LocationStatus {
  Active = 'active',
  Inactive = 'inactive',
  Archived = 'archived',
}

export interface Location {
  locationId: string;
  org_id: string;
  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  unitId?: string;
  status?: LocationStatus;
  // ...other fields as needed
}
