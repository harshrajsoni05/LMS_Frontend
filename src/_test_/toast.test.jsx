import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Toast from '../components/toast';

describe('Toast', () => {
  jest.useFakeTimers(); 

  afterEach(cleanup);

  test('renders with success type', () => {
    render(<Toast type="success" message="Success message" onClose={() => {}} />);
    expect(screen.getByText('✅')).toBeInTheDocument();
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  test('renders with failure type', () => {
    render(<Toast type="failure" message="Failure message" onClose={() => {}} />);
    expect(screen.getByText('❌')).toBeInTheDocument();
    expect(screen.getByText('Failure message')).toBeInTheDocument();
  });

  test('calls onClose after duration', () => {
    const mockOnClose = jest.fn();
    render(<Toast type="success" message="Success message" duration={2000} onClose={mockOnClose} />);
    
    jest.advanceTimersByTime(2000);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('cleans up timeout on unmount', () => {
    const mockOnClose = jest.fn();
    const { unmount } = render(<Toast type="success" message="Success message" duration={2000} onClose={mockOnClose} />);
    
    unmount();
    jest.runOnlyPendingTimers(); 

    expect(mockOnClose).not.toHaveBeenCalled(); 
  });
});
