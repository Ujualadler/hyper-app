import { api } from "@/config/api";
import { BASE_URL } from "@/constants/config";
import { useAuth } from "@/Context/AuthContext";
import axios, { AxiosError } from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";


// Set the base URL for your API dynamically from environment variables


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
  difficulty: string,
  searchText:string,
): Promise<any> => {
  try {
    const response = await api.get(
      `/quiz/getAllQuiz?id=${category}&difficulty=${difficulty}&search=${searchText}`
    );
    return response.data; // Return response data directly
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;

    console.error("Error getting all quizzes:", axiosError.message);
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

    const response = await api.post("/quiz/submitAssessment", submissionData);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;


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
    const response = await api.post("/quiz/getRankList", {
      assessmentId: assessmentId,
    });
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;

    console.error("Error getting rankList:", axiosError.message);
    return {
      success: false,
      error: axiosError.response?.data || axiosError.message,
    };
  }
};

export const getAllRank = async (): Promise<SubmitResponse> => {
  try {
    const response = await api.get("/quiz/allrank");
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;

    // Handle error cases
    const status = axiosError?.response?.status;

    console.error("Error getting all ranks:", axiosError.message);
    return {
      success: false,
      error: axiosError.response?.data || axiosError.message,
    };
  }
};

export const getPreviousQuiz = async (): Promise<SubmitResponse> => {
  try {
    const response = await api.get("/quiz/getPrevQuiz");
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;

    // Handle error cases
    const status = axiosError?.response?.status;


    console.error("Error getting previous quizes:", axiosError.message);
    return {
      success: false,
      error: axiosError.response?.data || axiosError.message,
    };
  }
};
