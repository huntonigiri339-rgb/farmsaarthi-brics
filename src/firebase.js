// Replace with your Firebase config from console.firebase.google.com
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9BYd2bOM6DKhpBA3CAsBO7ENni7QzgQQ",
  authDomain: "farmsaarthi-brics.firebaseapp.com",
  projectId: "farmsaarthi-brics",
  storageBucket: "farmsaarthi-brics.firebasestorage.app",
  messagingSenderId: "461668631212",
  appId: "1:461668631212:web:412c7a945a6d43b1809509",
  measurementId: "G-5SPZEWJ8T9"
};

// Initialize Firebase app safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
