import axiosInstance from "./AxiosInstance";

const API_BASE_URL = "/categories";

const fetchCategories = async (page = 0, pagesize = 10, search = "") => {
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
export const fetchAllCategories = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/all`); // Adjust URL as needed
    return response.data;
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw error;
  }
};

const addCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post(API_BASE_URL, categoryData);
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

const updateCategory = async (id, categoryData) => {
  try {
    const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

const deleteCategory = async (id) => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// This function isn't needed based on the provided URLs, but if needed in future, it can be added similarly to books.

export { fetchCategories, addCategory, updateCategory, deleteCategory };
