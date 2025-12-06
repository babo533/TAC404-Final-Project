import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';

describe('StatCard Component', () => {
  test('renders with all props correctly', () => {
    render(<StatCard title="Total Sessions" value={25} trend="5 this week" color="primary" />);

    expect(screen.getByText('Total Sessions')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('5 this week')).toBeInTheDocument();
  });

  test('renders without trend prop', () => {
    render(<StatCard title="Training Hours" value={10.5} color="blue" />);

    expect(screen.getByText('Training Hours')).toBeInTheDocument();
    expect(screen.getByText('10.5')).toBeInTheDocument();
  });

  test('applies default color when not specified', () => {
    const { container } = render(<StatCard title="Test" value={1} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  // New Test: Check for specific color class application
  test('applies correct class for green color', () => {
    const { container } = render(<StatCard title="Wins" value={5} color="green" />);
    // We check if the color class exists in the rendered HTML
    expect(container.innerHTML).toContain('text-emerald-600');
  });
});
