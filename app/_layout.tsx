import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { RootSiblingParent } from "react-native-root-siblings";
import { AuthProvider } from "@/Context/AuthContext";
import { Animated, Linking, StatusBar } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const scrollY = useRef(new Animated.Value(0)).current;
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(true);

  useEffect(() => {
    let lastOffset = 0;

    const listener = scrollY.addListener(({ value }) => {
      if (value - lastOffset > 10) {
        // Scrolled up: hide the status bar
        setIsStatusBarVisible(false);
      } else if (lastOffset - value > 10 || value <= 0) {
        // Scrolled down or stopped: show the status bar
        setIsStatusBarVisible(true);
      }
      lastOffset = value;
    });

    return () => scrollY.removeListener(listener);
  }, [scrollY]);

  console.log(isStatusBarVisible);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootSiblingParent>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          {isStatusBarVisible && (
            <StatusBar
              animated={true}
              translucent={true} // Allows content to appear under the StatusBar
              barStyle="light-content" // Makes the text/icons light for dark backgrounds
              showHideTransition={"fade"} // Transition effect when showing/hiding
              backgroundColor="rgba(0, 0, 0, 0.3)" // Dark transparent color
            />
          )}

          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="login"
              options={{ headerShown: false, title: "" }}
            />
            <Stack.Screen
              name="signup"
              options={{ headerShown: false, title: "" }}
            />
            <Stack.Screen
              name="quizend"
              options={{ headerShown: true, title: "" }}
            />
            <Stack.Screen
              name="overallRank"
              options={{ headerShown: false, title: "Leaderboard" }}
            />
            <Stack.Screen
              name="previousQuiz"
              options={{ headerShown: false, title: "Your Quizzes" }}
            />
            <Stack.Screen
              name="reward"
              options={{ headerShown: false, title: "Rewards" }}
            />
            <Stack.Screen
              name="editProfile"
              options={{ headerShown: true, title: "Edit Profile" }}
            />
            <Stack.Screen
              name="handleLogin"
              options={{ headerShown: false, title: "Handle Login" }}
            />
            <Stack.Screen
              name="quiz/[id]"
              options={({ route }: any) => ({
                headerShown: false,
                // gestureEnabled: false,
                // animationEnabled: false,
                // gestureHandlerProps: { enabled: false },
                title: route.params?.quizName || "Quiz", // Fallback to "Quiz" if quizName is not available
              })}
            />
            <Stack.Screen
              name="leaderboard/[id]"
              options={({ route }: any) => ({
                headerShown: false,
                gestureEnabled: true,
                title: route.params?.quizName || "Leaderboard",
              })}
            />
            <Stack.Screen
              name="instruction/[id]"
              options={({ route }: any) => ({
                headerShown: false,
                title: route.params?.quizName || "Instruction",
              })}
            />

            <Stack.Screen
              name="changePassword"
              options={{ headerShown: false, title: "Reset Password" }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </RootSiblingParent>
    </AuthProvider>
  );
}
