
import axiosInstance from '../api/AxiosInstance';
import { fetchCategories, fetchAllCategories, addCategory, updateCategory, deleteCategory } from '../api/CategoryServices';

// Mock axiosInstance
jest.mock('../api/AxiosInstance');

describe('CategoryServices', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCategories', () => {
    it('should fetch categories with pagination and search term', async () => {
      const mockData = { data: { categories: ['Category 1', 'Category 2'], total: 2 } };
      axiosInstance.get.mockResolvedValueOnce(mockData);

      const result = await fetchCategories(1, 5, 'test');

      expect(axiosInstance.get).toHaveBeenCalledWith('/categories', {
        params: { page: 1, size: 5, search: 'test' }
      });
      expect(result).toEqual(mockData.data);
    });

    it('should handle errors during fetchCategories', async () => {
      const mockError = new Error('Failed to fetch categories');
      axiosInstance.get.mockRejectedValueOnce(mockError);

      await expect(fetchCategories()).rejects.toThrow('Failed to fetch categories');
      expect(axiosInstance.get).toHaveBeenCalledWith('/categories', {
        params: { page: 0, size: 7, search: '' }
      });
    });
  });

  describe('fetchAllCategories', () => {
    it('should fetch all categories', async () => {
      const mockData = { data: ['Category 1', 'Category 2'] };
      axiosInstance.get.mockResolvedValueOnce(mockData);

      const result = await fetchAllCategories();

      expect(axiosInstance.get).toHaveBeenCalledWith('/categories/all');
      expect(result).toEqual(mockData.data);
    });

    it('should handle errors during fetchAllCategories', async () => {
      const mockError = new Error('Failed to fetch all categories');
      axiosInstance.get.mockRejectedValueOnce(mockError);

      await expect(fetchAllCategories()).rejects.toThrow('Failed to fetch all categories');
    });
  });

  describe('addCategory', () => {
    it('should add a new category', async () => {
      const mockData = { data: { id: 1, name: 'New Category' } };
      const categoryData = { name: 'New Category' };
      axiosInstance.post.mockResolvedValueOnce(mockData);

      const result = await addCategory(categoryData);

      expect(axiosInstance.post).toHaveBeenCalledWith('/categories', categoryData);
      expect(result).toEqual(mockData.data);
    });

    it('should handle errors during addCategory', async () => {
      const mockError = new Error('Failed to add category');
      axiosInstance.post.mockRejectedValueOnce(mockError);

      await expect(addCategory({ name: 'New Category' })).rejects.toThrow('Failed to add category');
    });
  });

  describe('updateCategory', () => {
    it('should update an existing category', async () => {
      const mockData = { data: { id: 1, name: 'Updated Category' } };
      const categoryData = { name: 'Updated Category' };
      axiosInstance.put.mockResolvedValueOnce(mockData);

      const result = await updateCategory(1, categoryData);

      expect(axiosInstance.put).toHaveBeenCalledWith('/categories/1', categoryData);
      expect(result).toEqual(mockData.data);
    });

    it('should handle errors during updateCategory', async () => {
      const mockError = new Error('Failed to update category');
      axiosInstance.put.mockRejectedValueOnce(mockError);

      await expect(updateCategory(1, { name: 'Updated Category' })).rejects.toThrow('Failed to update category');
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category by id', async () => {
      axiosInstance.delete.mockResolvedValueOnce();

      await deleteCategory(1);

      expect(axiosInstance.delete).toHaveBeenCalledWith('/categories/1');
    });

    it('should handle errors during deleteCategory', async () => {
      const mockError = new Error('Failed to delete category');
      axiosInstance.delete.mockRejectedValueOnce(mockError);

      await expect(deleteCategory(1)).rejects.toThrow('Failed to delete category');
    });
  });
});
