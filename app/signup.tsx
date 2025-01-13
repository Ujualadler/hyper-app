import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  Alert,
  BackHandler,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button, HelperText, TextInput } from "react-native-paper";
import React, { useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { signUpUser } from "@/Services/userService";
import axios from "axios";
import GoogleLogin from "@/components/GoogleLogin";

const { width, height } = Dimensions.get("window");
const scaleFont = (size: any) => (width / 375) * size;

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Prevent back navigation
        return true; // Returning true prevents back navigation
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => {
        subscription.remove(); // Cleanup on unmount
      };
    }, [])
  );

  // Validation functions
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]{6,}$/.test(
      password
    );

  const validateUserName = (userName: string) => userName.length >= 3;

  // Input change handlers with space restriction
  const handleEmailChange = (email: string) => {
    const trimmedEmail = email.replace(/\s/g, "");
    setEmail(trimmedEmail);
    setEmailError(
      validateEmail(trimmedEmail) ? "" : "Please enter a valid email."
    );
  };

  const handlePasswordChange = (password: string) => {
    const trimmedPassword = password.replace(/\s/g, "");
    setPassword(trimmedPassword);
    setPasswordError(
      validatePassword(trimmedPassword)
        ? ""
        : "Password must be at least 6 characters long, including uppercase, lowercase, and a number."
    );
  };

  const handleUserNameChange = (userName: string) => {
    const trimmedUserName = userName;
    setUserName(trimmedUserName);
    setUserNameError(
      validateUserName(trimmedUserName)
        ? ""
        : "Username must be at least 3 characters."
    );
  };

  const registerUser = async () => {
    if (
      validateEmail(email) &&
      validatePassword(password) &&
      validateUserName(userName)
    ) {
      try {
        const response = await signUpUser(email, password, userName);

        if (response === "created successfuly") {
          Alert.alert("Success", "Account created successfully!");
          router.push("/login");
        } else if (response === "User already exist") {
          Alert.alert("Account already exists");
          router.push("/login");
        } else {
          Alert.alert("Error", response || "Something went wrong.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        Alert.alert("Error", "Failed to connect to the server.");
      }
    } else {
      if (!validateEmail(email)) setEmailError("Please enter a valid email.");
      if (!validatePassword(password))
        setPasswordError(
          "Password must be at least 6 characters long, include an uppercase letter, a lowercase letter, and a number."
        );
      if (!validateUserName(userName))
        setUserNameError("Username must be at least 3 characters.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="default" style={{ fontSize: 13, color: "white" }}>
          Create your new account
        </ThemedText>
      </ThemedView>

      <View style={styles.inputContainer}>
        <TextInput
          // label="Name"
          placeholder="Name"
          textColor="white"
          value={userName}
          mode="outlined"
          placeholderTextColor={"white"}
          theme={{ roundness: 20 }}
          onChangeText={handleUserNameChange}
          keyboardType="default"
          autoCapitalize="none"
          style={styles.textInput}
          right={<TextInput.Icon color={"#6846f3"} icon="account" />}
        />
        <HelperText type="error" visible={userNameError ? true : false}>
          {userNameError}
        </HelperText>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          // label="Email"
          placeholder="Email"
          textColor="white"
          value={email}
          mode="outlined"
          placeholderTextColor={"white"}
          theme={{ roundness: 20 }}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.textInput}
          right={<TextInput.Icon color={"#6846f3"} icon="email" />}
        />
        <HelperText type="error" visible={emailError ? true : false}>
          {emailError}
        </HelperText>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          // label="Password"
          placeholder="Password"
          textColor="white"
          mode="outlined"
          value={password}
          placeholderTextColor={"white"}
          theme={{ roundness: 20 }}
          onChangeText={handlePasswordChange}
          secureTextEntry={!isPasswordVisible} // Toggle visibility
          style={styles.textInput}
          right={
            <TextInput.Icon
              color={"#6846f3"}
              icon={isPasswordVisible ? "eye-off" : "eye"} // Change icon based on state
              onPress={() => setPasswordVisible(!isPasswordVisible)} // Toggle state
            />
          }
        />
        <HelperText type="error" visible={!!passwordError}>
          {passwordError}
        </HelperText>
      </View>

      <View style={{ ...styles.inputContainer, marginBottom: 5 }}>
        <Button
          icon="arrow-right"
          mode="contained"
          onPress={registerUser}
          contentStyle={styles.buttonContent}
          disabled={
            !validateEmail(email) ||
            !validatePassword(password) ||
            !validateUserName(userName)
          }
        >
          Create account
        </Button>
      </View>
      <View style={styles.inputContainer}>
        <GoogleLogin name="Sign up with " />
      </View>

      <View style={styles.inputContainer}>
        <Button
          mode="text"
          onPress={() => router.push("/login")}
          textColor="grey"
        >
          Already have an account?{" "}
          <Text style={{ color: "#6846f3" }}>Sign in</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    // flex: 1,
  },
  container: {
    // flex: 1,
    // gap:0,
    backgroundColor: "#1A1A24",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
    padding: width * 0.04,
  },
  titleContainer: {
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#",
    alignItems: "center",
    //   gap: height * 0.02,
    marginBottom: height * 0.04,
  },
  titleText: {
    fontSize: scaleFont(24),
  },
  inputContainer: {
    width: "90%", // Set a percentage width for responsiveness
    paddingHorizontal: width * 0.03,
    // marginBottom: height * 0.01,
  },
  textInput: {
    backgroundColor: "transparent",
    fontSize: scaleFont(16),
    borderColor: "#6846f3",
    color: "white",
  },
  errorText: {
    color: "red",
    fontSize: scaleFont(12),
    marginTop: -10,
    marginBottom: 10,
  },
  buttonContent: {
    flexDirection: "row-reverse",
    backgroundColor: "#6846f3",
  },
});
