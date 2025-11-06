# 🗄️ GrowPilot Database Setup Guide

Complete guide for setting up MongoDB and Firebase databases for the GrowPilot platform.

---

## 📊 MongoDB Database Structure

**Database Name:** `growpilot`

MongoDB is the **primary database** for all application data. It stores users, campaigns, content, influencers, and SEO audits.

### Collections Overview

| Collection | Purpose | Estimated Size | Indexes |
|------------|---------|---------------|---------|
| `users` | User accounts and subscriptions | ~10KB per user | uid, email, subscription.tier |
| `campaigns` | Marketing campaigns | ~50KB per campaign | userId, status, platform |
| `contents` | Generated content pieces | ~20KB per content | userId, type, status |
| `influencers` | Influencer profiles | ~30KB per influencer | userId, platform, username |
| `seoaudits` | SEO audit results | ~100KB per audit | userId, url, auditedAt |

---

## 1️⃣ MongoDB Collection: `users`

### Purpose
Store user accounts, subscription details, brand information, and usage statistics.

### Schema Structure

```javascript
{
  "_id": ObjectId,
  "uid": String,                    // Firebase UID (indexed, unique)
  "email": String,                  // User email (indexed, unique)
  "displayName": String,            // Full name
  "photoURL": String,               // Profile picture URL
  "role": String,                   // "owner" | "marketer" | "analyst" | "admin"
  
  "subscription": {
    "tier": String,                 // "free" | "pro" | "business"
    "status": String,               // "active" | "cancelled" | "expired" | "trial"
    "stripeCustomerId": String,     // Stripe customer ID
    "stripeSubscriptionId": String, // Stripe subscription ID
    "currentPeriodEnd": Date,       // Subscription end date
    "trialEndsAt": Date            // Trial expiration (14 days default)
  },
  
  "brands": [                       // Array of brands user manages
    {
      "name": String,               // Brand name
      "industry": String,           // Industry category
      "website": String,            // Brand website
      "logo": String,               // Logo URL
      "isActive": Boolean           // Active status
    }
  ],
  
  "usage": {
    "campaignsCreated": Number,     // Total campaigns created
    "campaignsThisMonth": Number,   // Campaigns this month
    "contentGenerated": Number,     // AI content pieces generated
    "seoAudits": Number            // SEO audits performed
  },
  
  "settings": {
    "notifications": Boolean,       // Push notifications enabled
    "emailUpdates": Boolean,        // Email notifications enabled
    "language": String             // Language preference (default: "en")
  },
  
  "lastLogin": Date,               // Last login timestamp
  "createdAt": Date,               // Account creation date
  "updatedAt": Date                // Last update timestamp
}
```

### Indexes
```javascript
db.users.createIndex({ "uid": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "subscription.tier": 1 })
db.users.createIndex({ "createdAt": -1 })
```

### Sample Document
```json
{
  "_id": ObjectId("673abc123def456789012345"),
  "uid": "firebase_abc123xyz789",
  "email": "john@example.com",
  "displayName": "John Doe",
  "photoURL": "https://storage.googleapis.com/avatar.jpg",
  "role": "owner",
  "subscription": {
    "tier": "pro",
    "status": "active",
    "stripeCustomerId": "cus_ABC123",
    "stripeSubscriptionId": "sub_XYZ789",
    "currentPeriodEnd": ISODate("2025-12-05T00:00:00Z"),
    "trialEndsAt": ISODate("2025-11-19T00:00:00Z")
  },
  "brands": [
    {
      "name": "TechStartup Inc",
      "industry": "Technology",
      "website": "https://techstartup.com",
      "logo": "https://storage.googleapis.com/logo.png",
      "isActive": true
    }
  ],
  "usage": {
    "campaignsCreated": 15,
    "campaignsThisMonth": 3,
    "contentGenerated": 87,
    "seoAudits": 12
  },
  "settings": {
    "notifications": true,
    "emailUpdates": true,
    "language": "en"
  },
  "lastLogin": ISODate("2025-11-05T10:30:00Z"),
  "createdAt": ISODate("2025-01-15T08:00:00Z"),
  "updatedAt": ISODate("2025-11-05T10:30:00Z")
}
```

