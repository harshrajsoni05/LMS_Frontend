import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import Dynamicform from '../components/dynamicform'; 

describe('Dynamicform component', () => {
  const fields = [
    { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter Username', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email', required: true },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password', required: true },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Confirm Password', required: true },
    { name: 'phone', label: 'Phone', type: 'text', placeholder: 'Enter Phone Number' },
  ];

  const defaultValues = {
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockOnSubmit = jest.fn();

  it('renders form with fields and default values', () => {
    render(<Dynamicform fields={fields} onSubmit={mockOnSubmit} heading="Test Form" defaultValues={defaultValues} />);

    expect(screen.getByText('Test Form')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Enter Username')).toHaveValue('testuser');
    expect(screen.getByPlaceholderText('Enter Email')).toHaveValue('test@example.com');
    expect(screen.getByPlaceholderText('Enter Password')).toHaveValue(''); // No default for password
  });

  it('handles input changes and submits form data', () => {
    render(<Dynamicform fields={fields} onSubmit={mockOnSubmit} heading="Test Form" defaultValues={defaultValues} />);

    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Phone Number'), { target: { value: '1234567890' } });

    fireEvent.click(screen.getByText('Save'));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      phone: '1234567890',
    });
  });

  it('shows error messages for missing required fields', () => {
    render(<Dynamicform fields={fields} onSubmit={mockOnSubmit} heading="Test Form" />);

    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText('Username cannot be empty')).toBeInTheDocument();
  });

  it('shows error message for invalid email format', () => {
    render(<Dynamicform fields={fields} onSubmit={mockOnSubmit} heading="Test Form" />);

    fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'invalid-email' } });

    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText('Enter a valid Email Address')).toBeInTheDocument();
  });

  it('shows error message for password mismatch', () => {
    render(<Dynamicform fields={fields} onSubmit={mockOnSubmit} heading="Test Form" />);

    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password321' } });

    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });
});
