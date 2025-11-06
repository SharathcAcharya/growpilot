# 🔥 Firebase Admin SDK Setup Guide

## ✅ Frontend Configuration - COMPLETE
Your frontend Firebase configuration is already set up with these credentials:

```javascript
{
  apiKey: "AIzaSyA39eLZW5Vco1aSveQBPoV08XK1p3J6lEw",
  authDomain: "growpilot-1c7c2.firebaseapp.com",
  projectId: "growpilot-1c7c2",
  storageBucket: "growpilot-1c7c2.firebasestorage.app",
  messagingSenderId: "334067622219",
  appId: "1:334067622219:web:ed95c1ac93b738131288ce",
  measurementId: "G-C7T94XCKN3"
}
```

## 🔧 Backend Configuration - NEEDS SERVICE ACCOUNT KEY

To complete the backend Firebase setup, you need to get the **Firebase Admin SDK service account key**.

### Step-by-Step Instructions:

#### 1. Go to Firebase Console
Open: https://console.firebase.google.com/project/growpilot-1c7c2/settings/serviceaccounts/adminsdk

Or manually navigate:
- Go to https://console.firebase.google.com/
- Select project: **growpilot-1c7c2**
- Click the gear icon ⚙️ (Project Settings)
- Go to **Service accounts** tab

#### 2. Generate Private Key
1. Click **"Generate new private key"** button
2. Confirm by clicking **"Generate key"**
3. A JSON file will download: `growpilot-1c7c2-firebase-adminsdk-xxxxx.json`

#### 3. Extract Credentials from JSON
Open the downloaded JSON file. It will look like this:

```json
{
  "type": "service_account",
  "project_id": "growpilot-1c7c2",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@growpilot-1c7c2.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

#### 4. Update `backend/.env`

Copy these THREE values from the JSON file:

**a) PROJECT_ID** (already set, but verify it matches):
```env
FIREBASE_PROJECT_ID=growpilot-1c7c2
```

**b) CLIENT_EMAIL** (copy from `client_email` field):
```env
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@growpilot-1c7c2.iam.gserviceaccount.com
```

**c) PRIVATE_KEY** (copy from `private_key` field - KEEP THE QUOTES AND \n):
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**IMPORTANT:** 
- Keep the private key in quotes `"..."`
- Keep the `\n` characters (they represent newlines)
- Copy the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

#### 5. Final `backend/.env` Should Look Like:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://tempgpt369_db_user:75LDALqshEkXnr@cluster1.iyfpu26.mongodb.net/growpilot

# Frontend
FRONTEND_URL=http://localhost:3000

# API Version
API_VERSION=v1

# OpenAI API (Required for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Firebase Admin SDK (Required - for authentication)
FIREBASE_PROJECT_ID=growpilot-1c7c2
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@growpilot-1c7c2.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Meta/Facebook Ads (Optional)
META_APP_ID=
META_APP_SECRET=
META_ACCESS_TOKEN=

# Google Ads (Optional)
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
GOOGLE_ADS_DEVELOPER_TOKEN=
```

---

## 🧪 Testing Firebase Setup

### 1. Restart Backend Server
```bash
cd backend
npm run dev
```

Look for this line in the console:
```
✅ Firebase Admin SDK initialized successfully
```

### 2. Test Frontend Authentication
```bash
cd frontend
npm run dev
```

Open http://localhost:3000 and try to:
1. Click "Sign In" or "Get Started"
2. Create a new account with email/password
3. Check if authentication works

### 3. Verify in Firebase Console
Go to: https://console.firebase.google.com/project/growpilot-1c7c2/authentication/users

You should see your newly created user appear in the Authentication users list.

---

## 🔐 Security Notes

⚠️ **NEVER commit the service account key to Git!**

The `.gitignore` file already excludes:
- `backend/.env` ✅
- `backend/serviceAccountKey.json` ✅
- `frontend/.env.local` ✅

If you accidentally committed the key:
1. Immediately go to Firebase Console
2. Delete the compromised service account key
3. Generate a new one
4. Update your `.env` file

---

## ✅ Setup Checklist

- [x] Frontend Firebase config added to `.env.local`
- [ ] Backend service account key generated from Firebase Console
- [ ] `FIREBASE_CLIENT_EMAIL` added to `backend/.env`
- [ ] `FIREBASE_PRIVATE_KEY` added to `backend/.env`
- [ ] Backend server restarted
- [ ] Firebase authentication tested
- [ ] User creation verified in Firebase Console

---

## 🆘 Troubleshooting

### Error: "Firebase app not initialized"
- Make sure all Firebase environment variables are set
- Restart the backend server

### Error: "Invalid service account"
- Check that `FIREBASE_PRIVATE_KEY` includes the quotes
- Verify the `\n` characters are preserved
- Make sure you copied the entire key

### Error: "Permission denied"
- Verify the service account has "Firebase Admin" role
- Check that the project ID matches: `growpilot-1c7c2`

### Users not appearing in MongoDB
- This is normal! Users are stored in **Firebase Authentication**
- When they use the app, a user document will be created in MongoDB
- MongoDB stores subscription data, Firebase stores auth data

---

## 📞 Need Help?

- **Firebase Console:** https://console.firebase.google.com/project/growpilot-1c7c2
- **Firebase Auth Docs:** https://firebase.google.com/docs/auth
- **Firebase Admin SDK:** https://firebase.google.com/docs/admin/setup
- **Project Docs:** See `DATABASE_SETUP.md` for complete database setup

---

## 🎉 Next Steps

Once Firebase is set up:

1. ✅ Users can sign up and log in
2. ✅ JWT tokens are verified by backend
3. ✅ Protected routes work
4. ✅ MongoDB stores user profile data
5. ✅ Firebase stores authentication state

**You're almost ready to use GrowPilot!** 🚀
