import axiosInstance from "./AxiosInstance";

const API_BASE_URL = "/users";

const fetchUsers = async (page = 0, pagesize = 10, search = "") => {
  try {
    const trimmedSearchTerm = search.trim(); 
    const response = await axiosInstance.get(`${API_BASE_URL}`, {

      params: {
        page: page,
        size: pagesize,
        search: trimmedSearchTerm, 
        role: "ROLE_USER"
      },
      
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Users:", error);
    throw error;
  }
};


const RegisterUser = async (UserData) => {
  try {
    const response = await axiosInstance.post(API_BASE_URL, UserData);
    return response.data;
  } catch (error) {
    console.error("Error adding Issuance:", error);
    throw error;
  }
};

const updateUser = async (id, UserData) => {
  try {
    const response = await axiosInstance.patch(`${API_BASE_URL}/${id}`, UserData);
    return response.data;
  } catch (error) {
    console.error("Error updating UserData:", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting User:", error);
    throw error;
  }
};

const SearchByNumber = async (number) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/search`, {

      params: {
        phoneNumber: number,
        
      },
      
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Users:", error);
    throw error;
  }
};

export { SearchByNumber,fetchUsers, RegisterUser, updateUser, deleteUser };
