import axiosInstance from "./AxiosInstance";

const fetchDashboardCounts = async () => {
  try {
    const response = await axiosInstance.get("api/dashboard/counts");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchRecentBooks = async () => {
  try {
    const response = await axiosInstance.get("api/books/recent");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { fetchDashboardCounts, fetchRecentBooks };
