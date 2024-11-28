import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type AuthContextType = {
  accessToken: string | null;
  userName: string | null;
  setAccessToken: (token: string | null) => void;
  setUserName: (name: string | null) => void;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
    const router = useRouter()
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load token and username from AsyncStorage
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const name = await AsyncStorage.getItem("userName");

        console.log("Loaded token:", token);
        console.log("Loaded userName:", name);

        setAccessToken(token);
        setUserName(name);
      } catch (error) {
        console.error("Error loading authentication data:", error);
      } finally {
        setLoading(false); // Ensure loading is complete
      }
    };

    loadAuthData();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("userName");
      setAccessToken(null);
      setUserName(null);
      router.push('/' as any)
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userName,
        setAccessToken,
        setUserName,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
