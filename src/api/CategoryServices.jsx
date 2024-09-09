import {
  fetchDataWithPagination,
  fetchAllData,
  addData,
  updateData,
  deleteData,
} from "./ApiManager";
import { CATEGORIES_API_URL } from "../constants/apiConstants";

const fetchCategories = (page, pageSize, search) =>
  fetchDataWithPagination(CATEGORIES_API_URL, page, pageSize, search);

const fetchAllCategories = () => fetchAllData(CATEGORIES_API_URL);

const addCategory = (categoryData) => addData(CATEGORIES_API_URL, categoryData);

const updateCategory = (id, categoryData) =>
  updateData(CATEGORIES_API_URL, id, categoryData);

const deleteCategory = (id) => deleteData(CATEGORIES_API_URL, id);

export {
  fetchCategories,
  fetchAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
