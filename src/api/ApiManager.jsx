import axiosInstance from "./axiosConfig";
const get = (url,params={}) => {
  return axiosInstance.get(url,{params});
};
const remove = (url) => {
  return axiosInstance.delete(url);
};
const put = (url, data = {}) => {
  return axiosInstance.put(url, data);
};
const post = (url, data = {}) => {
  return axiosInstance.post(url, data);
};
export { get, remove, put, post };