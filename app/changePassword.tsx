import ParallaxScrollView from "@/components/ParallaxScrollView";
import { changePassword } from "@/Services/userService";
import {useRouter } from "expo-router";
import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button, Title, Snackbar, Text } from "react-native-paper";

function ChangePassword() {
    const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleUpdatePassword = async () => {
    if (validatePassword(newPassword)) {
      if (newPassword !== confirmPassword) {
        setSnackbarMessage("New password and confirmation do not match.");
        setSnackbarVisible(true);
        return;
      }

      try {
        const response = await changePassword(currentPassword, newPassword);
        if (response.message === "Password updated successfully!") {
          setSnackbarMessage("Password updated successfully!");
          router.push('/profile')
          setSnackbarVisible(true);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setSnackbarMessage(
        "Password must be at least 6 characters long, including uppercase, lowercase, and a number."
      );
      setSnackbarVisible(true);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      marginTopProp={0}
      // background="#28a0f6"
      headerImage={
        <Image
          source={{
            uri: "https://img.freepik.com/premium-vector/seo-scheme-neon-icon-web-development-vector-icon-element-simple-symbol-websites-web-design-mobile-app-infographics-line-symbol-website-design-white-background_120339-695.jpg?ga=GA1.1.1269269984.1718091501&semt=ais_hybrid",
          }}
          style={styles.topImage}
        />
      }
    >
      <View style={styles.container}>
      <View style={{ marginVertical: 20 }}>
          <Text variant="bodyLarge" style={styles.title}>
            Change Password
          </Text>
          {/* <Text variant="headlineLarge" style={styles.title}>
            
          </Text> */}
          {/* <Text
              variant="bodyLarge"
              style={{ color: "white", textAlign: "center", marginBottom: 15 }}
            >
              {formattedDate}
            </Text> */}
        </View>
        <TextInput
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button
          mode="contained"
          textColor="white"
          onPress={handleUpdatePassword}
          style={styles.button}
        >
          Update Password
        </Button>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={styles.snackbar}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor:'#1A1A24'
  },
  topImage: {
    height: 200,
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  title: {
    textAlign: "center",
    marginBottom: 5,
    fontFamily: "SairaStencilOne",
    fontWeight: "bold",
    color: "#fff", // Gold color for a standout effect
    textTransform: "uppercase", // Converts text to uppercase for a bold look
    letterSpacing: 2, // Adds spacing between letters
   // Shadow blur radius
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  button: {
    marginTop: 16,
    
    backgroundColor: "#6846f3",
    borderRadius:10,
    
  },
  snackbar: {
    // position: 'absolute',
    // top: 400, // Adjust this value to control vertical position
    // left: 0,
    // right: 0,
    // zIndex:100,
    marginBottom: 100,
    marginHorizontal: 16, // Optional: Add some horizontal margin
  },
});

export default ChangePassword;
