// CategoryPage.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CategoryPage from '../pages/CategoryPage';
import { addCategory, updateCategory, deleteCategory, fetchCategories } from '../api/CategoryServices';
import { MemoryRouter } from 'react-router-dom'; 
import { Provider } from 'react-redux';
import store from '../redux/store'; 

jest.mock('../api/CategoryServices');

describe('CategoryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call handleAddCategory on Add Category', async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <CategoryPage />
        </Provider>
      </MemoryRouter>
    );

    // Open the modal
    fireEvent.click(screen.getByText('Add Category'));

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Category Name'), { target: { value: 'New Category' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Description here' } });

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    // Check that the addCategory function was called
    await waitFor(() => {
      expect(addCategory).toHaveBeenCalledWith({
        name: 'New Category',
        description: 'Description here'
      });
    });
  });

  test('should call handleEditCategory on Edit Category', async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <CategoryPage />
        </Provider>
      </MemoryRouter>
    );

    // Open the edit modal
    fireEvent.click(screen.getByAltText('Edit'));

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Category Name'), { target: { value: 'Updated Category' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Updated Description' } });

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    // Check that the updateCategory function was called
    await waitFor(() => {
      expect(updateCategory).toHaveBeenCalledWith(
        expect.any(Number), // Replace with actual id if needed
        {
          name: 'Updated Category',
          description: 'Updated Description'
        }
      );
    });
  });

  test('should call handleDelete on Delete button click', async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <CategoryPage />
        </Provider>
      </MemoryRouter>
    );

    // Open the delete modal
    fireEvent.click(screen.getByAltText('Delete'));

    // Confirm deletion
    fireEvent.click(screen.getByText('Yes'));

    // Check that the deleteCategory function was called with the correct id
    await waitFor(() => {
      expect(deleteCategory).toHaveBeenCalledWith(expect.any(Number)); // Replace with actual id if needed
    });
  });

  test('should open the Add Category modal on Add button click', () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <CategoryPage />
        </Provider>
      </MemoryRouter>
    );

    // Check that the Add Category button is in the document
    const addButton = screen.getByText('Add Category');

    // Simulate button click
    fireEvent.click(addButton);

    // Check if modal is open
    expect(screen.getByText('Add Category')).toBeInTheDocument();
  });

  test('should update input fields correctly', () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <CategoryPage />
        </Provider>
      </MemoryRouter>
    );

    // Open the Add Category modal
    fireEvent.click(screen.getByText('Add Category'));

    // Find and update input fields
    const nameInput = screen.getByPlaceholderText('Category Name');
    const descriptionInput = screen.getByPlaceholderText('Description');

    fireEvent.change(nameInput, { target: { value: 'New Category' } });
    fireEvent.change(descriptionInput, { target: { value: 'Description here' } });

    // Check if inputs have been updated
    expect(nameInput.value).toBe('New Category');
    expect(descriptionInput.value).toBe('Description here');
  });

  test('should display categories correctly', async () => {
    const mockCategories = [
      { id: 1, name: 'Category 1', description: 'Description 1' },
      { id: 2, name: 'Category 2', description: 'Description 2' }
    ];

    // Mock the fetchCategories function to return mock data
    fetchCategories.mockResolvedValue({ content: mockCategories, totalPages: 1 });

    render(
      <MemoryRouter>
        <Provider store={store}>
          <CategoryPage />
        </Provider>
      </MemoryRouter>
    );

    // Wait for categories to be displayed
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });
  });
});
