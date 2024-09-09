import {
  fetchCategories,
  fetchAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../api/CategoryServices'; 
import {
  fetchDataWithPagination,
  fetchAllData,
  addData,
  updateData,
  deleteData,
} from '../api/ApiManager'; 

import {CATEGORIES_API_URL} from "../constants/apiConstants"

jest.mock('../api/ApiManager'); 

describe('Category API functions', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  test('fetchCategories should call fetchDataWithPagination with correct arguments', () => {
    const page = 1;
    const pageSize = 10;
    const search = 'test';
    fetchCategories(page, pageSize, search);
    expect(fetchDataWithPagination).toHaveBeenCalledWith(CATEGORIES_API_URL, page, pageSize, search);
  });

  test('fetchAllCategories should call fetchAllData with correct arguments', () => {
    fetchAllCategories();
    expect(fetchAllData).toHaveBeenCalledWith(CATEGORIES_API_URL);
  });

  test('addCategory should call addData with correct arguments', () => {
    const categoryData = { name: 'New Category' };
    addCategory(categoryData);
    expect(addData).toHaveBeenCalledWith(CATEGORIES_API_URL, categoryData);
  });

  test('updateCategory should call updateData with correct arguments', () => {
    const id = 1;
    const categoryData = { name: 'Updated Category' };
    updateCategory(id, categoryData);
    expect(updateData).toHaveBeenCalledWith(CATEGORIES_API_URL, id, categoryData);
  });

  test('deleteCategory should call deleteData with correct arguments', () => {
    const id = 1;
    deleteCategory(id);
    expect(deleteData).toHaveBeenCalledWith(CATEGORIES_API_URL, id);
  });
});
