"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  UserCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// ==================== TYPES ====================

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userData: UserData | null;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, name: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signInWithGitHub: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface UserData {
  uid: string;
  email: string;
  name: string | null;
  photoURL: string | null;
  role: string;
  status: string;
  organizationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== CONTEXT ====================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== HELPERS ====================

// Set or clear session cookie for middleware
function setSessionCookie(user: User | null) {
  if (user) {
    // Set a session cookie that expires in 7 days
    document.cookie = `firebase-session=${user.uid}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  } else {
    // Clear the session cookie
    document.cookie = "firebase-session=; path=/; max-age=0";
  }
}

// Also store user in localStorage for client-side checks
function setLocalStorage(user: User | null) {
  if (user) {
    localStorage.setItem("user", JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }));
  } else {
    localStorage.removeItem("user");
  }
}

// ==================== PROVIDER ====================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // Create user document in Firestore
  const createUserData = async (user: User, name?: string) => {
    const userData: UserData = {
      uid: user.uid,
      email: user.email || "",
      name: name || user.displayName,
      photoURL: user.photoURL,
      role: "OWNER",
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return userData;
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Set session cookie for middleware
        setSessionCookie(user);
        setLocalStorage(user);

        // Fetch or create user data
        let data = await fetchUserData(user.uid);
        if (!data) {
          data = await createUserData(user);
        }
        setUserData(data);
      } else {
        setSessionCookie(null);
        setLocalStorage(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    // Update profile with name
    await updateProfile(credential.user, { displayName: name });

    // Send email verification
    await sendEmailVerification(credential.user);

    // Create user document in Firestore
    await createUserData(credential.user, name);

    return credential;
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Sign in with GitHub
  const signInWithGitHub = async () => {
    const provider = new GithubAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Sign out
  const signOut = async () => {
    await firebaseSignOut(auth);
    setSessionCookie(null);
    setLocalStorage(null);
    setUser(null);
    setUserData(null);
  };

  // Reset password
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Refresh user data
  const refreshUser = async () => {
    if (user) {
      const data = await fetchUserData(user.uid);
      setUserData(data);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    userData,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    resetPassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ==================== HOOK ====================

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export default AuthContext;
