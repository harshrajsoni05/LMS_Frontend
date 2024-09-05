import axiosInstance from "./AxiosInstance";

export const login = async (usernameOrPhoneNumber, password) => {
    return await axiosInstance.post(`/login`, {usernameOrPhoneNumber, password});
}

export const getCurrentUser = async (jwtToken) => {
    return await axiosInstance.get(`/currentUser`, {
        headers: {
            Authorization: jwtToken,
        }
    })
}

export const logout = () => {
    window.localStorage.removeItem('jwtToken');
}