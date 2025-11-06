# 🚨 DEMO MODE REMOVED - SETUP REQUIRED

## What Changed?

Your GrowPilot app has been **completely refactored** to remove all demo/dummy data and fake authentication. 

### ❌ Removed:
- Demo Mode login button
- `demo-user-123` fake user
- `demo-mode-token` backend bypass
- All dummy/fallback data in pages
- Fake API responses

### ✅ Now Using:
- **Real Firebase Authentication** (Google Sign-In + Email/Password)
- **Real Firebase ID Tokens** sent to backend
- **Real MongoDB data** (no fake data)
- **Real user profiles** created on first login
- **Complete CRUD operations** for campaigns, content, SEO, etc.

---

## 🔧 Setup Required

### 1. Configure Firebase (REQUIRED)

Follow the complete guide: **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

Quick steps:
1. Create Firebase project
2. Enable Google authentication
3. Download service account key → `backend/serviceAccountKey.json`
4. Copy Firebase config → `frontend/.env.local`

**Without Firebase setup, the app will NOT work!**

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Frontend** (`frontend/.env.local`):
```bash
cp .env.local.example .env.local
# Edit .env.local with YOUR Firebase credentials
```

**Backend** (`backend/.env`):
```bash
# Already exists - just verify:
FIREBASE_ADMIN_SDK_KEY_PATH=./serviceAccountKey.json
MONGODB_URI=<your_mongodb_uri>
```

### 3. Add Service Account Key

1. Download from Firebase Console (see FIREBASE_SETUP.md)
2. Save as `backend/serviceAccountKey.json`
3. Verify it's in `.gitignore` (already added)

### 4. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Should see:
```
✅ MongoDB connected
✅ Firebase initialized
🚀 GrowPilot API running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Open App

Go to: http://localhost:3000

---

## 🔐 How Authentication Works Now

### Sign Up Flow:

1. User clicks **"Sign in with Google"** on `/login`
2. Google OAuth popup appears
3. User grants permissions
4. Firebase returns ID token
5. Frontend stores Firebase user in Zustand + localStorage
6. **AuthProvider** fetches user profile from backend
7. Backend creates user in MongoDB (if doesn't exist)
8. User redirected to `/dashboard`

### API Request Flow:

1. User action (e.g., create campaign)
2. Frontend gets Firebase ID token
3. Token added to `Authorization: Bearer <token>`
4. Backend verifies token with Firebase Admin SDK
5. Backend processes request with verified user UID
6. Response returned

### Sign Out Flow:

1. User clicks "Sign Out"
2. Firebase `signOut()` called
3. Zustand store cleared
4. localStorage cleared
5. Redirected to `/login`

---

## 📁 Key Files Changed

### Backend

- `src/middlewares/auth.ts` - Removed demo token bypass
- `src/controllers/user.controller.ts` - Creates real users in MongoDB
- All controllers now use real `req.user.uid` from Firebase

### Frontend

- `src/app/login/page.tsx` - Google Sign-In + Email/Password forms
- `src/lib/api.ts` - Sends real Firebase tokens only
- `src/components/AuthProvider.tsx` - Firebase auth state listener
- `src/lib/firebase.ts` - Firebase client configuration
- All pages (campaigns, content, etc.) - Removed demo data fallbacks

---

## 🧪 Testing

### Test Authentication:

1. Start both backend and frontend
2. Go to http://localhost:3000/login
3. Click "Sign in with Google"
4. Choose Google account
5. Should redirect to `/dashboard`
6. Check DevTools > Application > Local Storage > `user-storage`
7. Should see real Firebase user with your email

### Test API Calls:

1. Create a campaign
2. Open DevTools > Network tab
3. Find `POST /api/v1/campaigns/create`
4. Check Headers > `Authorization: Bearer ey...` (long token)
5. Should get `201 Created` response
6. Campaign saved to MongoDB!

### Test Sign Out:

1. Click profile icon > Sign Out
2. Should redirect to `/login`
3. localStorage cleared
4. Trying to access `/dashboard` redirects to `/login`

---

## ⚠️ Important Notes

### Security:

- **NEVER** commit `serviceAccountKey.json` (in `.gitignore`)
- **NEVER** commit `.env.local` with real credentials (in `.gitignore`)
- Use environment variables for all secrets
- Firebase tokens expire after 1 hour (auto-refreshed)

### Production:

Before deploying:
1. Set up Firebase production project
2. Update environment variables
3. Enable Firebase App Check
4. Add your domain to Firebase authorized domains
5. Use production MongoDB cluster

### Data:

- All data now stored in **MongoDB**
- No dummy/demo data anywhere
- Empty states show if no data exists
- Create campaigns/content through UI to populate

---

## 🐛 Troubleshooting

### "Firebase Not Configured" Warning

**Problem**: Missing Firebase credentials

**Solution**: 
1. Check `frontend/.env.local` exists
2. All variables have real values (not `your_firebase_api_key`)
3. Restart frontend: `npm run dev`

### 401 Unauthorized Errors

**Problem**: Backend can't verify token

**Solution**:
1. Check `backend/serviceAccountKey.json` exists
2. Check Firebase project ID matches
3. Restart backend: `npm run dev`

### Can't Sign In

**Problem**: Google authentication not enabled

**Solution**:
1. Go to Firebase Console > Authentication
2. Enable Google provider
3. Try again

### Empty Dashboard

**Problem**: No data in MongoDB

**Solution**: This is normal! Create your first campaign:
1. Click "Create Campaign"
2. Fill form
3. Submit
4. Refresh dashboard

---

## 📚 Documentation

- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Complete Firebase setup guide
- **[README.md](./README.md)** - Original project documentation
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)

---

## 🎯 Summary

**Before**: Demo mode with fake users and dummy data
**Now**: Production-ready auth with real Firebase + MongoDB

**You must**:
1. ✅ Set up Firebase project
2. ✅ Add credentials to `.env.local`
3. ✅ Add service account key to backend
4. ✅ Start both servers
5. ✅ Sign in with Google

**Then you can**:
- Create real campaigns
- Generate AI content
- Run SEO audits
- Manage influencer outreach
- Track real analytics
- Everything stored in MongoDB!

---

## 🤝 Need Help?

If you encounter issues:
1. Check this guide first
2. Read FIREBASE_SETUP.md
3. Check console errors (F12)
4. Verify backend/frontend both running
5. Check Firebase Console > Authentication > Users

---

**Happy building! 🚀**
