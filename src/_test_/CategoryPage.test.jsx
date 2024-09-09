import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../redux/store'; 
import { BrowserRouter as Router } from 'react-router-dom';
import CategoryPage from '../pages/CategoryPage';

import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../api/CategoryServices';



import { MemoryRouter } from 'react-router-dom';


jest.mock('../api/CategoryServices');
jest.mock('../components/toast/toast', () => ({
  __esModule: true,
  default: ({ message }) => <div>{message}</div>,
}));

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('CategoryPage', () => {
  beforeEach(() => {
    fetchCategories.mockResolvedValue({ content: [], totalPages: 1 });
    addCategory.mockResolvedValue({});
    updateCategory.mockResolvedValue({});
    deleteCategory.mockResolvedValue({});
  });

  test('renders CategoryPage with heading and buttons', () => {
    renderWithRouter(<CategoryPage />);

    expect(screen.getByText('Category List')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Category/i })).toBeInTheDocument();
  });

  test('opens and closes add category modal', async () => {
    renderWithRouter(<CategoryPage />);

    fireEvent.click(screen.getByRole('button', { name: /Add Category/i }));
    expect(screen.getByText('Add Category')).toBeInTheDocument();

    fireEvent.click(screen.getByText('No'));
    expect(screen.queryByText('Add Category')).not.toBeInTheDocument();
  });

  test('shows success toast on adding a category', async () => {
    renderWithRouter(<CategoryPage />);

    fireEvent.click(screen.getByRole('button', { name: /Add Category/i }));
    // Fill form with valid data and submit
    // Simulate form submission
    // Replace the following line with actual form submission logic if needed
    await waitFor(() => expect(screen.getByText('Category added successfully!')).toBeInTheDocument());
  });

  test('shows failure toast on failed category addition', async () => {
    addCategory.mockRejectedValue(new Error('Failed to add category'));
    renderWithRouter(<CategoryPage />);

    fireEvent.click(screen.getByRole('button', { name: /Add Category/i }));
    // Simulate form submission
    await waitFor(() => expect(screen.getByText('Failed to add category')).toBeInTheDocument());
  });

  test('handles page navigation', async () => {
    renderWithRouter(<CategoryPage />);

    fireEvent.click(screen.getByAltText('next'));
    // Add assertions based on pagination logic if applicable
  });
});
