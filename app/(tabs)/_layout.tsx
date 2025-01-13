import { Tabs, useRouter, useSegments } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/Context/AuthContext";
import * as SecureStore from "expo-secure-store";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BASE_URL } from "@/constants/config";
import { getProfile } from "@/Services/userService";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { accessToken, loading, logout, profile } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState<any>({});
  const [isTokenValid, setIsTokenValid] = useState<boolean>(true);
  const [tabOpacity, setTabBarOpacity] = useState(1);

  const previousScrollPosition = useRef(0);

  const handleScroll = (event: any) => {
    const currentScrollPosition = event.nativeEvent.contentOffset.y;

    if (currentScrollPosition > previousScrollPosition.current + 10) {
      // Scrolling down
      if (tabOpacity !== 0) setTabBarOpacity(0);
    } else if (currentScrollPosition < previousScrollPosition.current) {
      // Scrolling up
      if (tabOpacity !== 1) setTabBarOpacity(1);
    }

    // Update previous scroll position
    previousScrollPosition.current = currentScrollPosition;
  };

  // Handle Access Token and validate login
  const checkAccessToken = async () => {
    if (!loading && !accessToken) {
      setIsTokenValid(false);
      console.log("Redirecting to login due to missing token.");
      await logout();
    } else {
      setIsTokenValid(true);
      console.log("Token found, staying on tabs.");
    }
  };

  // Fetch profile information if accessToken exists
  const fetchProfile = async () => {
    if (accessToken) {
      try {
        const data = await getProfile(); // Assuming this is an API call
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
  };

  useEffect(() => {
    checkAccessToken();
    if (accessToken) fetchProfile();
  }, [accessToken, loading]);

  const handleTabPress = (url: string, page: string) => {
    // Trigger haptic feedback
    setCurrentPage(page);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push(url as any);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        // header: () => <Header />,
        tabBarStyle: {
          opacity: tabOpacity,
          backgroundColor: "transparent",
          display: "flex",
          height: 52,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
          overflow: "hidden",
          margin: 5,
          borderTopWidth: 0,
          paddingTop: 5,
          zIndex: 0,
          marginHorizontal: 50,
          position: "absolute", // Floating tab bar
          // left: 10,
          // padding: 120,
          // right: 10,
          // bottom: 0,
          // paddingHorizontal: 10,
          elevation: 1,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={["#7B5CFC", "#4A32AD"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientBackground}
          />
        ),

        tabBarShowLabel: false,
        tabBarInactiveTintColor: "#ccc",
        tabBarItemStyle: {
          paddingVertical: 0, // Remove vertical padding
          margin: 0, // Remove margins
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "HOME",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TouchableOpacity onPress={() => handleTabPress("/", "home")}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {focused ? (
                  <Image
                    style={{
                      height: 21,
                      width: 21,

                      // borderRadius: 50,
                    }}
                    source={require("../../assets/images/home2.png")}
                  />
                ) : (
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      // borderRadius: 50,
                    }}
                    source={require("../../assets/images/home1.png")}
                  />
                )}
                {focused && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: -5,
                      // shadowColor: "red", // Glow base color
                      // shadowOpacity: 0.9, // Glow intensity
                      // shadowRadius: 20, // Glow spread
                      // shadowOffset: { width: 10, height: 10 }, // Centered glow
                      // elevation: 10, // Android glow
                    }}
                  >
                    <LinearGradient
                      colors={["#79E7FF", "#0B5EFF"]} // Gradient colors
                      start={{ x: 1, y: 0 }}
                      end={{ x: 1, y: 1 }} // Horizontal gradient
                      style={{
                        height: 1.5,
                        width: 20,
                        marginTop: 5,
                        borderRadius: 1.5,
                      }}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="overallRank"
        options={{
          title: "Leaderboard",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TouchableOpacity
              onPress={() => handleTabPress("/overallRank", "oevrallRank")}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {focused ? (
                  <Image
                    style={{
                      height: 21,
                      width: 21,
                      // borderRadius: 50,
                    }}
                    source={require("../../assets/images/leader2.png")}
                  />
                ) : (
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      // borderRadius: 50,
                    }}
                    source={require("../../assets/images/leader1.png")}
                  />
                )}
                {focused && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: -5,
                      // shadowColor: "red", // Glow base color
                      // shadowOpacity: 0.9, // Glow intensity
                      // shadowRadius: 20, // Glow spread
                      // shadowOffset: { width: 10, height: 10 }, // Centered glow
                      // elevation: 10, // Android glow
                    }}
                  >
                    <LinearGradient
                      colors={["#79E7FF", "#0B5EFF"]} // Gradient colors
                      start={{ x: 1, y: 0 }}
                      end={{ x: 1, y: 1 }} // Horizontal gradient
                      style={{
                        height: 1.5,
                        width: 20,
                        marginTop: 5,
                        borderRadius: 1.5,
                      }}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "PROFILE",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TouchableOpacity
              onPress={() => handleTabPress("/profile", "profile")}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {focused ? (
                  <Image
                    style={{
                      height: 21,
                      width: 21,
                      // borderRadius: 50,
                    }}
                    source={require("../../assets/images/profile2.png")}
                  />
                ) : (
                  <Image
                    style={{
                      height: 20,
                      width: 20,

                      // borderRadius: 50,
                    }}
                    source={require("../../assets/images/profile1.png")}
                  />
                )}
                {focused && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: -5,
                      // shadowColor: "red", // Glow base color
                      // shadowOpacity: 0.9, // Glow intensity
                      // shadowRadius: 20, // Glow spread
                      // shadowOffset: { width: 10, height: 10 }, // Centered glow
                      // elevation: 10, // Android glow
                    }}
                  >
                    <LinearGradient
                      colors={["#79E7FF", "#0B5EFF"]} // Gradient colors
                      start={{ x: 1, y: 0 }}
                      end={{ x: 1, y: 1 }} // Horizontal gradient
                      style={{
                        height: 1.5,
                        width: 20,
                        marginTop: 5,
                        borderRadius: 1.5,
                      }}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  statusBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Ensure it overlays all components
    height: 24, // Use default height if unavailable
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glow: {
    shadowColor: "#79E7FF", // Glow color
    shadowOpacity: 0.9, // Adjust glow intensity
    shadowRadius: 10, // Spread of the glow
    shadowOffset: { width: 0, height: 0 }, // Position of the glow
    elevation: 10, // Required for Android
  },
});