---

## 2️⃣ MongoDB Collection: `campaigns`

### Purpose
Store marketing campaign data including budget, targeting, creatives, performance metrics, and AI insights.

### Schema Structure

```javascript
{
  "_id": ObjectId,
  "userId": ObjectId,              // Reference to users collection (indexed)
  "brandId": String,               // Brand identifier
  "name": String,                  // Campaign name
  "objective": String,             // "awareness" | "traffic" | "engagement" | "leads" | "sales"
  "status": String,                // "draft" | "scheduled" | "active" | "paused" | "completed" | "archived"
  "platform": String,              // "facebook" | "instagram" | "linkedin" | "google" | "youtube" | "multi"
  
  "budget": {
    "total": Number,               // Total budget amount
    "daily": Number,               // Daily budget cap
    "currency": String,            // Currency code (USD, EUR, etc.)
    "spent": Number                // Amount spent so far
  },
  
  "targeting": {
    "age": {
      "min": Number,               // Minimum age
      "max": Number                // Maximum age
    },
    "gender": String,              // "all" | "male" | "female"
    "locations": [String],         // Target locations
    "interests": [String],         // Interest categories
    "keywords": [String],          // Target keywords
    "audienceSize": Number         // Estimated audience size
  },
  
  "creatives": [                   // Campaign creative assets
    {
      "id": String,                // Unique creative ID
      "type": String,              // "image" | "video" | "carousel"
      "url": String,               // Asset URL
      "thumbnail": String,         // Thumbnail URL (for videos)
      "headline": String,          // Ad headline
      "description": String,       // Ad description
      "cta": String,              // Call-to-action text
      "aiGenerated": Boolean,      // Generated by AI
      "prompt": String            // AI generation prompt
    }
  ],
  
  "schedule": {
    "startDate": Date,             // Campaign start date
    "endDate": Date,               // Campaign end date (optional)
    "timezone": String             // Timezone (IANA format)
  },
  
  "performance": {
    "impressions": Number,         // Total impressions
    "clicks": Number,              // Total clicks
    "conversions": Number,         // Total conversions
    "ctr": Number,                 // Click-through rate (%)
    "cpc": Number,                 // Cost per click
    "cpm": Number,                 // Cost per mille (1000 impressions)
    "roas": Number,                // Return on ad spend
    "lastUpdated": Date           // Last metrics update
  },
  
  "aiInsights": {
    "suggestions": [String],       // AI optimization suggestions
    "optimizationScore": Number,   // Score 0-100
    "predictedROI": Number,        // Predicted ROI percentage
    "lastAnalyzed": Date          // Last AI analysis timestamp
  },
  
  "platformCampaignId": String,    // External platform campaign ID
  
  "history": [                     // Audit log
    {
      "action": String,            // Action performed
      "timestamp": Date,           // When action occurred
      "performedBy": String,       // User who performed action
      "details": Mixed            // Additional details
    }
  ],
  
  "createdAt": Date,
  "updatedAt": Date
}
```

### Indexes
```javascript
db.campaigns.createIndex({ "userId": 1 })
db.campaigns.createIndex({ "status": 1 })
db.campaigns.createIndex({ "platform": 1 })
db.campaigns.createIndex({ "schedule.startDate": -1 })
db.campaigns.createIndex({ "performance.lastUpdated": -1 })
```

