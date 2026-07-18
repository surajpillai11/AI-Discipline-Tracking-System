import apiClient from "./axiosClient";

export const getFriends = () => apiClient.get("/friends");
export const sendFriendRequest = (email) => apiClient.post("/friends/request", { email });
export const getIncomingRequests = () => apiClient.get("/friends/requests");
export const respondToRequest = (id, action) =>
  apiClient.patch(`/friends/requests/${id}`, { action });
export const removeFriend = (userId) => apiClient.delete(`/friends/${userId}`);
