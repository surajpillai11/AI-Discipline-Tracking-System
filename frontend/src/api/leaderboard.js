import apiClient from "./axiosClient";

export const getLeaderboard = (sortBy = "disciplineScore") =>
  apiClient.get("/leaderboard", { params: { sortBy } });
