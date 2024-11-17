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
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Pass the response if successful
  },
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const { data } = await axios.post(
            "http://localhost:5000/auth/refresh",
            {
              refreshToken,
            }
          );

          // Update localStorage and retry the failed request
          localStorage.setItem("accessToken", data.accessToken);
          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return axiosInstance(error.config); // Retry the original request
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        signOut(); // Log the user out if refresh fails
      }
    }

    // Handle other response errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
