import {
  fetchDataWithPagination,
  addData,
  updateData,
  deleteData,
} from "./ApiManager";
import axiosInstance from "./AxiosInstance";
import { USERS_API_URL } from "../constants/apiConstants";


const fetchUsers = async (page = 0, pageSize = 7, search = "") => {
  return await fetchDataWithPagination(USERS_API_URL, page, pageSize, search);
};

const RegisterUser = async (userData) => {
  return await addData(USERS_API_URL, userData);
};

const updateUser = async (id, userData) => {
  return await updateData(USERS_API_URL, id, userData);
};

const deleteUser = async (id) => {
  return await deleteData(USERS_API_URL, id);
};

const SearchByNumber = async (number) => {
  try {
    const response = await axiosInstance.get(`${USERS_API_URL}/search`, {
      params: { phoneNumber: number },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching by phone number:", error);
    throw error;
  }
};


export {
  fetchUsers,
  RegisterUser,
  updateUser,
  deleteUser,
  SearchByNumber,
  
};
