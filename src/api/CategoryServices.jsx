import { get, put, post, del, getPage } from "./ApiManager";
import { CATEGORIES_API_URL } from "../constants/apiConstants";

const fetchCategories = async (page, pageSize, search) => {
  return await getPage(CATEGORIES_API_URL, page, pageSize, search);
};

const fetchAllCategories = async () => {
  return await get(CATEGORIES_API_URL);
};

const addCategory = async (categoryData) => {
  return await post(CATEGORIES_API_URL, categoryData);
};

const updateCategory = async (id, categoryData) => {
  return await put(CATEGORIES_API_URL, id, categoryData);
};

const deleteCategory = async (id) => {
  return await del(CATEGORIES_API_URL, id);
};

export {
  fetchCategories,
  fetchAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
