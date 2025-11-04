import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Influencer from '../models/Influencer';
import User from '../models/User';
import { InfluencerService } from '../services/influencer.service';

export const searchInfluencers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { platform, category, minFollowers, maxFollowers, location, engagementRate } = req.body;

    const influencers = await InfluencerService.searchInfluencers({
      platform,
      category,
      minFollowers,
      maxFollowers,
      location,
      engagementRate,
    });

    res.json({ success: true, data: influencers });
  } catch (error: any) {
    console.error('Search Influencers Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInfluencers = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { platform, status, limit = 20, skip = 0 } = req.query;
    const filter: any = { userId: user._id };
    if (platform) filter.platform = platform;
    if (status) filter['collaboration.status'] = status;

    const influencers = await Influencer.find(filter)
      .sort({ 'aiScore.overall': -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Influencer.countDocuments(filter);

    res.json({ success: true, data: influencers, pagination: { total, limit: Number(limit), skip: Number(skip) } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInfluencerById = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const influencer = await Influencer.findOne({ _id: id, userId: user._id });
    if (!influencer) {
      res.status(404).json({ success: false, message: 'Influencer not found' });
      return;
    }

    res.json({ success: true, data: influencer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const scoreInfluencer = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const influencer = await Influencer.findOne({ _id: id, userId: user._id });
    if (!influencer) {
      res.status(404).json({ success: false, message: 'Influencer not found' });
      return;
    }

    const { brandName, industry, targetAudience } = req.body;
    const brandContext = { name: brandName, industry, targetAudience };

    const scoreResult = await InfluencerService.scoreInfluencer(influencer.toObject(), brandContext);

    if (scoreResult.success) {
      influencer.aiScore = {
        ...scoreResult.data,
        lastCalculated: new Date(),
      };
      await influencer.save();
    }

    res.json({ success: true, data: scoreResult.data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCollaborationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const influencer = await Influencer.findOne({ _id: id, userId: user._id });
    if (!influencer) {
      res.status(404).json({ success: false, message: 'Influencer not found' });
      return;
    }

    const { status, notes, estimatedCost } = req.body;
    influencer.collaboration.status = status;
    if (notes) influencer.collaboration.notes = notes;
    if (estimatedCost) influencer.collaboration.estimatedCost = estimatedCost;
    if (status === 'contacted') influencer.collaboration.lastContact = new Date();

    await influencer.save();

    res.json({ success: true, data: influencer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateOutreach = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const influencer = await Influencer.findOne({ _id: id, userId: user._id });
    if (!influencer) {
      res.status(404).json({ success: false, message: 'Influencer not found' });
      return;
    }

    const { brandInfo, campaignDetails } = req.body;

    const template = await InfluencerService.generateOutreachTemplate(
      influencer.toObject(),
      brandInfo,
      campaignDetails
    );

    res.json({ success: true, data: { template } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
