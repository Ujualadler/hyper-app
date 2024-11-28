import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/Context/AuthContext";
// Import your custom header

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { accessToken, loading, logout } = useAuth();
  const router = useRouter();

  console.log(accessToken + "this is for testing access token");

  useEffect(() => {
    if (!loading) {
      if (!accessToken) {
        console.log("Redirecting to login due to missing token.");
        logout();
      } else {
        console.log("Token found, staying on tabs.");
      }
    }
  }, [accessToken, loading]);

  // If accessToken is missing, render nothing (to avoid flashing content)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
          header: () => <Header />, // Use CustomHeader as the header for all tabs
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person-circle" : "person-circle-outline"}
                color={color}
                size={24} // Adjust the size as needed
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
