# 🚀 GrowPilot Quick Start Guide

Get your AI marketing automation platform running in under 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB running (local or Docker)
- OpenAI API key (for AI features)

## Quick Start (Development Mode)

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

**Backend** - Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/growpilot
NODE_ENV=development

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here

# Firebase Admin (optional for now)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Frontend URL
FRONTEND_URL=http://localhost:3000
API_VERSION=v1
```

**Frontend** - Already created at `frontend/.env.local`:
```env
# Firebase (Demo mode - replace with real values later)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# API
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Start Services

**Terminal 1 - MongoDB** (if not already running):
```bash
mongod
```

**Terminal 2 - Backend**:
```bash
cd backend
npm run dev
```
✅ Backend running at http://localhost:5000

**Terminal 3 - Frontend**:
```bash
cd frontend
npm run dev
```
✅ Frontend running at http://localhost:3000

### 4. Access the Application

Open your browser to **http://localhost:3000**

## Quick Start (Docker Mode)

```bash
# Build and start all services (MongoDB, Backend, Frontend)
docker-compose up --build

# Access:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
# - MongoDB: mongodb://localhost:27017
```

## 🎯 What You Can Do Now

### Without Firebase Setup (Demo Mode):
✅ View landing page  
✅ Explore dashboard UI  
✅ Test content generation (with OpenAI key)  
✅ Run SEO audits  
✅ Search influencers  
✅ View analytics  
✅ Chat with AI copilot  

⚠️ Authentication disabled - direct access to all features

### With Firebase Setup:
✅ Full user authentication  
✅ Protected routes  
✅ User profiles and settings  
✅ Subscription management  

## 📝 Next Steps

1. **Add OpenAI API Key** to `backend/.env` for AI features to work
2. **Set up Firebase** (optional) - See [SETUP.md](./SETUP.md) for detailed instructions
3. **Explore the API** - Visit http://localhost:5000/health to verify backend
4. **Read the docs** - Check [README.md](./README.md) and [COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md)

## 🔧 Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### Backend won't start
```bash
cd backend
rm -rf dist node_modules
npm install
npm run dev
```

### MongoDB connection failed
- Ensure MongoDB is running on port 27017
- Or update `MONGODB_URI` in backend/.env

### Firebase errors
- App runs in demo mode without Firebase
- Add real Firebase credentials to enable auth
- See warning in console: "Firebase not configured - running in demo mode"

## 📚 Documentation

- **[README.md](./README.md)** - Full project overview
- **[SETUP.md](./SETUP.md)** - Detailed installation guide
- **[COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md)** - All features and API docs

## 🎉 You're Ready!

Your GrowPilot platform is now running. Start exploring the features or begin customizing for your needs!
