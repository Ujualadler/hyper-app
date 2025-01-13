// Logout.js
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export const handleLogout = async (router:any) => {
  try {
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('userName');
    router.push("/login"); // Navigate to the login page
  } catch (error) {
    console.error("Error during logout:", error);
  }
};