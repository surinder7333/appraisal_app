"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        // Set default headers for all axios requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`
        );

        if (response.data.user) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      console.log("response.data", response.data);

      const { token, user, message } = response.data;

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Set default headers for all axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
      setIsAuthenticated(true);

      return message;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          name,
          email,
          password,
        }
      );

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
