import { render, screen } from '@testing-library/react';
import AppNavbar from '../AppNavbar';
import { AuthContext, AuthContextType } from '../../context/AuthContext';
import { IncidentProvider } from '../../context/IncidentContext';
import { PeriodProvider } from '../../context/PeriodContext';
import { UnitProvider } from '../../context/UnitContext';
import { MemoryRouter } from 'react-router-dom';

const mockUser = {
  email: 'test@example.com',
  name: 'Test User',
  sub: '123',
  org_id: 'org1',
  org_name: 'Test Org',
};

const mockAuth: AuthContextType = {
  user: mockUser,
  token: 'fake-token',
  login: jest.fn(),
  logout: jest.fn(),
};

describe('AppNavbar', () => {
  it('renders the navbar', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuth}>
          <IncidentProvider>
            <PeriodProvider>
              <UnitProvider>
                <AppNavbar />
              </UnitProvider>
            </PeriodProvider>
          </IncidentProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
