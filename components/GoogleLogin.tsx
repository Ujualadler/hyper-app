import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

export default function GoogleLogin({ name }: any) {
  const BACKEND_GOOGLE_LOGIN_URL = "http://localhost:4000/auth/google";

  return (
    <View style={styles.container}>
      <Button
        style={styles.button}
        textColor="#027bad"
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
    borderColor: "#027bad",
    borderWidth: 1,
  },
  content: {
    flexDirection: "row-reverse", // Ensures the icon and text are aligned properly
  },
});
