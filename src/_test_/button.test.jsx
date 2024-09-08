import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CustomButton from '../components/button';

describe('CustomButton', () => {
  test('renders with the correct text', () => {
    render(<CustomButton name="Click Me" onClick={() => {}} />);
    const buttonElement = screen.getByText('Click Me');
    expect(buttonElement).toBeInTheDocument();
  });

  test('applies the correct class name', () => {
    render(<CustomButton name="Styled Button" className="custom-class" onClick={() => {}} />);
    const buttonElement = screen.getByText('Styled Button');
    expect(buttonElement).toHaveClass('btn custom-class');
  });

  test('calls the onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<CustomButton name="Clickable Button" onClick={handleClick} />);
    const buttonElement = screen.getByText('Clickable Button');
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
