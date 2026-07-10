import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let firebaseAdminApp: App | null = null;

function getFirebaseAdminApp(): App {
  if (firebaseAdminApp) {
    return firebaseAdminApp;
  }

  if (getApps().length > 0) {
    firebaseAdminApp = getApps()[0];
    return firebaseAdminApp;
  }

  // Only initialize in runtime, not during build
  if (typeof window === 'undefined') {
    // Server-side only
    const serviceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT)
      : undefined;

    if (serviceAccount) {
      firebaseAdminApp = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } else {
      // For local development without service account
      firebaseAdminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'akhtarserve',
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'akhtarserve.firebasestorage.app',
      });
    }
  } else {
    // Client-side: should not happen, but provide fallback
    firebaseAdminApp = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'akhtarserve',
    });
  }

  return firebaseAdminApp;
}

// Lazy getters - only initialize when called
export function getAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}

export function getAdminStorage() {
  return getStorage(getFirebaseAdminApp());
}

// For backward compatibility
export const adminAuth = {
  verifyIdToken: async (token: string) => {
    const auth = getAdminAuth();
    return auth.verifyIdToken(token);
  },
  getUser: async (uid: string) => {
    const auth = getAdminAuth();
    return auth.getUser(uid);
  },
};

export const adminDb = {
  collection: (name: string) => {
    const db = getAdminDb();
    return db.collection(name);
  },
  doc: (path: string) => {
    const db = getAdminDb();
    return db.doc(path);
  },
};

export const adminStorage = {
  bucket: () => {
    const storage = getAdminStorage();
    return storage.bucket();
  },
};

// Helper to verify Firebase ID tokens (for API routes)
export async function verifyAuthToken(token: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying auth token:", error);
    return null;
  }
}

// Helper to get user by UID
export async function getUserByUid(uid: string) {
  try {
    const userRecord = await adminAuth.getUser(uid);
    return userRecord;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export default getFirebaseAdminApp;
