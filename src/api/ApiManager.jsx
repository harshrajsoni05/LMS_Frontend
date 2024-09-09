
import axiosInstance from "./AxiosInstance";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants/apiConstants";

const fetchDataWithPagination = async (baseUrl, page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE, search = "") => {
  try {
    const trimmedSearchTerm = search.trim();
    const response = await axiosInstance.get(baseUrl, {
      params: {
        page: page,
        size: pageSize,
        search: trimmedSearchTerm,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchAllData = async (baseUrl) => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const addData = async (baseUrl, data) => {
  try {
    const response = await axiosInstance.post(baseUrl, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateData = async (baseUrl, id, data) => {
  try {
    if (!id || !data) {
      throw new Error("ID and data are required for updating.");
    }
    const response = await axiosInstance.put(`${baseUrl}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteData = async (baseUrl, id) => {
  try {
    await axiosInstance.delete(`${baseUrl}/${id}`);
  } catch (error) {
    throw error;
  }
};

export { fetchDataWithPagination, fetchAllData, addData, updateData, deleteData };
