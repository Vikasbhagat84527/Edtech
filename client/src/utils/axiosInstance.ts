import axios from "axios";
import { signOut } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
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

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful responses directly
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (401 error)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (typeof window !== "undefined") {
          const refreshToken = localStorage.getItem("refreshToken");

          if (!refreshToken) {
            throw new Error("Refresh token is missing");
          }

          // Call refresh token endpoint
          const response = await axios.post(
            "http://localhost:5000/auth/refresh-token",
            { refreshToken }
          );

          const { accessToken } = response.data;

          // Update tokens in localStorage
          localStorage.setItem("accessToken", accessToken);

          // Update Authorization headers
          axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // Retry the failed request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        if (typeof window !== "undefined") {
          // Clear tokens and redirect to login
          localStorage.clear();
          window.location.href = "/auth/login";
        }
      }
    }

    // Reject other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
