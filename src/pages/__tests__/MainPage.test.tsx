import { render, screen } from '@testing-library/react';
import MainPage from '../MainPage';
import { AuthContext, AuthContextType } from '../../context/AuthContext';
import { MemoryRouter } from 'react-router';

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

describe('MainPage', () => {
  it('renders the main page with org name', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuth}>
          <MainPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Test Org/i)).toBeInTheDocument();
  });
});
