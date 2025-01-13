import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Loader from "@/components/Loader";

type AuthContextType = {
  accessToken: string | null;
  userName: string | null;
  profile: string | null;
  setAccessToken: (token: string | null) => void;
  setUserName: (name: string | null) => void;
  setProfile: (name: string | null) => void;
  logout: () => Promise<void>;
  loading: boolean;
  ready: boolean; // Indicate when context is ready
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [profile, setProfile] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [ready, setReady] = useState<boolean>(false);

  // Load authentication data from SecureStore on initialization
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        const name = await SecureStore.getItemAsync("userName");
        const profile = await SecureStore.getItemAsync("profile");

        console.log("Loaded token:", token);
        console.log("Loaded userName:", name);

        setAccessToken(token);
        setUserName(name);
        setProfile(profile);

        if (!token) {
          console.log("No token found, redirecting to login...");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error loading authentication data:", error);
      } finally {
        setLoading(false); // Stop loading state
        setReady(true); // Mark context as ready
      }
    };

    loadAuthData();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("userName");
      await SecureStore.deleteItemAsync("profile");

      setAccessToken(null);
      setUserName(null);
      setProfile(null);

      console.log("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Show loader until authentication context is ready
  if (!ready) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userName,
        profile,
        setProfile,
        setAccessToken,
        setUserName,
        logout,
        loading,
        ready,
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
