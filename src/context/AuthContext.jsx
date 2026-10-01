import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Check localStorage for demo mock login session if offline/demo
          const mockUserStr = localStorage.getItem("farmsaarthi_demo_user");
          if (mockUserStr) {
            try {
              setUser(JSON.parse(mockUserStr));
            } catch (e) {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn("Firebase Auth fallback active:", err);
      const mockUserStr = localStorage.getItem("farmsaarthi_demo_user");
      if (mockUserStr) {
        try {
          setUser(JSON.parse(mockUserStr));
        } catch (e) {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const signInWithEmail = async (email, password) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      setUser(credential.user);
      return { user: credential.user, error: null };
    } catch (error) {
      console.warn("Firebase Auth Error, using demo mode fallback if placeholder keys", error);
      if (error.code === "auth/invalid-api-key" || error.code === "auth/api-key-not-valid" || auth.app.options.apiKey === "YOUR_API_KEY_HERE") {
        const demoUser = {
          uid: "demo-user-id-" + Date.now(),
          email: email,
          displayName: email.split("@")[0],
          isDemo: true
        };
        localStorage.setItem("farmsaarthi_demo_user", JSON.stringify(demoUser));
        setUser(demoUser);
        return { user: demoUser, error: null };
      }
      return { user: null, error: error.message };
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const newAuthUser = credential.user;
      
      // Create user document in Firestore users collection
      try {
        await setDoc(doc(db, "users", newAuthUser.uid), {
          email: newAuthUser.email,
          createdAt: serverTimestamp(),
          theme: "system"
        });
      } catch (dbErr) {
        console.warn("Firestore user creation note:", dbErr);
      }

      setUser(newAuthUser);
      return { user: newAuthUser, error: null };
    } catch (error) {
      if (error.code === "auth/invalid-api-key" || error.code === "auth/api-key-not-valid" || auth.app.options.apiKey === "YOUR_API_KEY_HERE") {
        const demoUser = {
          uid: "demo-user-id-" + Date.now(),
          email: email,
          displayName: email.split("@")[0],
          isDemo: true
        };
        localStorage.setItem("farmsaarthi_demo_user", JSON.stringify(demoUser));
        setUser(demoUser);
        return { user: demoUser, error: null };
      }
      return { user: null, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const googleUser = credential.user;

      try {
        const userRef = doc(db, "users", googleUser.uid);
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
          await setDoc(userRef, {
            email: googleUser.email,
            createdAt: serverTimestamp(),
            theme: "system"
          });
        }
      } catch (dbErr) {
        console.warn("Firestore Google user check note:", dbErr);
      }

      setUser(googleUser);
      return { user: googleUser, error: null };
    } catch (error) {
      if (error.code === "auth/invalid-api-key" || error.code === "auth/api-key-not-valid" || auth.app.options.apiKey === "YOUR_API_KEY_HERE" || error.code === "auth/popup-closed-by-user") {
        const demoUser = {
          uid: "demo-google-user",
          email: "farmer.demo@farmsaarthi.org",
          displayName: "Demo Farmer",
          isDemo: true
        };
        localStorage.setItem("farmsaarthi_demo_user", JSON.stringify(demoUser));
        setUser(demoUser);
        return { user: demoUser, error: null };
      }
      return { user: null, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn("Firebase signout fallback", e);
    }
    localStorage.removeItem("farmsaarthi_demo_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
