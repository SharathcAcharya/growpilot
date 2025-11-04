import mongoose, { Schema, Document } from 'mongoose';

export interface ISEOAudit extends Document {
  userId: mongoose.Types.ObjectId;
  brandId: string;
  url: string;
  type: 'full_site' | 'page' | 'competitor';
  scores: {
    overall: number;
    technical: number;
    content: number;
    mobile: number;
    speed: number;
    accessibility: number;
  };
  technicalSEO: {
    metaTags: {
      hasTitle: boolean;
      titleLength?: number;
      hasDescription: boolean;
      descriptionLength?: number;
      hasKeywords: boolean;
      hasOpenGraph: boolean;
    };
    headings: {
      h1Count: number;
      h2Count: number;
      structure: string[];
    };
    images: {
      total: number;
      withAlt: number;
      withoutAlt: number;
      optimized: number;
    };
    links: {
      internal: number;
      external: number;
      broken: number;
    };
    mobile: {
      responsive: boolean;
      viewport: boolean;
    };
    performance: {
      loadTime?: number;
      pageSize?: number;
      requests?: number;
    };
  };
  contentAnalysis: {
    wordCount: number;
    readability?: number;
    keywordDensity?: any;
    contentQuality: string;
    duplicateContent?: boolean;
  };
  keywords: Array<{
    keyword: string;
    position?: number;
    volume?: number;
    difficulty?: number;
    opportunity?: number;
  }>;
  recommendations: Array<{
    category: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    issue: string;
    solution: string;
    impact: string;
  }>;
  competitors?: Array<{
    url: string;
    score: number;
    keywords: number;
    backlinks: number;
  }>;
  aiInsights: {
    summary: string;
    topIssues: string[];
    quickWins: string[];
    contentGaps: string[];
  };
  auditedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SEOAuditSchema: Schema = new Schema(
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
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['full_site', 'page', 'competitor'],
      required: true,
    },
    scores: {
      overall: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },
      technical: {
        type: Number,
        min: 0,
        max: 100,
      },
      content: {
        type: Number,
        min: 0,
        max: 100,
      },
      mobile: {
        type: Number,
        min: 0,
        max: 100,
      },
      speed: {
        type: Number,
        min: 0,
        max: 100,
      },
      accessibility: {
        type: Number,
        min: 0,
        max: 100,
      },
    },
    technicalSEO: {
      metaTags: {
        hasTitle: Boolean,
        titleLength: Number,
        hasDescription: Boolean,
        descriptionLength: Number,
        hasKeywords: Boolean,
        hasOpenGraph: Boolean,
      },
      headings: {
        h1Count: Number,
        h2Count: Number,
        structure: [String],
      },
      images: {
        total: Number,
        withAlt: Number,
        withoutAlt: Number,
        optimized: Number,
      },
      links: {
        internal: Number,
        external: Number,
        broken: Number,
      },
      mobile: {
        responsive: Boolean,
        viewport: Boolean,
      },
      performance: {
        loadTime: Number,
        pageSize: Number,
        requests: Number,
      },
    },
    contentAnalysis: {
      wordCount: Number,
      readability: Number,
      keywordDensity: Schema.Types.Mixed,
      contentQuality: String,
      duplicateContent: Boolean,
    },
    keywords: [
      {
        keyword: String,
        position: Number,
        volume: Number,
        difficulty: Number,
        opportunity: Number,
      },
    ],
    recommendations: [
      {
        category: String,
        priority: {
          type: String,
          enum: ['critical', 'high', 'medium', 'low'],
        },
        issue: String,
        solution: String,
        impact: String,
      },
    ],
    competitors: [
      {
        url: String,
        score: Number,
        keywords: Number,
        backlinks: Number,
      },
    ],
    aiInsights: {
      summary: String,
      topIssues: [String],
      quickWins: [String],
      contentGaps: [String],
    },
    auditedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
SEOAuditSchema.index({ userId: 1, brandId: 1 });
SEOAuditSchema.index({ url: 1 });
SEOAuditSchema.index({ auditedAt: -1 });

export default mongoose.model<ISEOAudit>('SEOAudit', SEOAuditSchema);
