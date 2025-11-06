# 🔥 Firebase Setup Guide for GrowPilot

## Overview
GrowPilot now uses **real Firebase Authentication** with Google Sign-In. Follow these steps to enable authentication in your app.

---

## 📋 Prerequisites
- A Google account
- 5-10 minutes of setup time

---

## 🚀 Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `growpilot` (or your choice)
4. Disable Google Analytics (optional for development)
5. Click **"Create project"**

### 2. Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **Google** provider:
   - Click on "Google"
   - Toggle **"Enable"**
   - Set support email (your Google email)
   - Click **"Save"**

5. Optional: Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle **"Enable"**
   - Click **"Save"**

### 3. Register Web App

1. In Firebase Console, go to **Project Overview** (home icon)
2. Click the **Web icon** (`</>`) to add a web app
3. Register app with nickname: `GrowPilot Web`
4. **Check** "Also set up Firebase Hosting" (optional)
5. Click **"Register app"**
6. Copy the **Firebase configuration object** (you'll need this!)

It looks like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### 4. Download Service Account Key (Backend)

1. Go to **Project Settings** (gear icon) > **Service accounts**
2. Click **"Generate new private key"**
3. Click **"Generate key"** (downloads JSON file)
4. **IMPORTANT**: Rename the file to `serviceAccountKey.json`
5. Move it to `backend/` folder (same level as `src/`)
6. **NEVER commit this file to Git!** (already in .gitignore)

---

## ⚙️ Configure Environment Variables

### Frontend Environment (.env.local)

Create `frontend/.env.local`:

```bash
# Firebase Frontend Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

**Replace all values with YOUR Firebase config from Step 3!**

### Backend Environment (.env)

Update `backend/.env`:

```bash
# Firebase Backend Configuration
FIREBASE_ADMIN_SDK_KEY_PATH=./serviceAccountKey.json

# ... keep your existing MongoDB, OpenAI, etc. config ...
```

---

## 🔒 Security Rules (Optional but Recommended)

### Firestore Rules (if using Firestore)

Go to **Firestore Database > Rules** and set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules (if using Storage)

Go to **Storage > Rules** and set:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## ✅ Verify Setup

### Test Frontend

1. Start frontend: `cd frontend && npm run dev`
2. Go to `http://localhost:3000/login`
3. You should see:
   - **"Sign in with Google"** button (with Google logo)
   - Email/Password form
   - **NO** "Firebase Not Configured" warning

### Test Backend

1. Start backend: `cd backend && npm run dev`
2. Check terminal output:
   - ✅ Should see: `"Firebase Admin initialized successfully"`
   - ✅ Should see: `"✅ Firebase initialized"`
   - ❌ Should NOT see any Firebase errors

---

## 🧪 Test Authentication Flow

1. **Sign Up with Google**:
   - Click "Sign in with Google"
   - Choose your Google account
   - Allow permissions
   - Should redirect to `/dashboard`

2. **Check User Profile**:
   - Open browser DevTools (F12)
   - Go to Application > Local Storage > `user-storage`
   - Should see your real Firebase user data

3. **Test API Calls**:
   - Open DevTools > Network tab
   - Create a campaign or content
   - Check API requests - should have `Authorization: Bearer <long-token>`
   - Should get 200 OK responses (not 401)

4. **Sign Out**:
   - Click your profile icon
   - Click "Sign Out"
   - Should redirect to `/login`
   - localStorage should be cleared

---

## 🐛 Troubleshooting

### "Firebase Not Configured" Warning

**Cause**: Missing or incorrect `.env.local` file

**Fix**: 
1. Check `frontend/.env.local` exists
2. All variables start with `NEXT_PUBLIC_`
3. Restart frontend: `npm run dev`

### "401 Unauthorized" API Errors

**Cause**: Backend can't verify Firebase token

**Fix**:
1. Check `backend/serviceAccountKey.json` exists
2. Check `backend/.env` has correct path
3. Restart backend: `npm run dev`

### Google Sign-In Pop-up Blocked

**Cause**: Browser blocking pop-ups

**Fix**:
1. Allow pop-ups for `localhost:3000`
2. Or use Email/Password instead

### "auth/popup-closed-by-user"

**Cause**: User closed Google sign-in window

**Fix**: Just try again - this is normal behavior

---

## 📚 Additional Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Google Sign-In Setup](https://firebase.google.com/docs/auth/web/google-signin)

---

## 🎉 You're All Set!

Once configured, your app will:
- ✅ Use real Google authentication
- ✅ Store users in MongoDB
- ✅ Send real Firebase tokens to backend
- ✅ Work with production Firebase
- ❌ NO more demo mode
- ❌ NO fake tokens

**Happy building! 🚀**
