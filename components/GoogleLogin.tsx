import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { BASE_URL } from "@/constants/config";

export default function GoogleLogin({ name }: any) {
  const BACKEND_GOOGLE_LOGIN_URL = `${BASE_URL}/auth/google`;

  return (
    <View style={styles.container}>
      <Button
        style={styles.button}
        textColor="#6846f3"
        contentStyle={styles.content}
        icon={({ size, color }) => (
          <MaterialCommunityIcons name="google" size={size} color={color} />
        )}
        onPress={() => {
          WebBrowser.openBrowserAsync(BACKEND_GOOGLE_LOGIN_URL); // Trigger backend Google OAuth
        }}
      >
        {name}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    borderColor: "#6846f3",
    borderWidth: 1,
  },
  content: {
    flexDirection: "row-reverse", // Ensures the icon and text are aligned properly
  },
});
