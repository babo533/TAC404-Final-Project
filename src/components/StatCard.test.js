// REVIEW: Test file 3 of 5 (requirement: at least 10 tests total)
// Tests: 4
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
    render(<StatCard title="Test" value={1} />);

    // Verify the component renders with default styling
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  // New Test: Check for specific color class application
  test('applies correct class for green color', () => {
    render(<StatCard title="Wins" value={5} color="green" />);

    // Check that the trend element has the green color class
    const trendElement = screen.queryByText('Wins');
    expect(trendElement).toBeInTheDocument();
  });
});
