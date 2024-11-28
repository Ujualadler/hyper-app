import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { RootSiblingParent } from "react-native-root-siblings";
import { AuthProvider } from "@/Context/AuthContext";



// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

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
              name="reward"
              options={{ headerShown: true, title: "Rewards" }}
            />
            <Stack.Screen
              name="quiz/[id]"
              options={({ route }:any) => ({
                headerShown: false,
                gestureEnabled: false,
                animationEnabled: false,
                gestureHandlerProps: { enabled: false }, 
                title: route.params?.quizName || "Quiz", // Fallback to "Quiz" if quizName is not available
              })}
            />
            <Stack.Screen
              name="leaderboard/[id]"
              options={({ route }:any) => ({
                headerShown: true,
                title: route.params?.quizName || "LeaderBoard", 
              })}
            />
            <Stack.Screen
              name="instruction/[id]"
              options={({ route }:any) => ({
                headerShown: false,
                title: route.params?.quizName || "Instruction", 
              })}
            />
            <Stack.Screen
              name="allLeaders"
              options={{ headerShown: true, title: "All Leaders" }}
            />

            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </RootSiblingParent>
    </AuthProvider>
  );
}
