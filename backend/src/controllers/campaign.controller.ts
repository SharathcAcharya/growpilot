import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Campaign from '../models/Campaign';
import User from '../models/User';
import { AIService } from '../services/ai.service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new campaign
 */
export const createCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Find user in MongoDB
    const user = await User.findOne({ uid: userId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Check subscription limits
    const limits = { free: 3, pro: Infinity, business: Infinity };
    const monthlyLimit = limits[user.subscription.tier];
    
    if (user.usage.campaignsThisMonth >= monthlyLimit) {
      res.status(403).json({
        success: false,
        message: 'Monthly campaign limit reached. Please upgrade your plan.',
      });
      return;
    }

    const campaignData = {
      ...req.body,
      userId: user._id,
      history: [
        {
          action: 'created',
          timestamp: new Date(),
          performedBy: userId,
        },
      ],
    };

    const campaign = new Campaign(campaignData);
    await campaign.save();

    // Update user usage
    await User.updateOne(
      { uid: userId },
      {
        $inc: {
          'usage.campaignsCreated': 1,
          'usage.campaignsThisMonth': 1,
        },
      }
    );

    res.status(201).json({
      success: true,
      data: campaign,
    });
  } catch (error: any) {
    console.error('Create Campaign Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create campaign',
    });
  }
};

/**
 * Get all campaigns for user
 */
export const getCampaigns = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findOne({ uid: userId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const { status, platform, brandId, limit = 20, skip = 0 } = req.query;

    const filter: any = { userId: user._id };
    if (status) filter.status = status;
    if (platform) filter.platform = platform;
    if (brandId) filter.brandId = brandId;

    const campaigns = await Campaign.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Campaign.countDocuments(filter);

    res.json({
      success: true,
      data: campaigns,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
      },
    });
  } catch (error: any) {
    console.error('Get Campaigns Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch campaigns',
    });
  }
};

/**
 * Get campaign by ID
 */
export const getCampaignById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findOne({ uid: userId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const campaign = await Campaign.findOne({ _id: id, userId: user._id });

    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }

    res.json({
      success: true,
      data: campaign,
    });
  } catch (error: any) {
    console.error('Get Campaign Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch campaign',
    });
  }
};

/**
 * Update campaign
 */
export const updateCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findOne({ uid: userId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const campaign = await Campaign.findOneAndUpdate(
      { _id: id, userId: user._id },
      {
        ...req.body,
        $push: {
          history: {
            action: 'updated',
            timestamp: new Date(),
            performedBy: userId,
            details: req.body,
          },
        },
      },
      { new: true }
    );

    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }

    res.json({
      success: true,
      data: campaign,
    });
  } catch (error: any) {
    console.error('Update Campaign Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update campaign',
    });
  }
};

/**
 * Delete campaign
 */
export const deleteCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findOne({ uid: userId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const campaign = await Campaign.findOneAndDelete({ _id: id, userId: user._id });

    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Campaign deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete Campaign Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete campaign',
    });
  }
};

/**
 * Generate AI campaign creative
 */
export const generateCampaignCreative = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    const { id } = req.params;
    const { brandName, industry, targetAudience, tone, additionalContext } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findOne({ uid: userId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const campaign = await Campaign.findOne({ _id: id, userId: user._id });
    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }

    // Generate text creative
    const creativeResult = await AIService.generateAdCreative({
      brandName,
      industry,
      objective: campaign.objective,
      targetAudience,
      tone,
      platform: campaign.platform,
      additionalContext,
    });

    if (!creativeResult.success) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate creative',
      });
      return;
    }

    // Optionally generate image
    let imageUrl;
    if (req.body.generateImage) {
      const imagePrompt = `${brandName} ${campaign.objective} ad for ${industry}, targeting ${targetAudience}`;
      const imageResult = await AIService.generateImage(imagePrompt);
      if (imageResult.success) {
        imageUrl = imageResult.url;
      }
    }

    // Create creative objects
    const creatives = [];
    const headlines = creativeResult.data.headlines || [];
    const descriptions = creativeResult.data.descriptions || [];
    const ctas = creativeResult.data.ctas || [];

    for (let i = 0; i < Math.min(headlines.length, 3); i++) {
      creatives.push({
        id: uuidv4(),
        type: imageUrl ? 'image' : 'text',
        url: imageUrl || '',
        headline: headlines[i],
        description: descriptions[i] || '',
        cta: ctas[i] || 'Learn More',
        aiGenerated: true,
        prompt: req.body.additionalContext || '',
      });
    }

    // Update campaign with creatives
    campaign.creatives.push(...creatives);
    await campaign.save();

    res.json({
      success: true,
      data: {
        creatives,
        tokensUsed: creativeResult.tokensUsed,
      },
    });
  } catch (error: any) {
    console.error('Generate Creative Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate creative',
    });
  }
};

/**
 * Deploy campaign to ad platform
 */
export const deployCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findOne({ uid: userId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const campaign = await Campaign.findOne({ _id: id, userId: user._id });
    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }

    // TODO: Integrate with actual ad platforms (Meta, Google Ads, etc.)
    // For now, simulate deployment
    campaign.status = 'active';
    campaign.platformCampaignId = `platform_${uuidv4()}`;
    await campaign.save();

    res.json({
      success: true,
      message: 'Campaign deployed successfully',
      data: campaign,
    });
  } catch (error: any) {
    console.error('Deploy Campaign Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to deploy campaign',
    });
  }
};

/**
 * Get campaign analytics
 */
export const getCampaignAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findOne({ uid: userId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const campaign = await Campaign.findOne({ _id: id, userId: user._id });
    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }

    // TODO: Fetch real analytics from ad platforms
    // For now, return campaign performance data
    res.json({
      success: true,
      data: {
        campaign: {
          name: campaign.name,
          status: campaign.status,
          platform: campaign.platform,
        },
        performance: campaign.performance,
        budget: campaign.budget,
        insights: campaign.aiInsights,
      },
    });
  } catch (error: any) {
    console.error('Get Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch analytics',
    });
  }
};

/**
 * Get AI-powered campaign optimization suggestions
 */
export const optimizeCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findOne({ uid: userId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const campaign = await Campaign.findOne({ _id: id, userId: user._id });
    if (!campaign) {
      res.status(404).json({ success: false, message: 'Campaign not found' });
      return;
    }

    const optimizationResult = await AIService.optimizeCampaign(campaign.toObject());

    if (!optimizationResult.success) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate optimization suggestions',
      });
      return;
    }

    // Update campaign with AI insights
    campaign.aiInsights = {
      suggestions: optimizationResult.data.optimizations || [],
      optimizationScore: 75, // Calculate based on recommendations
      lastAnalyzed: new Date(),
    };
    await campaign.save();

    res.json({
      success: true,
      data: optimizationResult.data,
    });
  } catch (error: any) {
    console.error('Optimize Campaign Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to optimize campaign',
    });
  }
};
