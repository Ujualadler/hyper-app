import AsyncStorage from "@react-native-async-storage/async-storage";

// Accept a `navigateToLogin` function as an argument
export const logout = async (navigateToLogin: () => void) => {
  try {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("userName");
    console.log("Values cleared from storage");
    navigateToLogin(); // Call the navigation function after clearing
  } catch (error) {
    console.error("Error clearing values:", error);
  }
};
