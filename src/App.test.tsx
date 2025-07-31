import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('renders without crashing', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  // Optionally, check for something you know is always present:
  expect(screen.getByText(/EventCoord/i)).toBeInTheDocument();
});
