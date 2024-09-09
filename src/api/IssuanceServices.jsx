import axiosInstance from "./AxiosInstance";

import { fetchDataWithPagination, addData, updateData, deleteData } from "./ApiManager";
import { ISSUANCES_API_URL } from "../constants/apiConstants";

const fetchIssuances = (page, pageSize, search) => fetchDataWithPagination(ISSUANCES_API_URL, page, pageSize, search);
const addIssuance = (issuanceData) => addData(ISSUANCES_API_URL, issuanceData);
const updateIssuance = (id, issuanceData) => updateData(ISSUANCES_API_URL, id, issuanceData);
const deleteIssuance = (id) => deleteData(ISSUANCES_API_URL, id);

const fetchIssuancesbyUserId = async (userId ,page = 0, pagesize = 10, search = "") => {
  try {
    const trimmedSearchTerm = search.trim(); 
    const response = await axiosInstance.get(`${ISSUANCES_API_URL}/user/${userId}`, {

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
    const response = await axiosInstance.get(`${ISSUANCES_API_URL}/book/${bookId}`, {

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
export { fetchIssuances, fetchIssuancesbyUserId, fetchIssuancesbyBookId, addIssuance, updateIssuance, deleteIssuance };
