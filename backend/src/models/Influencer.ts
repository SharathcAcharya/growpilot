import mongoose, { Schema, Document } from 'mongoose';

export interface IInfluencer extends Document {
  userId: mongoose.Types.ObjectId;
  platform: 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'linkedin';
  username: string;
  displayName: string;
  profileUrl: string;
  avatarUrl?: string;
  bio?: string;
  category: string[];
  metrics: {
    followers: number;
    following: number;
    posts: number;
    avgLikes: number;
    avgComments: number;
    avgViews?: number;
    engagementRate: number;
  };
  aiScore: {
    relevance: number;
    authenticity: number;
    reach: number;
    engagement: number;
    overall: number;
    lastCalculated: Date;
  };
  demographics: {
    audienceAge?: any;
    audienceGender?: any;
    audienceCountries?: string[];
  };
  contactInfo?: {
    email?: string;
    website?: string;
    businessInquiries?: string;
  };
  collaboration: {
    status: 'discovered' | 'shortlisted' | 'contacted' | 'negotiating' | 'partnered' | 'rejected';
    notes?: string;
    lastContact?: Date;
    estimatedCost?: number;
    campaignIds?: mongoose.Types.ObjectId[];
  };
  scrapedAt: Date;
  updatedAt: Date;
  createdAt: Date;
}

const InfluencerSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ['instagram', 'youtube', 'tiktok', 'twitter', 'linkedin'],
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    profileUrl: {
      type: String,
      required: true,
    },
    avatarUrl: String,
    bio: String,
    category: {
      type: [String],
      default: [],
    },
    metrics: {
      followers: {
        type: Number,
        required: true,
        min: 0,
      },
      following: {
        type: Number,
        default: 0,
      },
      posts: {
        type: Number,
        default: 0,
      },
      avgLikes: {
        type: Number,
        default: 0,
      },
      avgComments: {
        type: Number,
        default: 0,
      },
      avgViews: Number,
      engagementRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
    aiScore: {
      relevance: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      authenticity: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      reach: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      engagement: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      overall: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      lastCalculated: {
        type: Date,
        default: Date.now,
      },
    },
    demographics: {
      audienceAge: Schema.Types.Mixed,
      audienceGender: Schema.Types.Mixed,
      audienceCountries: [String],
    },
    contactInfo: {
      email: String,
      website: String,
      businessInquiries: String,
    },
    collaboration: {
      status: {
        type: String,
        enum: ['discovered', 'shortlisted', 'contacted', 'negotiating', 'partnered', 'rejected'],
        default: 'discovered',
      },
      notes: String,
      lastContact: Date,
      estimatedCost: Number,
      campaignIds: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Campaign',
        },
      ],
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
InfluencerSchema.index({ userId: 1, platform: 1 });
InfluencerSchema.index({ username: 1, platform: 1 }, { unique: true });
InfluencerSchema.index({ category: 1 });
InfluencerSchema.index({ 'metrics.followers': -1 });
InfluencerSchema.index({ 'aiScore.overall': -1 });
InfluencerSchema.index({ 'collaboration.status': 1 });

export default mongoose.model<IInfluencer>('Influencer', InfluencerSchema);
