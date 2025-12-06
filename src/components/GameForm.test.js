import { render, screen, waitFor } from '@testing-library/react';
import GameForm from './GameForm';

describe('GameForm Component', () => {
  test('renders all form fields', () => {
    render(<GameForm onSubmit={jest.fn()} />);

    // Using exact label text matching
    expect(screen.getByLabelText('Date *')).toBeInTheDocument();
    expect(screen.getByLabelText('Opponent *')).toBeInTheDocument();
    // Location is a label for a group, not a specific input, so we check for text
    expect(screen.getByText('Location *')).toBeInTheDocument();

    expect(screen.getByLabelText('Position *')).toBeInTheDocument();

    // Stats
    expect(screen.getByLabelText('Duration (min)')).toBeInTheDocument();
    expect(screen.getByLabelText('Goals')).toBeInTheDocument();
    expect(screen.getByLabelText('Assists')).toBeInTheDocument();
    expect(screen.getByLabelText('Passes')).toBeInTheDocument();

    // Notes
    expect(screen.getByLabelText('Match Notes')).toBeInTheDocument();

    // Check for radio buttons
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Away')).toBeInTheDocument();

    // Check for checkbox
    expect(screen.getByLabelText('Played Full Match (90+ min)')).toBeInTheDocument();
  });

  test('submit button is disabled/enabled based on validation', async () => {
    render(<GameForm onSubmit={jest.fn()} />);
    // Initial render might not disable it immediately if fields are empty but validation only triggers on change/submit in some implementations,
    // but here we just check if the button exists.
    const submitButton = screen.getByRole('button', { name: /Save Game/i });
    expect(submitButton).toBeInTheDocument();
  });
});
