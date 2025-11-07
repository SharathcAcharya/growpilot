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
      console.log('✅ Using Firebase service account key file');
      const serviceAccount = require(serviceAccountPath) as ServiceAccount;
      
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    } else if (process.env.FIREBASE_PROJECT_ID && 
               process.env.FIREBASE_CLIENT_EMAIL && 
               process.env.FIREBASE_PRIVATE_KEY) {
      // Initialize with environment variables
      console.log('✅ Using Firebase credentials from environment variables');
      
      const serviceAccount: ServiceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
      
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    } else {
      throw new Error(
        'Firebase Admin SDK not configured. Please provide either:\n' +
        '1. A serviceAccountKey.json file in the backend directory, OR\n' +
        '2. FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env'
      );
    }

    console.log('✅ Firebase Admin initialized successfully');
    console.log(`   Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
    return firebaseApp;
  } catch (error: any) {
    console.error('❌ Firebase initialization error:', error.message);
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
