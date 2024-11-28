// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-PxGBELmTcFXGfVFAV4d2IGa_lgxGp44",
  authDomain: "hyper-a2108.firebaseapp.com",
  projectId: "hyper-a2108",
  storageBucket: "hyper-a2108.firebasestorage.app",
  messagingSenderId: "837899650194",
  appId: "1:837899650194:web:dfcec560708006d7c9124b",
  measurementId: "G-KRB20TERVS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { auth };