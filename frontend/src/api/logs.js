import apiClient from "./axiosClient";

export const getLogs = (params = {}) => apiClient.get("/logs", { params });
export const getLogByDate = (date) => apiClient.get(`/logs/${date}`);
export const getHeatmap = (params = {}) => apiClient.get("/logs/heatmap", { params });
export const updateJournalEntry = (date, data) => apiClient.put(`/logs/${date}/journal`, data);
