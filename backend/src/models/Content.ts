import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  userId: mongoose.Types.ObjectId;
  brandId: string;
  type: 'blog' | 'social_post' | 'ad_copy' | 'email' | 'landing_page';
  platform?: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'youtube' | 'website';
  title: string;
  content: string;
  metadata?: {
    wordCount: number;
    readingTime: number;
    tone?: string;
    keywords?: string[];
  };
  seoData?: {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
    score?: number;
  };
  aiGenerated: {
    isAI: boolean;
    prompt?: string;
    model?: string;
    tokensUsed?: number;
  };
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  scheduledAt?: Date;
  publishedAt?: Date;
  campaignId?: mongoose.Types.ObjectId;
  performance?: {
    views: number;
    clicks: number;
    shares: number;
    engagement: number;
  };
  versions: Array<{
    content: string;
    timestamp: Date;
    editedBy: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema: Schema = new Schema(
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
    type: {
      type: String,
      enum: ['blog', 'social_post', 'ad_copy', 'email', 'landing_page'],
      required: true,
    },
    platform: {
      type: String,
      enum: ['facebook', 'instagram', 'linkedin', 'twitter', 'youtube', 'website'],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    metadata: {
      wordCount: Number,
      readingTime: Number,
      tone: String,
      keywords: [String],
    },
    seoData: {
      metaTitle: String,
      metaDescription: String,
      focusKeyword: String,
      score: {
        type: Number,
        min: 0,
        max: 100,
      },
    },
    aiGenerated: {
      isAI: {
        type: Boolean,
        default: false,
      },
      prompt: String,
      model: String,
      tokensUsed: Number,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'archived'],
      default: 'draft',
    },
    scheduledAt: Date,
    publishedAt: Date,
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
    },
    performance: {
      views: {
        type: Number,
        default: 0,
      },
      clicks: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
      engagement: {
        type: Number,
        default: 0,
      },
    },
    versions: [
      {
        content: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        editedBy: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
ContentSchema.index({ userId: 1, type: 1 });
ContentSchema.index({ brandId: 1 });
ContentSchema.index({ status: 1 });
ContentSchema.index({ createdAt: -1 });
ContentSchema.index({ campaignId: 1 });

export default mongoose.model<IContent>('Content', ContentSchema);