### Sample Document
```json
{
  "_id": ObjectId("673def456abc789012345678"),
  "userId": ObjectId("673abc123def456789012345"),
  "brandId": "brand_tech_001",
  "name": "Summer Sale 2025",
  "objective": "sales",
  "status": "active",
  "platform": "facebook",
  "budget": {
    "total": 5000,
    "daily": 250,
    "currency": "USD",
    "spent": 1250.50
  },
  "targeting": {
    "age": { "min": 25, "max": 45 },
    "gender": "all",
    "locations": ["United States", "Canada"],
    "interests": ["Technology", "Gadgets", "Shopping"],
    "keywords": ["tech deals", "summer sale", "electronics"],
    "audienceSize": 2500000
  },
  "creatives": [
    {
      "id": "creative_001",
      "type": "image",
      "url": "https://storage.googleapis.com/campaign_image.jpg",
      "headline": "Save 40% on Tech This Summer!",
      "description": "Limited time offer on all electronics",
      "cta": "Shop Now",
      "aiGenerated": true,
      "prompt": "Create a summer tech sale ad with vibrant colors"
    }
  ],
  "schedule": {
    "startDate": ISODate("2025-06-01T00:00:00Z"),
    "endDate": ISODate("2025-08-31T23:59:59Z"),
    "timezone": "America/New_York"
  },
  "performance": {
    "impressions": 145678,
    "clicks": 8942,
    "conversions": 342,
    "ctr": 6.14,
    "cpc": 1.39,
    "cpm": 8.58,
    "roas": 3.8,
    "lastUpdated": ISODate("2025-11-05T12:00:00Z")
  },
  "aiInsights": {
    "suggestions": [
      "Increase daily budget by 15% during weekends",
      "Test video creative for higher engagement",
      "Narrow audience to ages 30-40 for better ROI"
    ],
    "optimizationScore": 82,
    "predictedROI": 4.2,
    "lastAnalyzed": ISODate("2025-11-05T06:00:00Z")
  },
  "platformCampaignId": "fb_camp_abc123xyz",
  "history": [
    {
      "action": "campaign_created",
      "timestamp": ISODate("2025-06-01T00:00:00Z"),
      "performedBy": "john@example.com",
      "details": { "initialBudget": 5000 }
    }
  ],
  "createdAt": ISODate("2025-05-28T10:00:00Z"),
  "updatedAt": ISODate("2025-11-05T12:00:00Z")
}
```

---

## 3️⃣ MongoDB Collection: `contents`

### Purpose
Store AI-generated and user-created content including blogs, social posts, ad copy, and emails.

### Schema Structure

```javascript
{
  "_id": ObjectId,
  "userId": ObjectId,              // Reference to users collection (indexed)
  "brandId": String,               // Brand identifier
  "type": String,                  // "blog" | "social_post" | "ad_copy" | "email" | "landing_page"
  "platform": String,              // "facebook" | "instagram" | "linkedin" | "twitter" | "youtube" | "website"
  "title": String,                 // Content title
  "content": String,               // Main content text
  
  "metadata": {
    "wordCount": Number,           // Total word count
    "readingTime": Number,         // Estimated reading time (minutes)
    "tone": String,                // Content tone
    "keywords": [String]           // Target keywords
  },
  
  "seoData": {
    "metaTitle": String,           // SEO meta title
    "metaDescription": String,     // SEO meta description
    "focusKeyword": String,        // Primary SEO keyword
    "score": Number                // SEO score 0-100
  },
  
  "aiGenerated": {
    "isAI": Boolean,               // Was generated by AI
    "prompt": String,              // AI generation prompt
    "model": String,               // AI model used (e.g., "gpt-4o")
    "tokensUsed": Number           // Tokens consumed
  },
  
  "status": String,                // "draft" | "published" | "scheduled" | "archived"
  "scheduledAt": Date,             // Scheduled publish date (optional)
  "publishedAt": Date,             // Actual publish date (optional)
  "campaignId": ObjectId,          // Related campaign (optional)
  
  "performance": {
    "views": Number,               // Total views
    "clicks": Number,              // Total clicks
    "shares": Number,              // Social shares
    "engagement": Number           // Engagement score
  },
  
  "versions": [                    // Content version history
    {
      "content": String,           // Version content
      "timestamp": Date,           // Version timestamp
      "editedBy": String          // User who edited
    }
  ],
  
  "createdAt": Date,
  "updatedAt": Date
}
```

### Indexes
```javascript
db.contents.createIndex({ "userId": 1 })
db.contents.createIndex({ "type": 1 })
db.contents.createIndex({ "status": 1 })
db.contents.createIndex({ "publishedAt": -1 })
```

