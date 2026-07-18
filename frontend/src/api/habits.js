import apiClient from "./axiosClient";

export const getHabits = (params = {}) => apiClient.get("/habits", { params });
export const createHabit = (data) => apiClient.post("/habits", data);
export const updateHabit = (id, data) => apiClient.put(`/habits/${id}`, data);
export const deleteHabit = (id) => apiClient.delete(`/habits/${id}`);
export const toggleHabitComplete = (id) => apiClient.patch(`/habits/${id}/complete`);
export const getHabitStats = (id) => apiClient.get(`/habits/${id}/stats`);
