import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/axiosClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, if a token exists, verify it's still valid by fetching /auth/me
  // rather than trusting whatever's cached in localStorage.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    apiClient
      .get("/auth/me")
      .then((res) => setUser(res.data.data))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await apiClient.post("/auth/login", { email, password });
    const { token, ...userData } = res.data.data;
    localStorage.setItem("token", token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await apiClient.post("/auth/register", { name, email, password });
    const { token, ...userData } = res.data.data;
    localStorage.setItem("token", token);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // logout is best-effort server-side; always clear client state regardless
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