### Sample Document
```json
{
  "_id": ObjectId("673ghi789def012345678901"),
  "userId": ObjectId("673abc123def456789012345"),
  "brandId": "brand_tech_001",
  "type": "blog",
  "platform": "website",
  "title": "10 AI Tools That Will Transform Your Marketing in 2025",
  "content": "In the rapidly evolving landscape of digital marketing...",
  "metadata": {
    "wordCount": 1250,
    "readingTime": 6,
    "tone": "professional",
    "keywords": ["AI marketing", "marketing automation", "digital tools"]
  },
  "seoData": {
    "metaTitle": "10 AI Marketing Tools for 2025 | TechStartup",
    "metaDescription": "Discover the top AI-powered marketing tools...",
    "focusKeyword": "AI marketing tools",
    "score": 87
  },
  "aiGenerated": {
    "isAI": true,
    "prompt": "Write a professional blog post about AI marketing tools",
    "model": "gpt-4o",
    "tokensUsed": 2450
  },
  "status": "published",
  "publishedAt": ISODate("2025-11-01T09:00:00Z"),
  "performance": {
    "views": 3425,
    "clicks": 287,
    "shares": 45,
    "engagement": 8.4
  },
  "versions": [
    {
      "content": "Original draft content...",
      "timestamp": ISODate("2025-10-28T14:00:00Z"),
      "editedBy": "john@example.com"
    }
  ],
  "createdAt": ISODate("2025-10-28T14:00:00Z"),
  "updatedAt": ISODate("2025-11-01T09:00:00Z")
}
```

---

## 4️⃣ MongoDB Collection: `influencers`

### Purpose
Store influencer profiles, metrics, AI scores, and collaboration status for influencer marketing campaigns.

### Schema Structure

```javascript
{
  "_id": ObjectId,
  "userId": ObjectId,              // Reference to users collection (indexed)
  "platform": String,              // "instagram" | "youtube" | "tiktok" | "twitter" | "linkedin"
  "username": String,              // Platform username (indexed)
  "displayName": String,           // Display name
  "profileUrl": String,            // Profile URL
  "avatarUrl": String,             // Profile picture URL
  "bio": String,                   // Bio/description
  "category": [String],            // Categories (e.g., ["Fashion", "Lifestyle"])
  
  "metrics": {
    "followers": Number,           // Follower count
    "following": Number,           // Following count
    "posts": Number,               // Total posts
    "avgLikes": Number,            // Average likes per post
    "avgComments": Number,         // Average comments per post
    "avgViews": Number,            // Average views (for video platforms)
    "engagementRate": Number       // Engagement rate percentage
  },
  
  "aiScore": {
    "relevance": Number,           // Brand relevance score (0-100)
    "authenticity": Number,        // Authenticity score (0-100)
    "reach": Number,               // Reach score (0-100)
    "engagement": Number,          // Engagement score (0-100)
    "overall": Number,             // Overall AI score (0-100)
    "lastCalculated": Date        // Last score calculation
  },
  
  "demographics": {
    "audienceAge": Mixed,          // Age distribution
    "audienceGender": Mixed,       // Gender distribution
    "audienceCountries": [String] // Top countries
  },
  
  "contactInfo": {
    "email": String,               // Contact email
    "website": String,             // Website URL
    "businessInquiries": String   // Business contact method
  },
  
  "collaboration": {
    "status": String,              // "discovered" | "shortlisted" | "contacted" | "negotiating" | "partnered" | "rejected"
    "notes": String,               // Collaboration notes
    "lastContact": Date,           // Last contact date
    "estimatedCost": Number,       // Estimated collaboration cost
    "campaignIds": [ObjectId]     // Related campaigns
  },
  
  "scrapedAt": Date,              // Last data scrape
  "updatedAt": Date,
  "createdAt": Date
}
```

### Indexes
```javascript
db.influencers.createIndex({ "userId": 1 })
db.influencers.createIndex({ "platform": 1 })
db.influencers.createIndex({ "username": 1 })
db.influencers.createIndex({ "metrics.followers": -1 })
db.influencers.createIndex({ "aiScore.overall": -1 })
db.influencers.createIndex({ "collaboration.status": 1 })
```

