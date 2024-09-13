
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryPage from '../pages/CategoryPage';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from "../api/CategoryServices";
import { act } from 'react-dom/test-utils';

jest.mock("../api/CategoryServices");

jest.mock("../components/button", () => ({ name, onClick }) => (
  <button onClick={onClick}>{name}</button>
));
jest.mock("../components/modal", () => ({ children, isOpen, onClose }) => (
  isOpen ? <div data-testid="modal">{children}<button onClick={onClose}>Close</button></div> : null
));
jest.mock("../components/table", () => ({ data }) => (

  <table>
    <tbody>
      {data.map((item, index) => (
        <tr key={index}>
          <td>{item.name}</td>
          <td>{item.description}</td>
          <td className="actionicons">
            <img src="editicon.png" alt="Edit" className="action-icon" />
            <img src="deleteicon.png" alt="Delete" className="action-icon" />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
));
jest.mock("../components/searchbar", () => ({ searchTerm, onChange }) => (
  <input type="text" value={searchTerm} onChange={onChange} data-testid="searchbar" />
));
jest.mock("../components/toast", () => ({ type, message }) => (
  <div data-testid={`toast-${type}`}>{message}</div>
));

jest.mock("../hocs/WithLayoutComponent", () => (Component) => Component);

describe('CategoryPage', () => {
  beforeEach(() => {
    fetchCategories.mockResolvedValue({
      data: {
        content: [
          { id: 1, name: 'Category 1', description: 'Description 1' },
        ],
        totalPages: 1,
      }
    });
  });

  test('renders CategoryPage and fetches categories', async () => {
    await act(async () => {
      render(<CategoryPage />);
    });
    
    expect(await screen.findByText('Category List')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });
  });

  test('opens add category modal', async () => {
    await act(async () => {
      render(<CategoryPage />);
    });
    
    fireEvent.click(screen.getByText('Add Category'));
    
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
    expect(screen.getByRole('heading', { name: 'Add Category' })).toBeInTheDocument();
  });

  test('adds a new category', async () => {
    addCategory.mockResolvedValue({ data: { message: 'Category added successfully' } });
    
    await act(async () => {
      render(<CategoryPage />);
    });
    
    fireEvent.click(screen.getByText('Add Category'));
    
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('modal').querySelector('input[name="name"]');
    const descriptionInput = screen.getByTestId('modal').querySelector('textarea[name="description"]');
    const saveButton = screen.getByTestId('modal').querySelector('button');

    fireEvent.change(nameInput, { target: { value: 'New Category' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByTestId('toast-success')).toHaveTextContent('Category added successfully');
    });
  });

  test('edits a category', async () => {
    updateCategory.mockResolvedValue({ data: { message: 'Category updated successfully' } });
    
    await act(async () => {
      render(<CategoryPage />);
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
    deleteCategory.mockResolvedValue({ data: { message: 'Category deleted successfully' } });
    
    await act(async () => {
      render(<CategoryPage />);
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
      render(<CategoryPage />);
    });
    
    fireEvent.click(screen.getByText('Add Category'));
    
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('modal').querySelector('input[name="name"]');
    const saveButton = screen.getByTestId('modal').querySelector('button');

    fireEvent.change(nameInput, { target: { value: 'New Category' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByTestId('toast-failure')).toHaveTextContent('Error adding category');
    });
  });

  test('handles pagination', async () => {
    fetchCategories.mockResolvedValue({
      data: {
        content: [{ id: 1, name: 'Category 1', description: 'Description 1' }],
        totalPages: 2,
      }
    });

    await act(async () => {
      render(<CategoryPage />);
    });
    
    const nextButton = await screen.findByAltText('next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetchCategories).toHaveBeenCalledWith(1, 7, '');
    });
  });

  test('searches for categories', async () => {
    await act(async () => {
      render(<CategoryPage />);
    });
    
    const searchbar = await screen.findByTestId('searchbar');
    fireEvent.change(searchbar, { target: { value: 'Search Term' } });

    await waitFor(() => {
      expect(fetchCategories).toHaveBeenCalledWith(0, 7, 'Search Term');
    });
  });
});

