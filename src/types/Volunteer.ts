export enum VolunteerStatus {
  CheckedIn = 'checked_in',
  CheckedOut = 'checked_out',
  Dispatched = 'dispatched',
}

export enum RadioStatus {
  Assigned = 'assigned',
  Returned = 'returned',
}

export interface Volunteer {
  volunteerId: string;
  org_id: string;
  name: string; // Section 6
  familyName?: string;
  givenName?: string;
  email: string;
  cellphone?: string;
  icsPosition?: string; // Section 6
  homeAgency?: string; // Section 6
  status?: string;
  callsign?: string;
  radio?: string;
  radioStatus?: string;
  currentLocation?: string;
  notes?: string;
}
