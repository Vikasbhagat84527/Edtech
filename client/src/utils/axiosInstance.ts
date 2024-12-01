import axios from "axios";
import { signOut } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
      return config;
    } catch (error) {
      console.error("Error attaching token to request:", error);
      return config;
    }
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (typeof window !== "undefined") {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            console.warn("No refresh token available. Redirecting to login.");
            return Promise.reject(error);
          }

          const response = await axios.post(
            "http://localhost:5000/auth/refresh",
            { refreshToken }
          );

          const { accessToken } = response.data;

          localStorage.setItem("accessToken", accessToken);

          axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        if (typeof window !== "undefined") {
          localStorage.clear();
          if (window.location.pathname !== "/auth/login") {
            window.location.href = "/auth/login";
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
