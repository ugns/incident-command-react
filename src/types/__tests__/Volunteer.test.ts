import type { Volunteer } from '../Volunteer';
import { VolunteerStatus } from '../Volunteer';

describe('Volunteer type', () => {
  it('should allow valid Volunteer objects', () => {
    const volunteer: Volunteer = {
      volunteerId: '1',
      org_id: 'org1',
      name: 'Test User',
      email: 'test@example.com',
      status: VolunteerStatus.CheckedIn
    };
    expect(volunteer.name).toBe('Test User');
    expect(volunteer.status).toBe(VolunteerStatus.CheckedIn);
  });
});
