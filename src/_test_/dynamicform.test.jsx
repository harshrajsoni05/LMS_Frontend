import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dynamicform from '../components/dynamicform';

jest.mock('../components/button', () => ({ name, onClick, className }) => (
  <button onClick={onClick} className={className}>{name}</button>
));

describe('Dynamicform', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form with heading and fields', () => {
    const fields = [
      { name: 'username', type: 'text', placeholder: 'Username' },
      { name: 'age', type: 'number', placeholder: 'Age' }
    ];
    
    render(<Dynamicform fields={fields} onSubmit={mockOnSubmit} heading="Test Form" />);

    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Age')).toBeInTheDocument();
  });

  test('updates form data on input change', () => {
    const fields = [
      { name: 'username', type: 'text', placeholder: 'Username' },
      { name: 'age', type: 'number', placeholder: 'Age' }
    ];
    
    render(<Dynamicform fields={fields} onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'JohnDoe' } });
    fireEvent.change(screen.getByPlaceholderText('Age'), { target: { value: '25' } });

    expect(screen.getByPlaceholderText('Username').value).toBe('JohnDoe');
    expect(screen.getByPlaceholderText('Age').value).toBe('25');
  });

  test('shows validation errors for required fields', () => {
    const fields = [
      { name: 'username', type: 'text', placeholder: 'Username', required: true },
      { name: 'age', type: 'number', placeholder: 'Age' }
    ];
    
    render(<Dynamicform fields={fields} onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText('Username cannot be empty')).toBeInTheDocument();
  });

  test('calls onSubmit with form data when valid', () => {
    const fields = [
      { name: 'username', type: 'text', placeholder: 'Username' },
      { name: 'age', type: 'number', placeholder: 'Age' }
    ];
    
    render(<Dynamicform fields={fields} onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'JohnDoe' } });
    fireEvent.change(screen.getByPlaceholderText('Age'), { target: { value: '25' } });

    fireEvent.click(screen.getByText('Save'));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      username: 'JohnDoe',
      age: '25'
    });
  });

  test('shows error message for negative number input', () => {
    const fields = [
      { name: 'age', type: 'number', placeholder: 'Age' }
    ];
    
    render(<Dynamicform fields={fields} onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Age'), { target: { value: '-1' } });

    expect(screen.getByText('Cannot be negative')).toBeInTheDocument();
  });

  test('handles password confirmation validation', () => {
    const fields = [
      { name: 'password', type: 'password', placeholder: 'Password' },
      { name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' }
    ];
    
    render(<Dynamicform fields={fields} onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password' } });

    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });
});