### Sample Document
```json
{
  "_id": ObjectId("673jkl012ghi345678901234"),
  "userId": ObjectId("673abc123def456789012345"),
  "platform": "instagram",
  "username": "techinfluencer_sarah",
  "displayName": "Sarah | Tech Reviews",
  "profileUrl": "https://instagram.com/techinfluencer_sarah",
  "avatarUrl": "https://instagram.com/avatar.jpg",
  "bio": "Tech enthusiast | Product reviews | 100K+ followers",
  "category": ["Technology", "Gadgets", "Reviews"],
  "metrics": {
    "followers": 125000,
    "following": 890,
    "posts": 456,
    "avgLikes": 8500,
    "avgComments": 320,
    "engagementRate": 7.06
  },
  "aiScore": {
    "relevance": 92,
    "authenticity": 88,
    "reach": 85,
    "engagement": 90,
    "overall": 89,
    "lastCalculated": ISODate("2025-11-05T08:00:00Z")
  },
  "demographics": {
    "audienceAge": { "18-24": 25, "25-34": 45, "35-44": 20, "45+": 10 },
    "audienceGender": { "male": 60, "female": 38, "other": 2 },
    "audienceCountries": ["United States", "United Kingdom", "Canada"]
  },
  "contactInfo": {
    "email": "business@sarahtech.com",
    "website": "https://sarahtech.com"
  },
  "collaboration": {
    "status": "shortlisted",
    "notes": "Great engagement rate, good fit for tech product launch",
    "estimatedCost": 2500
  },
  "scrapedAt": ISODate("2025-11-05T08:00:00Z"),
  "createdAt": ISODate("2025-10-15T10:00:00Z"),
  "updatedAt": ISODate("2025-11-05T08:00:00Z")
}
```

---

## 5️⃣ MongoDB Collection: `seoaudits`

### Purpose
Store comprehensive SEO audit results including technical analysis, content quality, keyword rankings, and AI recommendations.

### Schema Structure

```javascript
{
  "_id": ObjectId,
  "userId": ObjectId,              // Reference to users collection (indexed)
  "brandId": String,               // Brand identifier
  "url": String,                   // Audited URL (indexed)
  "type": String,                  // "full_site" | "page" | "competitor"
  
  "scores": {
    "overall": Number,             // Overall SEO score (0-100)
    "technical": Number,           // Technical SEO score
    "content": Number,             // Content quality score
    "mobile": Number,              // Mobile optimization score
    "speed": Number,               // Page speed score
    "accessibility": Number        // Accessibility score
  },
  
  "technicalSEO": {
    "metaTags": {
      "hasTitle": Boolean,         // Has title tag
      "titleLength": Number,       // Title length
      "hasDescription": Boolean,   // Has meta description
      "descriptionLength": Number, // Description length
      "hasKeywords": Boolean,      // Has meta keywords
      "hasOpenGraph": Boolean      // Has Open Graph tags
    },
    "headings": {
      "h1Count": Number,           // Number of H1 tags
      "h2Count": Number,           // Number of H2 tags
      "structure": [String]        // Heading hierarchy
    },
    "images": {
      "total": Number,             // Total images
      "withAlt": Number,           // Images with alt text
      "withoutAlt": Number,        // Images missing alt text
      "optimized": Number          // Optimized images
    },
    "links": {
      "internal": Number,          // Internal links
      "external": Number,          // External links
      "broken": Number             // Broken links
    },
    "mobile": {
      "responsive": Boolean,       // Is mobile responsive
      "viewport": Boolean          // Has viewport meta tag
    },
    "performance": {
      "loadTime": Number,          // Page load time (seconds)
      "pageSize": Number,          // Page size (KB)
      "requests": Number           // Number of HTTP requests
    }
  },
  
  "contentAnalysis": {
    "wordCount": Number,           // Total word count
    "readability": Number,         // Readability score
    "keywordDensity": Mixed,       // Keyword density analysis
    "contentQuality": String,      // Quality rating
    "duplicateContent": Boolean    // Has duplicate content
  },
  
  "keywords": [                    // Tracked keywords
    {
      "keyword": String,           // Keyword phrase
      "position": Number,          // Search ranking position
      "volume": Number,            // Monthly search volume
      "difficulty": Number,        // Keyword difficulty (0-100)
      "opportunity": Number        // Opportunity score (0-100)
    }
  ],
  
  "recommendations": [             // SEO recommendations
    {
      "category": String,          // Recommendation category
      "priority": String,          // "critical" | "high" | "medium" | "low"
      "issue": String,             // Issue description
      "solution": String,          // Recommended solution
      "impact": String            // Expected impact
    }
  ],
  
  "competitors": [                 // Competitor analysis (optional)
    {
      "url": String,               // Competitor URL
      "score": Number,             // Their SEO score
      "keywords": Number,          // Keywords ranking
      "backlinks": Number          // Backlink count
    }
  ],
  
  "aiInsights": {
    "summary": String,             // AI-generated summary
    "topIssues": [String],         // Top issues found
    "quickWins": [String],         // Quick win opportunities
    "contentGaps": [String]        // Content gap analysis
  },
  
  "auditedAt": Date,              // Audit completion time
  "createdAt": Date,
  "updatedAt": Date
}
```

