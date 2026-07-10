import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let firebaseAdminApp: App;

function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // In development, use service account or application default credentials
  // In production (Vercel), use environment variables
  const serviceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT)
    : undefined;

  if (serviceAccount) {
    firebaseAdminApp = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } else {
    // For local development, use application default credentials
    // or initialize without credentials for emulator usage
    firebaseAdminApp = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }

  return firebaseAdminApp;
}

// Initialize Firebase Admin services
export const adminApp = getFirebaseAdminApp();
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);

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

export default adminApp;
