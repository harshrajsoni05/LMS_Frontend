import axiosInstance from "./AxiosInstance";

const API_BASE_URL = "/issuances";

const fetchIssuances = async (page = 0, pagesize = 7, search = "") => {
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
    console.error("Error fetching Issuances:", error);
    throw error;
  }
};


  const fetchIssuancesbyUserId = async (userId ,page = 0, pagesize = 10, search = "") => {
    try {
      const trimmedSearchTerm = search.trim(); 
      const response = await axiosInstance.get(`${API_BASE_URL}/user/${userId}`, {
  
        params: {
          page: page,
          size: pagesize,
          search: trimmedSearchTerm, 
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Issuances by id:", error);
      throw error;
    }
  };

  const fetchIssuancesbyBookId = async (bookId ,page = 0, pagesize = 10, search = "") => {
    try {
      const trimmedSearchTerm = search.trim(); 
      const response = await axiosInstance.get(`${API_BASE_URL}/book/${bookId}`, {
  
        params: {
          page: page,
          size: pagesize,
          search: trimmedSearchTerm, 
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Issuances by id:", error);
      throw error;
    }
  };

const addIssuance = async (IssuanceData) => {
  try {
    const response = await axiosInstance.post(API_BASE_URL, IssuanceData);
    return response.data;
  } catch (error) {
    console.error("Error adding Issuance:", error);
    throw error;
  }
};



const updateIssuance = async (id, IssuanceData) => {
  try {
    const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, IssuanceData);
    return response.data;
  } catch (error) {
    console.error("Error updating Issuance:", error);
    throw error;
  }
};

const deleteIssuance = async (id) => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting Issuance:", error);
    throw error;
  }
};


export { fetchIssuancesbyBookId,fetchIssuancesbyUserId,fetchIssuances, addIssuance, updateIssuance, deleteIssuance };
