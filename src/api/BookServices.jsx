import { get, put, post, del, getPage, axiosInstance } from "./ApiManager";
import { BOOKS_API_URL } from "../constants/apiConstants";



const fetchBooks = async (page , pageSize , search ) => {
  return await getPage(BOOKS_API_URL, page, pageSize, search);
};

const fetchAllBooks = async () => {
  return await get(BOOKS_API_URL);
};

const addBook = async (bookData) => {
  return await post(BOOKS_API_URL, bookData);
};

const updateBook = async (id, bookData) => {
  return await put(BOOKS_API_URL,id, bookData);
};

const deleteBook = async (id) => {
  return await del(BOOKS_API_URL,id);
};

const findBookSuggestions = async (query) => {
  try {
    const response = await axiosInstance.get(`${BOOKS_API_URL}/suggestions`, {
      params: {
        query: query,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};



export {
  findBookSuggestions,
  fetchBooks,
  fetchAllBooks,
  addBook,
  updateBook,
  deleteBook,
};
