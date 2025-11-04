import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  uid: string; // Firebase UID
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'owner' | 'marketer' | 'analyst' | 'admin';
  subscription: {
    tier: 'free' | 'pro' | 'business';
    status: 'active' | 'cancelled' | 'expired' | 'trial';
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodEnd?: Date;
    trialEndsAt?: Date;
  };
  brands: Array<{
    name: string;
    industry: string;
    website?: string;
    logo?: string;
    isActive: boolean;
  }>;
  usage: {
    campaignsCreated: number;
    campaignsThisMonth: number;
    contentGenerated: number;
    seoAudits: number;
  };
  settings: {
    notifications: boolean;
    emailUpdates: boolean;
    language: string;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

const UserSchema: Schema = new Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    photoURL: {
      type: String,
    },
    role: {
      type: String,
      enum: ['owner', 'marketer', 'analyst', 'admin'],
      default: 'owner',
    },
    subscription: {
      tier: {
        type: String,
        enum: ['free', 'pro', 'business'],
        default: 'free',
      },
      status: {
        type: String,
        enum: ['active', 'cancelled', 'expired', 'trial'],
        default: 'trial',
      },
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      currentPeriodEnd: Date,
      trialEndsAt: {
        type: Date,
        default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      },
    },
    brands: [
      {
        name: String,
        industry: String,
        website: String,
        logo: String,
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    usage: {
      campaignsCreated: {
        type: Number,
        default: 0,
      },
      campaignsThisMonth: {
        type: Number,
        default: 0,
      },
      contentGenerated: {
        type: Number,
        default: 0,
      },
      seoAudits: {
        type: Number,
        default: 0,
      },
    },
    settings: {
      notifications: {
        type: Boolean,
        default: true,
      },
      emailUpdates: {
        type: Boolean,
        default: true,
      },
      language: {
        type: String,
        default: 'en',
      },
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ 'subscription.tier': 1 });
UserSchema.index({ createdAt: -1 });

export default mongoose.model<IUser>('User', UserSchema);
