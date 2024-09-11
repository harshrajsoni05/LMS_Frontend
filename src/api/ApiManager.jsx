
import axios from "axios";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants/apiConstants";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const jwtToken = localStorage.getItem("jwtToken"); 
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const get = async (baseUrl) => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const post = async (baseUrl, data) => {
  try {
    const response = await axiosInstance.post(baseUrl, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const put = async (baseUrl, id, data) => {
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

const del = async (baseUrl, id) => {
  try {
    const response = await axiosInstance.delete(`${baseUrl}/${id}`);
    return response.data
  } catch (error) {
    throw error;
  }
};

const getPage = async (baseUrl, page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE, search = "" , role) => {
  try {
    const trimmedSearchTerm = search.trim();
    const response = await axiosInstance.get(baseUrl, {
      params: {
        page: page,
        size: pageSize,
        search: trimmedSearchTerm,
        role: role
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { get, put, post, del, getPage, axiosInstance};
