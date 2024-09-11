import { put, post, del, getPage } from "./ApiManager";
import { USERS_API_URL } from "../constants/apiConstants";
import { axiosInstance } from "./ApiManager";

const fetchUsers = async (page = 0, pageSize = 7, search = "" , role) => {
  return await getPage(USERS_API_URL, page, pageSize, search , "ROLE_USER");
};

const RegisterUser = async (userData) => {
  return await post(USERS_API_URL, userData);
};

const updateUser = async (id, userData) => {
  return await put(USERS_API_URL, id, userData);
};

const deleteUser = async (id) => {
  return await del(USERS_API_URL, id);
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

export { fetchUsers, RegisterUser, updateUser, deleteUser, SearchByNumber };
