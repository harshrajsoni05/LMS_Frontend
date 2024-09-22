import React,{act} from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import '@testing-library/jest-dom';
import CategoryPage from '../pages/admin/CategoryPage';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../api/CategoryServices';
import HOC from '../hocs/WithLayoutComponent';


jest.mock('../api/CategoryServices');
jest.mock('../hocs/WithLayoutComponent', () => (Component) => (props) => <Component {...props} />);

jest.mock('../components/button', () => ({ name, onClick }) => (
  <button onClick={onClick}>{name}</button>
));
jest.mock('../components/modal', () => ({ children, isOpen, onClose }) => (
  isOpen ? <div data-testid="modal">{children}<button onClick={onClose}>Close</button></div> : null
));

jest.mock('../components/searchbar', () => ({ searchTerm, onChange }) => (
  <input type="text" value={searchTerm} onChange={onChange} data-testid="searchbar" />
));
jest.mock('../components/toast', () => ({ type, message }) => (
  <div data-testid={`toast-${type}`}>{message}</div>
));

const WrappedCategory = HOC(CategoryPage);

describe('CategoryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Searchbar and add button', async () => {
    await act(async () => {
      render(<WrappedCategory />);
    });

    expect(screen.getByTestId('searchbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Add Category" })).toBeInTheDocument();
  });

  test('opens and closes add category modal', async () => {
    await act(async () => {
      render(<WrappedCategory />);
    });

    fireEvent.click(screen.getByText('Add Category'));

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Close'));

    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  test('fetches and displays categories', async () => {
    fetchCategories.mockResolvedValue({
        content: [{ id: 1, name: 'Category 1', description: 'Description 1' }],
        totalPages: 1,
    });

    await act(async () => {
      render(<WrappedCategory />);
    });

    await waitFor(() => {
      expect(fetchCategories).toHaveBeenCalledWith(0, 7, '');
    });

    expect(screen.getByText('Category List')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('No Category found')).not.toBeInTheDocument();
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });
  });

  test('handles no categories', async () => {
    fetchCategories.mockResolvedValue({
      
        content: [],
        totalPages: 0,
      
    });

    await act(async () => {
      render(<WrappedCategory />);
    });

    await waitFor(() => {
      expect(fetchCategories).toHaveBeenCalledWith(0, 7, '');
    });

    expect(screen.getByText('No Category found')).toBeInTheDocument();
  });

  test('edits a category', async () => {

    updateCategory.mockResolvedValue({ message: 'Category updated successfully' } );


    fetchCategories.mockResolvedValue({
      content: [{ id: 1, name: 'Category 1', description: 'Description 1' }],
      totalPages: 1,
    });

    await act(async () => {
      render(<WrappedCategory />);
    });

    await waitFor(() => {
      expect(fetchCategories).toHaveBeenCalledWith(0, 7, '');
    });
    
    await waitFor(() => {
      const editIcons = screen.getAllByAltText('Edit');
      expect(editIcons.length).toBeGreaterThan(0);
    });

    const editIcons = screen.getAllByAltText('Edit');
    fireEvent.click(editIcons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('modal').querySelector('input[name="name"]');
    const saveButton = screen.getByTestId('modal').querySelector('button');

    fireEvent.change(nameInput, { target: { value: 'Updated Category' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByTestId('toast-success')).toHaveTextContent('Category updated successfully');
    });
  });
  test('deletes a category', async () => {

    fetchCategories.mockResolvedValue({
      content: [{ id: 1, name: 'Category 1', description: 'Description 1' }],
      totalPages: 1,
    });

    deleteCategory.mockResolvedValue({ message: 'Category deleted successfully' });
    
    await act(async () => {
      render(<WrappedCategory />);
    });

    await waitFor(() => {
      expect(fetchCategories).toHaveBeenCalledWith(0, 7, '');
    });

    await waitFor(() => {
      const deleteIcons = screen.getAllByAltText('Delete');
      expect(deleteIcons.length).toBeGreaterThan(0);
    });

    const deleteIcons = screen.getAllByAltText('Delete');
    fireEvent.click(deleteIcons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    const yesButton = screen.getByTestId('modal').querySelector('button');
    expect(yesButton).toHaveTextContent('Yes');
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(screen.getByTestId('toast-success')).toHaveTextContent('Category deleted successfully');
    });

  });
  
  test('handles API error', async () => {
    addCategory.mockRejectedValue({ 
      response: { 
        data: { message: 'Error adding category' } 
      } 
    });
    
    await act(async () => {
      render(<WrappedCategory />);
    });
    
    fireEvent.click(screen.getByText('Add Category'));
    
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('modal').querySelector('input[name="name"]');
    const saveButton = screen.getByTestId('modal').querySelector('button');

    fireEvent.change(nameInput, { target: { value: 'New Category' } });
    fireEvent.click(saveButton);

    
  });


  test('searches for categories', async () => {

    fetchCategories.mockResolvedValue({
      content: [{ id: 1, name: 'Category 1', description: 'Description 1' }],
      totalPages: 1,
    });

    await act(async () => {
      render(<WrappedCategory />);
    });
    
    const searchbar = await screen.findByTestId("searchbar");
    fireEvent.change(searchbar, { target: { value: 'Search Term' } });

    await waitFor(() => {
      expect(fetchCategories).toHaveBeenCalledWith(0, 7, 'Search Term');
    });
  });

});

