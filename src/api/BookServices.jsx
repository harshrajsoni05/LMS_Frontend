import axios from "axios";
import axiosInstance from "./AxiosInstance";

const API_BASE_URL = "/books";



const fetchAllBooks = async()=>{
  const response = await axiosInstance.get(`${API_BASE_URL}/all`);
  return response.data;

}

const fetchBooks = async (page = 0, pagesize = 10, search = "") => {
  try {
    const trimmedSearchTerm = search.trim(); 
    const response = await axiosInstance.get(`${API_BASE_URL}`, {

      params: {
        page: page,
        size: pagesize,
        search: trimmedSearchTerm, 
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};


const addBook = async (bookData) => {
  try {
    const response = await axiosInstance.post(API_BASE_URL, bookData);
    return response.data;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};


const updateBook = async (id, bookData) => {
  try {
    if (!id || !bookData) {
      throw new Error('ID and book data are required for updating a book');
    }

    const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, bookData);

    return response.data;
  } catch (error) {
    console.error("Error updating book:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export default updateBook;


const deleteBook = async (id) => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};

const assignBookToUser = async (bookId, userId) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/assign`, {
      bookId,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error("Error assigning book:", error);
    throw error;
  }
};


export { fetchAllBooks ,fetchBooks, addBook, updateBook, deleteBook, assignBookToUser };
