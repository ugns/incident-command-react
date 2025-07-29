
export enum VolunteerStatus {
  CheckedIn = 'checked_in',
  CheckedOut = 'checked_out',
  Dispatched = 'dispatched',
}

export interface Volunteer {
  volunteerId: string;
  org_id: string;
  name: string;
  familyName?: string;
  givenName?: string;
  email: string;
  cellphone?: string;
  icsPosition?: string;
  homeAgency?: string;
  status?: VolunteerStatus;
  callsign?: string;
  radio?: string; // radioId
  currentLocation?: string;
  notes?: string;
}