### Indexes
```javascript
db.seoaudits.createIndex({ "userId": 1 })
db.seoaudits.createIndex({ "url": 1 })
db.seoaudits.createIndex({ "auditedAt": -1 })
db.seoaudits.createIndex({ "scores.overall": -1 })
```

### Sample Document
```json
{
  "_id": ObjectId("673mno345jkl678901234567"),
  "userId": ObjectId("673abc123def456789012345"),
  "brandId": "brand_tech_001",
  "url": "https://techstartup.com",
  "type": "full_site",
  "scores": {
    "overall": 78,
    "technical": 82,
    "content": 75,
    "mobile": 90,
    "speed": 68,
    "accessibility": 85
  },
  "technicalSEO": {
    "metaTags": {
      "hasTitle": true,
      "titleLength": 58,
      "hasDescription": true,
      "descriptionLength": 145,
      "hasKeywords": false,
      "hasOpenGraph": true
    },
    "headings": {
      "h1Count": 1,
      "h2Count": 8,
      "structure": ["H1", "H2", "H3", "H2", "H3", "H2"]
    },
    "images": {
      "total": 45,
      "withAlt": 38,
      "withoutAlt": 7,
      "optimized": 40
    },
    "links": {
      "internal": 78,
      "external": 12,
      "broken": 2
    },
    "mobile": {
      "responsive": true,
      "viewport": true
    },
    "performance": {
      "loadTime": 2.8,
      "pageSize": 2450,
      "requests": 67
    }
  },
  "contentAnalysis": {
    "wordCount": 3250,
    "readability": 72,
    "keywordDensity": { "AI marketing": 2.3, "automation": 1.8 },
    "contentQuality": "good",
    "duplicateContent": false
  },
  "keywords": [
    {
      "keyword": "AI marketing automation",
      "position": 12,
      "volume": 5400,
      "difficulty": 65,
      "opportunity": 78
    }
  ],
  "recommendations": [
    {
      "category": "Performance",
      "priority": "high",
      "issue": "Page load time is 2.8 seconds",
      "solution": "Optimize images and enable compression",
      "impact": "Could improve load time by 40%"
    },
    {
      "category": "Content",
      "priority": "medium",
      "issue": "7 images missing alt text",
      "solution": "Add descriptive alt text to all images",
      "impact": "Improves accessibility and SEO"
    }
  ],
  "aiInsights": {
    "summary": "Good overall SEO foundation with room for improvement in page speed and image optimization",
    "topIssues": [
      "Page load time above 2 seconds",
      "Missing alt text on some images",
      "2 broken links detected"
    ],
    "quickWins": [
      "Fix broken links for immediate boost",
      "Add alt text to 7 images",
      "Enable browser caching"
    ],
    "contentGaps": [
      "Add more content about 'marketing analytics'",
      "Create guides for beginners",
      "Expand use case section"
    ]
  },
  "auditedAt": ISODate("2025-11-05T14:30:00Z"),
  "createdAt": ISODate("2025-11-05T14:00:00Z"),
  "updatedAt": ISODate("2025-11-05T14:30:00Z")
}
```

