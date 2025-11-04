# 🚀 GrowPilot - Setup & Installation Guide

## ✅ What Has Been Built

### Backend (Node.js + TypeScript + Express)
- ✅ Complete REST API with authentication
- ✅ MongoDB models (User, Campaign, Content, SEOAudit, Influencer)
- ✅ AI Services (OpenAI GPT-4o, DALL-E integration)
- ✅ SEO audit service with web scraping
- ✅ Influencer discovery and scoring
- ✅ Campaign management with analytics
- ✅ Firebase Authentication integration
- ✅ Comprehensive API routes and controllers

### Frontend (Next.js 15 + TypeScript + Tailwind)
- ✅ Authentication provider with Firebase
- ✅ State management with Zustand
- ✅ Dashboard layout with sidebar and navbar
- ✅ Dashboard overview page
- ✅ Campaign cards and components
- ✅ Landing page
- ✅ API client configuration

### Infrastructure
- ✅ Docker setup (backend, frontend, MongoDB)
- ✅ Environment configuration templates
- ✅ TypeScript configurations
- ✅ Database seed files

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (local or Atlas)
- Firebase project
- OpenAI API key

## 🛠️ Installation Steps

### 1. Install Backend Dependencies

```powershell
cd backend
npm install
```

### 2. Install Frontend Dependencies

```powershell
cd frontend
npm install
```

### 3. Configure Environment Variables

#### Backend (.env)
Copy `.env.example` to `.env` and configure:

```bash
# Backend
cd backend
cp ../.env.example .env
```

**Required Variables:**
- `MONGODB_URI` - Your MongoDB connection string
- `FIREBASE_ADMIN_SDK_KEY_PATH` - Path to Firebase service account JSON
- `OPENAI_API_KEY` - Your OpenAI API key
- `JWT_SECRET` - Generate a secure random string

#### Frontend (.env.local)
```bash
cd frontend
cp .env.local.example .env.local
```

**Required Variables:**
- `NEXT_PUBLIC_FIREBASE_*` - Your Firebase web app credentials
- `NEXT_PUBLIC_API_URL` - Backend API URL (http://localhost:5000/api/v1)

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password, Google)
4. Download service account key:
   - Project Settings > Service Accounts > Generate New Private Key
   - Save as `backend/serviceAccountKey.json`
5. Get web app credentials:
   - Project Settings > General > Your Apps > Web App
   - Copy config to frontend `.env.local`

### 5. OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add to backend `.env` file

### 6. MongoDB Setup

**Option A: Local MongoDB**
```powershell
# Install MongoDB and start service
# Then use: mongodb://localhost:27017/growpilot
```

**Option B: MongoDB Atlas**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Add to `.env`

## 🚀 Running the Application

### Development Mode (Recommended)

#### Terminal 1 - Backend
```powershell
cd backend
npm run dev
```
Backend runs on http://localhost:5000

#### Terminal 2 - Frontend
```powershell
cd frontend
npm run dev
```
Frontend runs on http://localhost:3000

### Using Docker

```powershell
# Start all services
docker-compose up --build

# Stop services
docker-compose down
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/v1
- MongoDB: localhost:27017

## 📝 Testing the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Test Endpoints (requires authentication)

1. **Get Current User**
```bash
curl http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

2. **Create Campaign**
```bash
curl -X POST http://localhost:5000/api/v1/campaigns/create \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Sale 2024",
    "objective": "sales",
    "platform": "facebook",
    "budget": {"total": 500, "currency": "USD"},
    "brandId": "brand_123"
  }'
```

## 🔧 Troubleshooting

### Common Issues

**1. Module not found errors**
```powershell
# Clean install
cd backend
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install

cd ../frontend
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

**2. Firebase initialization error**
- Verify service account JSON is in correct location
- Check environment variables
- Ensure Firebase project is active

**3. MongoDB connection error**
- Verify MongoDB is running
- Check connection string format
- Ensure network access (if using Atlas)

**4. OpenAI API errors**
- Verify API key is valid
- Check account has credits
- Review rate limits

## 📂 Project Structure Reference

```
growpilot/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Server entry point
│   │   ├── config/               # DB & Firebase config
│   │   ├── models/               # MongoDB schemas
│   │   ├── controllers/          # Route handlers
│   │   ├── services/             # Business logic & AI
│   │   ├── routes/               # API routes
│   │   └── middlewares/          # Auth middleware
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/                  # Next.js pages
│   │   ├── components/           # React components
│   │   ├── lib/                  # Utils & API client
│   │   └── store/                # Zustand stores
│   ├── package.json
│   └── Dockerfile
├── database/
│   └── seed.js
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🎯 Next Steps

### Immediate Tasks
1. ✅ Set up environment variables
2. ✅ Start development servers
3. ⏳ Test user registration/login
4. ⏳ Create first campaign
5. ⏳ Test AI content generation

### Features to Implement
- [ ] Campaign creation wizard
- [ ] Content generation UI
- [ ] SEO audit dashboard
- [ ] Influencer search interface
- [ ] AI Copilot chat
- [ ] Analytics visualizations
- [ ] Stripe payment integration
- [ ] Real ad platform integrations (Meta, Google)

### Production Deployment
1. Set up CI/CD (GitHub Actions)
2. Configure production environment variables
3. Deploy to:
   - Frontend: Vercel
   - Backend: Render/AWS
   - Database: MongoDB Atlas
4. Set up domain and SSL
5. Configure monitoring and logging

## 📚 API Documentation

### Authentication
All protected endpoints require Firebase ID token:
```
Authorization: Bearer <firebase-id-token>
```

### Key Endpoints

**Campaigns**
- `POST /api/v1/campaigns/create` - Create campaign
- `GET /api/v1/campaigns` - List campaigns
- `POST /api/v1/campaigns/:id/generate-creative` - Generate AI creative
- `POST /api/v1/campaigns/:id/optimize` - Get optimization suggestions

**Content**
- `POST /api/v1/content/generate` - Generate AI content
- `GET /api/v1/content` - List content

**SEO**
- `POST /api/v1/seo/audit` - Audit website
- `GET /api/v1/seo/audits` - List audits

**Influencers**
- `POST /api/v1/influencers/search` - Search influencers
- `POST /api/v1/influencers/:id/score` - Score influencer

**Analytics**
- `GET /api/v1/analytics/dashboard` - Dashboard overview

## 💡 Tips

1. **Development**: Use `npm run dev` for hot-reloading
2. **Debugging**: Check browser console and server terminal
3. **Database**: Use MongoDB Compass for visual database management
4. **API Testing**: Use Postman or Thunder Client
5. **Logs**: Check `backend/logs` for error logs

## 🆘 Support

- **Documentation**: See README.md
- **Issues**: Create GitHub issue
- **Discussions**: Use GitHub Discussions

## 📄 License

MIT License - see LICENSE file

---

**Built with ❤️ by the GrowPilot Team**

Happy building! 🚀
