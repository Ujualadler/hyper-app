import { StyleSheet, ScrollView, View, Text, Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button, HelperText, TextInput } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useLocalSearchParams, useRouter } from "expo-router";
import { loginUser } from "@/Services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import { useAuth } from "@/Context/AuthContext";
import GoogleLogin from "@/components/GoogleLogin";

const { width, height } = Dimensions.get("window");
const scaleFont = (size: any) => (width / 375) * size;

export default function Login() {
  const mode = useColorScheme();
  const router = useRouter();
  const { token, name } = useLocalSearchParams();
  const { setAccessToken, setUserName, loading } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [loadings, setLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const handleNavigation = async () => {
      if (token && name) {
        // Save token and username
        await AsyncStorage.setItem("accessToken", token as string);
        await AsyncStorage.setItem("userName", name as string);
        setAccessToken(token as string);
        setUserName(name as string);

        // Show success message
        Toast.show(`Welcome Back ${name}`, {
          duration: Toast.durations.LONG,
        });

        // Ensure navigation happens after saving
        router.push("/" as any);
      }
    };

    handleNavigation(); // Call the function to manage async/await properly
  }, [token, name, setAccessToken, setUserName, router]);

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async () => {
    if (validateEmail(email) && validatePassword(password)) {
      setLoading(true); // Show loading spinner
      try {
        const response = await loginUser(email, password);

        if (response.message === "Login Success") {
          console.log("Login successful, token:", response.token);
          await AsyncStorage.setItem("accessToken", response.token);
          await AsyncStorage.setItem("userName", response.name);
          setAccessToken(response.token);
          setUserName(response.name);

          Toast.show(`Welcome Back ${response.name}`, {
            duration: Toast.durations.LONG,
          });

          router.push("/" as any);
        } else if (response.message === "Invalid Email") {
          setEmailError(response.message);
        } else if (response.message === "Invalid Password") {
          setPasswordError(response.message);
        }
      } catch (error: any) {
        console.error("Login error:", error.message);
        setEmailError("");
        setPasswordError("Invalid email or password.");
      } finally {
        setLoading(false); // Hide loading spinner after response
      }
    } else {
      if (!validateEmail(email)) setEmailError("Please enter a valid email.");
      if (!validatePassword(password))
        setPasswordError(
          "Password must be at least 6 characters long, including uppercase, lowercase, and a number."
        );
    }
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  const handleEmailChange = (email: string) => {
    setEmail(email);
    setEmailError(validateEmail(email) ? "" : "Please enter a valid email.");
  };

  const handlePasswordChange = (password: string) => {
    const passwordWithoutSpaces = password.replace(/\s/g, "");
    setPassword(passwordWithoutSpaces);
    setPasswordError(
      validatePassword(passwordWithoutSpaces)
        ? ""
        : "Password must be at least 6 characters long, include an uppercase letter, a lowercase letter, and a number."
    );
  };

  const isDarkMode = mode === "dark";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
      backgroundColor: "#ffbc38",
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: width * 0.04,
    },
    titleContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor:'transparent',
      marginBottom: height * 0.04,
    },
    inputContainer: {
      width: "90%",
      paddingHorizontal: width * 0.03,
      marginBottom: height * 0.02,
      borderRadius:30
    },  
    errorText: {
      color: "red",
      fontSize: scaleFont(12),
      marginTop: -10,
      marginBottom: 10,
    },
    textInput: {
      backgroundColor: isDarkMode ? "#333333" : "#FFFFFF",
      fontSize: scaleFont(16),
      borderColor:'#027bad',
      borderRadius:30,

    },
    buttonContent: {
      flexDirection: "row-reverse",
      backgroundColor: "#027bad",
    },
    buttonLabel: {
      fontSize: scaleFont(16),
      color: "#FFFFFF",
    },
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={{ width: "100%", alignItems: "center" }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle" style={{ color: "#027bad" }}>
            Welcome back
          </ThemedText>
          <ThemedText type="default" style={{ fontSize: 13 }}>
            Login to your account
          </ThemedText>
        </ThemedView>

        <View style={styles.inputContainer}>
          <TextInput
            label="Email"
            value={email}
            mode="outlined"
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.textInput}
            right={<TextInput.Icon color={"#027bad"} icon="email" />}
          />
          <HelperText type="error" visible={!!emailError}>
            {emailError}
          </HelperText>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label="Password"
            value={password}
            mode="outlined"
            onChangeText={handlePasswordChange}
            secureTextEntry={!isPasswordVisible} // Toggle visibility
            style={styles.textInput}
            right={
              <TextInput.Icon
                color={"#027bad"}
                icon={isPasswordVisible ? "eye-off" : "eye"} // Change icon based on state
                onPress={() => setPasswordVisible(!isPasswordVisible)} // Toggle state
              />
            }
          />
          <HelperText type="error" visible={!!passwordError}>
            {passwordError}
          </HelperText>
        </View>

        <View style={styles.inputContainer}>
          <Button
            icon="arrow-right"
            mode="contained"
            onPress={handleLogin}
            contentStyle={styles.buttonContent}
            disabled={!validateEmail(email) || !validatePassword(password)}
            loading={loadings} // Show spinner when loading
          >
            {loadings ? "Signing In..." : "Sign In"}
          </Button>
        </View>
        <View style={styles.inputContainer}>
          <GoogleLogin name="Login with google" />
        </View>

        <View style={styles.inputContainer}>
          <Button mode="text" onPress={handleSignup} textColor="#111">
            Don't have an account?{" "}
            <Text style={{ color: "#027bad" }}>Sign up</Text>
          </Button>
          <Button
            mode="text"
            onPress={() => router.push("/" as any)}
            textColor="#111"
          >
            home
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
