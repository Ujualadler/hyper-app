import { BASE_URL } from "@/constants/config";
import { useAuth } from "@/Context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import { useRouter } from "expo-router";

// Set the base URL for your API dynamically from environment variables
const API_URL = process.env.REACT_APP_API_URL || BASE_URL;

// Dummy handleLogout function (implement as needed)
const handleLogout = async () => {
  const router = useRouter(); // Use the router for navigation
  try {
    await AsyncStorage.clear(); // Clear AsyncStorage to remove tokens or user data
    router.push("/login"); // Navigate to the login page
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add an interceptor to include the token in every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("accessToken");

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

      try {
        // Attempt to refresh access token
        const response = await axios.get(`${API_URL}/auth/refresh`, {
          withCredentials: true,
        });

        const { accessToken } = response.data;

        // Store new access token
        await AsyncStorage.setItem("accessToken", accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        handleLogout(); // Log out the user if refresh fails
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Define the function for getting all quizzes
export const getQuiz = async (id: string, type: string): Promise<any> => {
  try {
    const response = await api.get(`/quiz/getQuiz?id=${id}&type=${type}`);
    return response.data; // Return response data directly
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;

    console.error("Error getting quizzes:", axiosError.message);
    return {
      success: false,
      error: axiosError.response?.data || axiosError.message,
    };
  }
};

export const getAllQuiz = async (
  logout: any,
  category: string,
  difficulty: string
): Promise<any> => {
  try {
    const response = await api.get(
      `/quiz/getAllQuiz?id=${category}&difficulty=${difficulty}`
    );
    return response.data; // Return response data directly
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;

    console.error("Error getting quizzes:", axiosError.message);
    return {
      success: false,
      error: axiosError.response?.data || axiosError.message,
    };
  }
};

// Define types for submission data and response
interface SubmissionData {
  quizId: string;
  difficulty: string;
  totalTime: number;
  answers: Array<{
    questionId: string;
    answer: string | string[]; // Can be a single string or multiple answers
  }>;
}

interface SubmitResponse {
  success: boolean;
  data?: any; // Use a more specific type if possible
  error?: any; // Use a more specific type if possible
}

// Define the function for submitting answers
export const submitAnswers = async (
  submissionData: SubmissionData
): Promise<SubmitResponse> => {
  try {
    console.log(submissionData);
    const token = await AsyncStorage.getItem("accessToken");
    const response = await api.post("/quiz/submitAssessment", submissionData);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;

    // Handle error cases
    // const status = axiosError?.response?.status;

    // console.log(status);
    // if (status === 401 || status === 403) {
    //   handleLogout(); // Log out if unauthorized
    // }

    console.error("Error submitting answers:", axiosError.message);
    return {
      success: false,
      error: axiosError.response?.data || axiosError.message,
    };
  }
};

export const getRankList = async (
  assessmentId: string
): Promise<SubmitResponse> => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const response = await api.post("/quiz/getRankList", {
      assessmentId: assessmentId,
    });
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;

    // // Handle error cases
    // const status = axiosError?.response?.status;

    // console.log(status);
    // if (status === 401 || status === 403) {
    //   handleLogout(); // Log out if unauthorized
    // }

    console.error("Error submitting answers:", axiosError.message);
    return {
      success: false,
      error: axiosError.response?.data || axiosError.message,
    };
  }
};

export const getAllRank = async (): Promise<SubmitResponse> => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const response = await api.get("/quiz/allrank");
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;

    // Handle error cases
    const status = axiosError?.response?.status;

    // console.log(status);
    // if (status === 401 || status === 403) {
    //   handleLogout(); // Log out if unauthorized
    // }

    console.error("Error submitting answers:", axiosError.message);
    return {
      success: false,
      error: axiosError.response?.data || axiosError.message,
    };
  }
};

export const getPreviousQuiz = async (logout: any): Promise<SubmitResponse> => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const response = await api.get("/quiz/getPrevQuiz");
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;

    // Handle error cases
    const status = axiosError?.response?.status;

    // console.log(status);
    // if (status === 401 || status === 403) {
    //   logout(); // Log out if unauthorized
    // }

    console.error("Error submitting answers:", axiosError.message);
    return {
      success: false,
      error: axiosError.response?.data || axiosError.message,
    };
  }
};
