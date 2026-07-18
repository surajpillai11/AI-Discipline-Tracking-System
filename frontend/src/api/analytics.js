import apiClient from "./axiosClient";

export const getOverview = () => apiClient.get("/analytics/overview");
export const getWeeklyAnalytics = () => apiClient.get("/analytics/weekly");
export const getMonthlyAnalytics = () => apiClient.get("/analytics/monthly");
export const getCategoryBreakdown = () => apiClient.get("/analytics/category-breakdown");
export const getStreakGraph = () => apiClient.get("/analytics/streaks");
export const getProductivityTrend = (weeks = 12) =>
  apiClient.get("/analytics/productivity-trend", { params: { weeks } });
