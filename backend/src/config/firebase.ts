import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import path from 'path';
import fs from 'fs';

let firebaseApp: admin.app.App;

export const initializeFirebase = (): admin.app.App => {
  try {
    if (firebaseApp) {
      return firebaseApp;
    }

    // Check if service account key file exists
    const serviceAccountPath = process.env.FIREBASE_ADMIN_SDK_KEY_PATH || 
      path.join(__dirname, '../../serviceAccountKey.json');

    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath) as ServiceAccount;
      
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    } else {
      // Initialize with environment variables (for production)
      firebaseApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }

    console.log('Firebase Admin initialized successfully');
    return firebaseApp;
  } catch (error: any) {
    console.error('Firebase initialization error:', error.message);
    throw error;
  }
};

export const getFirebaseApp = (): admin.app.App => {
  if (!firebaseApp) {
    return initializeFirebase();
  }
  return firebaseApp;
};

export const getAuth = (): admin.auth.Auth => {
  return getFirebaseApp().auth();
};

export const getFirestore = (): admin.firestore.Firestore => {
  return getFirebaseApp().firestore();
};

export const getStorage = (): admin.storage.Storage => {
  return getFirebaseApp().storage();
};

export default {
  initializeFirebase,
  getFirebaseApp,
  getAuth,
  getFirestore,
  getStorage,
};
