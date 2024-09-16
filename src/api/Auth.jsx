import { axiosInstance } from "./ApiManager";

export const login = async (usernameOrPhoneNumber, password) => {
    return await axiosInstance.post(`api/login`, {usernameOrPhoneNumber, password});
}

export const getCurrentUser = async (jwtToken) => {
    return await axiosInstance.get(`api/currentUser`, {
        headers: {
            Authorization: jwtToken,
        }
    })
}

export const logout = () => {
    window.localStorage.removeItem('jwtToken');
}