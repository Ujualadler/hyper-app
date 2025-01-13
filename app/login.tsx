import {
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  BackHandler,
  Image,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Button,
  HelperText,
  TextInput,
  DefaultTheme,
  Text,
} from "react-native-paper";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { loginUser } from "@/Services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import { useAuth } from "@/Context/AuthContext";
import GoogleLogin from "@/components/GoogleLogin";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");
const scaleFont = (size: any) => (width / 375) * size;

export default function Login() {
  const mode = useColorScheme();
  const router = useRouter();
  const { setAccessToken, setUserName, loading } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [loadings, setLoading] = useState(false);
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
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async () => {
    if (validateEmail(email) && validatePassword(password)) {
      setLoading(true); // Show loading spinner
      try {
        const response = await loginUser(email, password);

        if (response.message === "Login Success") {
          console.log("Login successful, token:", response.token);
          await SecureStore.setItemAsync("accessToken", response.token);
          await SecureStore.setItemAsync("refreshToken", response.refreshToken);
          await SecureStore.setItemAsync("userName", response.name);
          if (response.image) {
            await SecureStore.setItemAsync("profile", response?.image);
          }
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
      backgroundColor: "#1A1A24",
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: "space-between",
      marginBlock:40,
      alignItems: "center",
      // padding: width * 0.04,
    },
    titleContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
      marginBottom: height * 0.04,
    },
    inputContainer: {
      width: "90%",
      paddingHorizontal: width * 0.03,
      // marginBottom: height * 0.02,
      borderRadius: 30,
    },
    errorText: {
      color: "red",
      fontSize: scaleFont(12),
      marginTop: -10,
      marginBottom: 10,
    },
    textInput: {
      backgroundColor: "transparent",
      fontSize: scaleFont(16),
      borderColor: "#6846f3",
      borderRadius: 10,
      color: "white",
      height:50

    },
    buttonContent: {
      flexDirection: "row-reverse",
      backgroundColor: "#6846f3",
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
          {/* <ThemedText type="title" style={{ color: "#027bad",marginBottom:30 }}>
            HYPER
          </ThemedText> */}
          <Image
            source={require("../assets/images/hyperlogo.png")}
            style={{ height: 150, width: 150 }}
          />

          <ThemedText type="default" style={{ fontSize: 13, color: "white" }}>
            Login to your account
          </ThemedText>
        </ThemedView>

        <View style={styles.inputContainer}>
          <TextInput
            // label="Email"
            placeholder="Email"
            placeholderTextColor={"white"}
            textColor="white"
            theme={{ roundness: 20 }}
            value={email}
            mode="outlined"
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.textInput}
            contentStyle={{ borderRadius: 30 }}
            right={<TextInput.Icon color={"#6846f3"} icon="email" />}
          />
          <HelperText type="error" visible={!!emailError}>
            {emailError}
          </HelperText>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            // label="Password"
            placeholder="Password"
            placeholderTextColor={"white"}
            textColor="white"
            value={password}
            theme={{ roundness: 20 }}
            mode="outlined"
            onChangeText={handlePasswordChange}
            secureTextEntry={!isPasswordVisible} // Toggle visibility
            style={{ ...styles.textInput, borderRadius: 10 }}
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

        <View style={{...styles.inputContainer,marginBottom:15}}>
          <Button
            icon="arrow-right"
            mode="contained"
            onPress={handleLogin}
            contentStyle={styles.buttonContent}
            // disabled={!validateEmail(email) || !validatePassword(password)}
            loading={loadings} // Show spinner when loading
          >
            {loadings ? "Signing In..." : "Sign In"}
          </Button>
        </View>
        <View style={{display:'flex',justifyContent:'center',alignItems:'center',gap:4,width:'100%',flexDirection:'row',marginBottom:15}}>
          <View style={{width:'35%',height:1,backgroundColor:'grey'}}/>
          <ThemedText type="default" style={{ fontSize: 12, color: "grey" }}>
            OR
          </ThemedText>
          <View style={{width:'35%',height:1,backgroundColor:'grey'}}/>
        </View>
        <View style={styles.inputContainer}>
          <GoogleLogin name="Login with  " />
        </View>

        <View style={styles.inputContainer}>
          <Button mode="text" onPress={handleSignup} textColor="grey">
            Don't have an account?{" "}
            <Text style={{ color: "#6846f3" }}>Sign up</Text>
          </Button>
        </View>
      </View>
      <View style={{display:'flex',flexDirection:'column',gap:5,alignItems:'center'}}>
       <Text style={{color:'grey'}} variant="bodySmall" >By continuing, you agree to our </Text>
       <Text style={{color:'#6846f3'}} variant="bodySmall" >Terms of Use <Text variant="bodySmall" style={{color:'grey'}}>&</Text> Privacy policy </Text>
      </View>
    </ScrollView>
  );
}
