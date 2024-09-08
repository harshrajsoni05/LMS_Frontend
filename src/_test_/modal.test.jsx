// Modal.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Modal from '../components/modal';

describe('Modal', () => {
  test('does not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={() => {}}>Content</Modal>);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  test('renders when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={() => {}}>Content</Modal>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const mockOnClose = jest.fn();
    render(<Modal isOpen={true} onClose={mockOnClose}>Content</Modal>);

    fireEvent.click(screen.getByRole('button', { name: /×/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

});
