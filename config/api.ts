import { BASE_URL } from "@/constants/config";
import axios from "axios";
import { router, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { handleLogout } from "@/constants/Logout";

const API_URL = process.env.REACT_APP_API_URL || BASE_URL;

// Dummy handleLogout function (implement as needed)

// Create an Axios instance
export const api = axios.create({
  baseURL: API_URL,
});

// Add an interceptor to include the token in every request
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("accessToken");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response, // Pass successful responses through
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      try {
        // Attempt to refresh access token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });
        const { accessToken } = response.data;

        // Store new access token
        await SecureStore.setItemAsync("accessToken", accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        handleLogout(router); // Log out the user if refresh fails
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
