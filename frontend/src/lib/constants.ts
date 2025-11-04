export const APP_NAME = 'GrowPilot';
export const APP_DESCRIPTION = 'AI-powered marketing automation platform';

export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    campaigns: 3,
    content: 10,
    seoAudits: 5,
    features: [
      '1 brand',
      '3 campaigns per month',
      'Basic analytics',
      'AI content generation',
      'Email support',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 39,
    campaigns: Infinity,
    content: Infinity,
    seoAudits: 50,
    features: [
      'Unlimited brands',
      'Unlimited campaigns',
      'Advanced analytics',
      'SEO tools',
      'Influencer search',
      'Priority support',
    ],
  },
  BUSINESS: {
    name: 'Business',
    price: 99,
    campaigns: Infinity,
    content: Infinity,
    seoAudits: Infinity,
    features: [
      'Everything in Pro',
      'AI influencer suite',
      'Custom integrations',
      'White-label option',
      'Dedicated account manager',
      '24/7 premium support',
    ],
  },
};

export const PLATFORMS = {
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  LINKEDIN: 'linkedin',
  GOOGLE: 'google',
  YOUTUBE: 'youtube',
} as const;

export const CAMPAIGN_OBJECTIVES = {
  AWARENESS: 'awareness',
  TRAFFIC: 'traffic',
  ENGAGEMENT: 'engagement',
  LEADS: 'leads',
  SALES: 'sales',
} as const;

export const CONTENT_TYPES = {
  BLOG: 'blog',
  SOCIAL_POST: 'social_post',
  AD_COPY: 'ad_copy',
  EMAIL: 'email',
} as const;

export const INFLUENCER_PLATFORMS = {
  INSTAGRAM: 'instagram',
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
  TWITTER: 'twitter',
} as const;
