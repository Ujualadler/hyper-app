import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@/Context/AuthContext";
import Loader from "@/components/Loader";
import * as Linking from "expo-linking";

function HandleLogin() {
  const router = useRouter();
  const { setAccessToken, setUserName } = useAuth();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      if (processing) return; // Prevent multiple simultaneous processes
      setProcessing(true);

      console.log("Deep link received:", url);

      try {
        const { queryParams } = Linking.parse(url);
        const token = queryParams?.token;
        const name = queryParams?.name;
        const refreshToken = queryParams?.refreshToken;

        if (token && name && refreshToken) {
          console.log("Extracted params:", { token, name, refreshToken });

          // Store tokens securely
          await SecureStore.setItemAsync("accessToken", token as any);
          await SecureStore.setItemAsync("userName", name as any);
          await SecureStore.setItemAsync("refreshToken", refreshToken as any);

          // Update Auth Context
          console.log("Setting context...");
          setAccessToken(token as any);
          setUserName(name as any);

          // Wait for AuthContext to update fully
          setTimeout(() => {
            console.log("Navigating to home...");
            router.push("/");
          }, 500);
        } else {
          console.error("Invalid deep link data.");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error processing deep link:", error);
        router.push("/login");
      } finally {
        setProcessing(false);
      }
    };

    const checkInitialUrl = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        console.log("Initial URL:", initialUrl);
        if (initialUrl) await handleDeepLink(initialUrl);
      } catch (error) {
        console.error("Error fetching initial URL:", error);
      }
    };

    const subscription = Linking.addEventListener("url", (event) =>
      handleDeepLink(event.url)
    );

    checkInitialUrl();

    return () => subscription.remove();
  }, []);

  return <Loader />;
}

export default HandleLogin;
