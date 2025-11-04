# 🚀 GrowPilot - AI Digital Marketing Auto-Pilot

**Tagline:** "Let AI run your marketing while you run your business."

GrowPilot is an AI-powered SaaS platform that acts as a virtual marketing team — automating content creation, ads, SEO, and influencer campaigns for startups and small businesses.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue)

## 🎯 Vision

To democratize digital marketing automation — enabling every business, regardless of size, to grow online using AI-driven creative generation, ad optimization, SEO insights, and influencer selection without needing an agency.

## ✨ Core Features

### 🤖 Campaign Automation
- Auto-generate ad creatives (image, video, caption, CTA) using OpenAI + DALL·E
- Smart audience targeting based on niche, budget, and platform
- One-click campaign deployment via Meta Ads & Google Ads APIs

### 📝 Content & SEO Engine
- AI blog writer + social caption generator
- Smart keyword finder with SEO optimizer
- Automated website audits with actionable recommendations

### 🌟 Influencer Intelligence
- AI-powered influencer discovery and ranking
- Engagement analysis and ROI prediction
- One-click outreach template generation

### 📊 Analytics Dashboard
- Unified analytics across all platforms
- Auto-generated optimization suggestions
- Predictive ROI forecasting using ML

### 💬 Growth Copilot Chat
- Conversational AI assistant to guide marketing decisions
- Natural language campaign creation
- Real-time marketing insights

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS, Zustand |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB, Firebase Firestore |
| **AI & ML** | OpenAI API (GPT-4o, DALL-E 3), Hugging Face |
| **Auth** | Firebase Authentication |
| **Storage** | Firebase Storage / AWS S3 |
| **Payments** | Stripe |
| **Deployment** | Docker, Vercel, AWS/Render |

## 📁 Project Structure

```
growpilot/
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities & configs
│   │   └── store/        # Zustand state management
│   └── public/           # Static assets
├── backend/              # Node.js API server
│   ├── src/
│   │   ├── config/       # Database & Firebase config
│   │   ├── models/       # MongoDB schemas
│   │   ├── controllers/  # Route controllers
│   │   ├── services/     # Business logic & AI services
│   │   ├── routes/       # API routes
│   │   ├── middlewares/  # Auth & validation
│   │   └── index.ts      # Server entry point
│   └── Dockerfile
├── database/             # Database seeds & migrations
├── scripts/              # Deployment & utility scripts
└── docker-compose.yml    # Docker orchestration
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- MongoDB instance (local or Atlas)
- Firebase project (for auth & storage)
- OpenAI API key
- (Optional) Meta Ads & Google Ads developer accounts

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/growpilot.git
cd growpilot
```

### 2. Environment Setup

#### Backend Configuration

```bash
cd backend
cp ../.env.example .env
```

Edit `.env` with your credentials:
- MongoDB URI
- Firebase credentials
- OpenAI API key
- Stripe keys
- Ad platform API keys (optional for MVP)

#### Frontend Configuration

```bash
cd frontend
cp .env.local.example .env.local
```

Add Firebase web config and backend API URL.

### 3. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 4. Run Development Servers

#### Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Server runs on http://localhost:5000

#### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
App runs on http://localhost:3000

### 5. Using Docker (Alternative)

```bash
docker-compose up --build
```

This starts:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000
- MongoDB on localhost:27017

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
All protected routes require Firebase ID token in header:
```
Authorization: Bearer <firebase-id-token>
```

### Key Endpoints

#### Campaigns
- `POST /campaigns/create` - Create new campaign
- `GET /campaigns` - List all campaigns
- `POST /campaigns/:id/generate-creative` - Generate AI creative
- `POST /campaigns/:id/deploy` - Deploy to ad platform

#### Content
- `POST /content/generate` - Generate AI content
- `GET /content` - List content
- `POST /content/:id/publish` - Publish content

#### SEO
- `POST /seo/audit` - Audit website
- `GET /seo/audits` - List audits
- `POST /seo/keywords` - Find keywords

#### Influencers
- `POST /influencers/search` - Search influencers
- `POST /influencers/:id/score` - Score influencer fit
- `POST /influencers/:id/outreach` - Generate outreach email

#### Analytics
- `GET /analytics/dashboard` - Dashboard overview
- `GET /analytics/performance` - Performance metrics

## 💰 Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0/mo | 1 brand, 3 campaigns/month |
| **Pro** | $39/mo | Unlimited campaigns, SEO tools |
| **Business** | $99/mo | AI influencer suite, priority API |

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend (Render/AWS)
```bash
cd backend
npm run build
# Deploy dist/ folder
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Security

- JWT-based API authentication
- Firebase-managed user tokens
- GDPR-compliant data storage
- Stripe webhook validation
- Rate limiting on all endpoints

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Website:** https://growpilot.ai
- **Email:** support@growpilot.ai
- **Discord:** [Join our community](https://discord.gg/growpilot)

## 🗺️ Roadmap

- [x] MVP backend with AI services
- [x] Campaign management
- [x] Content generation
- [x] SEO audit tool
- [ ] Frontend dashboard UI
- [ ] Real ad platform integration (Meta, Google)
- [ ] Influencer marketplace
- [ ] Mobile app (React Native)
- [ ] White-label solution for agencies

## 🙏 Acknowledgments

- OpenAI for GPT-4o and DALL-E APIs
- Firebase for authentication and storage
- The open-source community

---

**Built with ❤️ by the GrowPilot Team**

*Empowering businesses to grow with AI-driven marketing automation.*
