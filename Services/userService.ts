
import { api } from "@/config/api";
import { BASE_URL } from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";


// Set the base URL for your API dynamically from environment variables




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
  refreshToken:string;
  message: string;
  image:string;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>(`/login`, {
      userEmail: email,
      userPassword: password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error("Failed to login. Please check your credentials.");
  }
};
export const getProfile = async (
): Promise<any> => {
  try {
    const response = await api.get(`/user/profile`);
    return response.data;
  } catch (error) {
    console.error("Error getting profile:", error);
  }
};

export const postProfile = async (formData: any): Promise<any> => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");



    const response = await axios.post(`${BASE_URL}/user/profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
      transformRequest: (data, headers) => {
        return data; // this is doing the trick
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting profile:", error);
    throw new Error(error as any);
  }
};


export const changePassword = async (currentPassword:string,newPassword:string
): Promise<any> => {
  try {
    const response = await api.post(`/changePassword`,{newPassword,currentPassword});
    return response.data;
  } catch (error) {
    console.error("Error while chnaging password:", error);
  }
};


