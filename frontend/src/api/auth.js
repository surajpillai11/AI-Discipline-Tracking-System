import apiClient from "./axiosClient";

export const getMe = () => apiClient.get("/auth/me");
export const updateProfile = (data) => apiClient.put("/auth/profile", data);
