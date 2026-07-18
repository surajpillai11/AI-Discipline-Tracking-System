import apiClient from "./axiosClient";

export const chatWithCoach = (message) => apiClient.post("/ai/coach/chat", { message });
export const getCoachHistory = (limit = 50) =>
  apiClient.get("/ai/coach/history", { params: { limit } });
export const clearCoachHistory = () => apiClient.delete("/ai/coach/history");
export const suggestHabits = (goal) => apiClient.post("/ai/habits/suggest", { goal });
export const adoptSuggestedHabits = (habits) => apiClient.post("/ai/habits/adopt", { habits });
export const generateDailyPlan = (data) => apiClient.post("/ai/planner/generate", data);
