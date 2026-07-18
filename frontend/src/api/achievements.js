import apiClient from "./axiosClient";

export const getEarnedAchievements = () => apiClient.get("/achievements");
export const getAchievementCatalog = () => apiClient.get("/achievements/catalog");
