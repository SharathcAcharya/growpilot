import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import User from '../models/User';
import Campaign from '../models/Campaign';
import Content from '../models/Content';
import SEOAudit from '../models/SEOAudit';
import Influencer from '../models/Influencer';

export const getDashboardOverview = async (req: AuthRequest, res: Response): Promise<void> => {
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

    // Get counts
    const activeCampaigns = await Campaign.countDocuments({ userId: user._id, status: 'active' });
    const totalContent = await Content.countDocuments({ userId: user._id });
    const influencersShortlisted = await Influencer.countDocuments({
      userId: user._id,
      'collaboration.status': 'shortlisted',
    });

    // Get recent campaigns
    const recentCampaigns = await Campaign.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate total performance
    const allCampaigns = await Campaign.find({ userId: user._id, status: 'active' });
    const totalPerformance = allCampaigns.reduce(
      (acc, camp) => ({
        impressions: acc.impressions + camp.performance.impressions,
        clicks: acc.clicks + camp.performance.clicks,
        conversions: acc.conversions + camp.performance.conversions,
        spent: acc.spent + camp.budget.spent,
      }),
      { impressions: 0, clicks: 0, conversions: 0, spent: 0 }
    );

    res.json({
      success: true,
      data: {
        overview: {
          activeCampaigns,
          totalContent,
          influencersShortlisted,
          monthlyBudgetUsed: totalPerformance.spent,
        },
        recentCampaigns,
        performance: totalPerformance,
        subscription: user.subscription,
      },
    });
  } catch (error: any) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPerformanceMetrics = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { startDate, endDate, campaignId } = req.query;

    const filter: any = { userId: user._id };
    if (campaignId) filter._id = campaignId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const campaigns = await Campaign.find(filter);

    const metrics = campaigns.map((c) => ({
      campaignId: c._id,
      name: c.name,
      platform: c.platform,
      performance: c.performance,
      budget: c.budget,
      roi: c.budget.spent > 0 ? ((c.performance.conversions * 100 - c.budget.spent) / c.budget.spent) * 100 : 0,
    }));

    res.json({ success: true, data: metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
