import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { PlayerProvider } from '../context/PlayerContext';
import { ThemeProvider } from '../context/ThemeContext';

// Mock contexts to provide data without fetching
jest.mock('../context/PlayerContext', () => ({
  usePlayer: () => ({
    currentUser: { id: 1, name: 'Test User', position: 'Forward' },
  }),
  PlayerProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('../context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
  ThemeProvider: ({ children }) => <div>{children}</div>,
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Mock global.fetch
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders dashboard with user name', async () => {
    render(
      <ThemeProvider>
        <PlayerProvider>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </PlayerProvider>
      </ThemeProvider>
    );

    // Check for the user name from the mocked context
    // We use waitFor because the component might have a loading state initially
    await waitFor(() => {
      expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    });
  });
});
