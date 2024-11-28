
import { BASE_URL } from "@/constants/config";
import axios, { AxiosError } from "axios";

// Set the base URL for your API dynamically from environment variables
const API_URL = process.env.REACT_APP_API_URL || BASE_URL;

// Configure Axios instance with default settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Define an interface for the expected response data
interface ApiResponse {
  message: string;
}

// Define the function for user registration
export const signUpUser = async (
  email: string,
  password: string,
  userName: string
): Promise<string | undefined> => {
  // return type is string (message) or undefined in case of an error
  try {
    const response = await api.post<ApiResponse>("/register", {
      userEmail: email,
      userPassword: password,
      userName: userName,
    });

    console.log("User registered successfully:", response.data);
    return response.data.message; // Accessing 'message' on typed 'response.data'
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;

    if (axiosError.response && axiosError.response.data) {
      console.error(
        "Registration failed:",
        axiosError.response.data.message || "An error occurred"
      );
      throw new Error(
        axiosError.response.data.message || "Registration failed"
      );
    } else {
      console.error("Network or server error:", axiosError.message);
      throw new Error("Network error or server is unavailable");
    }
  }
};

interface LoginResponse {
  token: string;
  name: string;
  message: string;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
      userEmail: email,
      userPassword: password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error("Failed to login. Please check your credentials.");
  }
};