---

## 🔥 Firebase Database Structure

**Note:** Firebase is used **only for authentication** in this project. Firestore is initialized but **not actively used** for data storage.

### Firebase Services Used

1. **Firebase Authentication**
   - Email/Password authentication
   - User UID generation
   - JWT token management
   - No Firestore collections needed for auth

2. **Firebase Storage** (Optional)
   - Store user profile pictures
   - Store campaign creative assets
   - Store content images
   - Organized by folders: `/users/{uid}/`, `/campaigns/{campaignId}/`, `/content/{contentId}/`

### Firestore Collections (Optional - Currently Not Used)

If you want to add Firestore for real-time features, these collections could be useful:

#### Collection: `notifications`
```javascript
{
  "userId": String,              // User UID
  "type": String,                // "campaign_alert" | "content_published" | "seo_completed"
  "message": String,             // Notification message
  "read": Boolean,               // Read status
  "link": String,                // Deep link URL
  "createdAt": Timestamp
}
```

#### Collection: `chat_history` (for AI Copilot)
```javascript
{
  "userId": String,              // User UID
  "sessionId": String,           // Chat session ID
  "messages": [
    {
      "role": String,            // "user" | "assistant"
      "content": String,         // Message content
      "timestamp": Timestamp
    }
  ],
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

#### Collection: `activity_feed`
```javascript
{
  "userId": String,              // User UID
  "action": String,              // Action performed
  "resource": String,            // Resource type (campaign, content, etc.)
  "resourceId": String,          // MongoDB document ID
  "metadata": Object,            // Additional data
  "timestamp": Timestamp
}
```

---

## 🚀 MongoDB Setup Commands

### Option 1: Local MongoDB

```bash
# Start MongoDB
mongod

# Connect to MongoDB
mongosh

# Create database and user
use growpilot
db.createUser({
  user: "growpilot_admin",
  pwd: "your_secure_password",
  roles: [{ role: "readWrite", db: "growpilot" }]
})

# Create collections (auto-created on first insert, but you can pre-create)
db.createCollection("users")
db.createCollection("campaigns")
db.createCollection("contents")
db.createCollection("influencers")
db.createCollection("seoaudits")

# Create indexes for users
db.users.createIndex({ "uid": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "subscription.tier": 1 })
db.users.createIndex({ "createdAt": -1 })

# Create indexes for campaigns
db.campaigns.createIndex({ "userId": 1 })
db.campaigns.createIndex({ "status": 1 })
db.campaigns.createIndex({ "platform": 1 })
db.campaigns.createIndex({ "schedule.startDate": -1 })

# Create indexes for contents
db.contents.createIndex({ "userId": 1 })
db.contents.createIndex({ "type": 1 })
db.contents.createIndex({ "status": 1 })
db.contents.createIndex({ "publishedAt": -1 })

# Create indexes for influencers
db.influencers.createIndex({ "userId": 1 })
db.influencers.createIndex({ "platform": 1 })
db.influencers.createIndex({ "username": 1 })
db.influencers.createIndex({ "metrics.followers": -1 })
db.influencers.createIndex({ "aiScore.overall": -1 })

# Create indexes for seoaudits
db.seoaudits.createIndex({ "userId": 1 })
db.seoaudits.createIndex({ "url": 1 })
db.seoaudits.createIndex({ "auditedAt": -1 })
db.seoaudits.createIndex({ "scores.overall": -1 })

# Verify collections
show collections

# Check database stats
db.stats()
```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Atlas Account:** https://www.mongodb.com/cloud/atlas/register
2. **Create Cluster:** Choose free tier or paid plan
3. **Create Database User:**
   - Username: `growpilot_admin`
   - Password: Generate secure password
4. **Whitelist IP:** Add your IP or `0.0.0.0/0` for development
5. **Get Connection String:**
   ```
   mongodb+srv://growpilot_admin:<password>@cluster0.xxxxx.mongodb.net/growpilot?retryWrites=true&w=majority
   ```
6. **Update backend/.env:**
   ```env
   MONGODB_URI=mongodb+srv://growpilot_admin:<password>@cluster0.xxxxx.mongodb.net/growpilot?retryWrites=true&w=majority
   ```

### Option 3: Docker MongoDB

```bash
# Start MongoDB container (already in docker-compose.yml)
docker-compose up mongodb -d

