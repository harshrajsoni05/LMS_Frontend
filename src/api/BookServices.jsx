import {
  fetchDataWithPagination,
  fetchAllData,
  addData,
  updateData,
  deleteData,
} from "./ApiManager";
import { BOOKS_API_URL } from "../constants/apiConstants";
import axiosInstance from "./AxiosInstance";

const fetchBooks = (page, pageSize, search) =>
  fetchDataWithPagination(BOOKS_API_URL, page, pageSize, search);
const fetchAllBooks = () => fetchAllData(BOOKS_API_URL);
const addBook = (bookData) => addData(BOOKS_API_URL, bookData);
const updateBook = (id, bookData) => updateData(BOOKS_API_URL, id, bookData);
const deleteBook = (id) => deleteData(BOOKS_API_URL, id);

const findBookSuggestions = async (query) => {
  try {
    const response = await axiosInstance.get(`${BOOKS_API_URL}/suggestions`,{
      params :{
        query:query
      }
    })
    return response.data;

  } catch (error) {
    console.error("Error assigning book:", error);
    throw error;
  }
};
export {findBookSuggestions, fetchBooks, fetchAllBooks, addBook, updateBook, deleteBook };
