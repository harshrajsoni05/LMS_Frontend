import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SearchBar from '../components/searchbar'; 

describe('SearchBar', () => {
  test('renders correctly', () => {
    render(<SearchBar searchTerm="" onChange={() => {}} onSearch={() => {}} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByAltText('Search')).toBeInTheDocument();
  });

  test('displays the correct search term in the input', () => {
    render(<SearchBar searchTerm="test" onChange={() => {}} onSearch={() => {}} />);
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  test('calls onChange handler when input value changes', () => {
    const handleChange = jest.fn();
    render(<SearchBar searchTerm="" onChange={handleChange} onSearch={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'new search term' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('calls onSearch handler when search button is clicked', () => {
    const handleSearch = jest.fn();
    render(<SearchBar searchTerm="" onChange={() => {}} onSearch={handleSearch} />);
    fireEvent.click(screen.getByAltText('Search'));
    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  test('handles optional onSearch prop correctly', () => {
    render(<SearchBar searchTerm="" onChange={() => {}} />);
    expect(screen.getByAltText('Search')).toBeInTheDocument();
  });
});