# Connect to MongoDB container
docker exec -it growpilot-mongodb-1 mongosh

# Then run the setup commands from Option 1
```

---

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Project name: `growpilot` (or your choice)
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. (Optional) Enable **Google Sign-In**
4. Save changes

### 3. Get Firebase Config

1. Go to **Project Settings** → **General**
2. Scroll to "Your apps"
3. Click **Web** icon (`</>`)
4. Register app: `GrowPilot Web`
5. Copy the config object:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "growpilot-xxxxx.firebaseapp.com",
  projectId: "growpilot-xxxxx",
  storageBucket: "growpilot-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

6. Update `frontend/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=growpilot-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=growpilot-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=growpilot-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
```

### 4. Setup Firebase Admin SDK (Backend)

1. Go to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. Download JSON file
4. Rename to `serviceAccountKey.json`
5. Place in `backend/` folder (gitignored)
6. Update `backend/.env`:

```env
FIREBASE_PROJECT_ID=growpilot-xxxxx
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@growpilot-xxxxx.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### 5. (Optional) Setup Storage Rules

If using Firebase Storage for images:

1. Go to **Storage** → **Rules**
2. Add rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User profile images
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Campaign assets
    match /campaigns/{campaignId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Content images
    match /content/{contentId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📊 Database Size Estimates

### For 1,000 Users:

| Collection | Avg Doc Size | Est. Count | Total Size |
|------------|--------------|------------|------------|
| users | 10 KB | 1,000 | ~10 MB |
| campaigns | 50 KB | 15,000 | ~750 MB |
| contents | 20 KB | 80,000 | ~1.6 GB |
| influencers | 30 KB | 50,000 | ~1.5 GB |
| seoaudits | 100 KB | 12,000 | ~1.2 GB |
| **Total** | - | 158,000 | **~5 GB** |

### For 10,000 Users:

| Collection | Est. Total Size |
|------------|-----------------|
| users | ~100 MB |
| campaigns | ~7.5 GB |
| contents | ~16 GB |
| influencers | ~15 GB |
| seoaudits | ~12 GB |
| **Total** | **~50 GB** |

---

## ✅ Database Setup Checklist

### MongoDB Setup
- [ ] MongoDB installed/Atlas account created
- [ ] Database `growpilot` created
- [ ] Database user created with readWrite permissions
- [ ] Connection string added to `backend/.env`
- [ ] All collections created (auto-created on first use)
- [ ] Indexes created for performance
- [ ] Connection tested successfully

### Firebase Setup
- [ ] Firebase project created
- [ ] Email/Password authentication enabled
- [ ] Web app registered in Firebase Console
- [ ] Firebase config added to `frontend/.env.local`
- [ ] Service account key downloaded
- [ ] Firebase Admin credentials added to `backend/.env`
- [ ] Storage rules configured (if using)
- [ ] Authentication tested

### Backend Configuration
- [ ] `backend/.env` file created and configured
- [ ] MongoDB URI correct
- [ ] Firebase credentials correct
- [ ] OpenAI API key added
- [ ] Backend starts without errors

### Frontend Configuration
- [ ] `frontend/.env.local` file created and configured
- [ ] Firebase config correct
- [ ] API URL pointing to backend
- [ ] Frontend starts without errors
- [ ] Can access dashboard

---

## 🎯 Ready to Start!

Once you complete the checklist above:

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Database:**
   - Create a user account
   - Create a campaign
   - Generate content
   - Run SEO audit
   - Search influencers

All data will be automatically stored in MongoDB!

---

## 📞 Support

- **MongoDB Docs:** https://docs.mongodb.com/
- **Firebase Docs:** https://firebase.google.com/docs
- **Mongoose Docs:** https://mongoosejs.com/docs/
- **Project Setup:** See `QUICKSTART.md` and `SETUP.md`
