import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaign extends Document {
  userId: mongoose.Types.ObjectId;
  brandId: string;
  name: string;
  objective: 'awareness' | 'traffic' | 'engagement' | 'leads' | 'sales';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'archived';
  platform: 'facebook' | 'instagram' | 'linkedin' | 'google' | 'youtube' | 'multi';
  budget: {
    total: number;
    daily?: number;
    currency: string;
    spent: number;
  };
  targeting: {
    age?: { min: number; max: number };
    gender?: 'all' | 'male' | 'female';
    locations?: string[];
    interests?: string[];
    keywords?: string[];
    audienceSize?: number;
  };
  creatives: Array<{
    id: string;
    type: 'image' | 'video' | 'carousel';
    url: string;
    thumbnail?: string;
    headline: string;
    description: string;
    cta: string;
    aiGenerated: boolean;
    prompt?: string;
  }>;
  schedule: {
    startDate: Date;
    endDate?: Date;
    timezone: string;
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpm: number;
    roas: number;
    lastUpdated?: Date;
  };
  aiInsights: {
    suggestions: string[];
    optimizationScore: number;
    predictedROI?: number;
    lastAnalyzed?: Date;
  };
  platformCampaignId?: string;
  history: Array<{
    action: string;
    timestamp: Date;
    performedBy: string;
    details?: any;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    brandId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    objective: {
      type: String,
      enum: ['awareness', 'traffic', 'engagement', 'leads', 'sales'],
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'active', 'paused', 'completed', 'archived'],
      default: 'draft',
    },
    platform: {
      type: String,
      enum: ['facebook', 'instagram', 'linkedin', 'google', 'youtube', 'multi'],
      required: true,
    },
    budget: {
      total: {
        type: Number,
        required: true,
        min: 0,
      },
      daily: Number,
      currency: {
        type: String,
        default: 'USD',
      },
      spent: {
        type: Number,
        default: 0,
      },
    },
    targeting: {
      age: {
        min: { type: Number, min: 13, max: 65 },
        max: { type: Number, min: 13, max: 65 },
      },
      gender: {
        type: String,
        enum: ['all', 'male', 'female'],
        default: 'all',
      },
      locations: [String],
      interests: [String],
      keywords: [String],
      audienceSize: Number,
    },
    creatives: [
      {
        id: String,
        type: {
          type: String,
          enum: ['image', 'video', 'carousel'],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        thumbnail: String,
        headline: {
          type: String,
          required: true,
        },
        description: String,
        cta: String,
        aiGenerated: {
          type: Boolean,
          default: false,
        },
        prompt: String,
      },
    ],
    schedule: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: Date,
      timezone: {
        type: String,
        default: 'UTC',
      },
    },
    performance: {
      impressions: {
        type: Number,
        default: 0,
      },
      clicks: {
        type: Number,
        default: 0,
      },
      conversions: {
        type: Number,
        default: 0,
      },
      ctr: {
        type: Number,
        default: 0,
      },
      cpc: {
        type: Number,
        default: 0,
      },
      cpm: {
        type: Number,
        default: 0,
      },
      roas: {
        type: Number,
        default: 0,
      },
      lastUpdated: Date,
    },
    aiInsights: {
      suggestions: [String],
      optimizationScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      predictedROI: Number,
      lastAnalyzed: Date,
    },
    platformCampaignId: String,
    history: [
      {
        action: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        performedBy: String,
        details: Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
CampaignSchema.index({ userId: 1, status: 1 });
CampaignSchema.index({ brandId: 1 });
CampaignSchema.index({ platform: 1 });
CampaignSchema.index({ createdAt: -1 });

export default mongoose.model<ICampaign>('Campaign', CampaignSchema);
