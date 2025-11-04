import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import User from '../models/User';

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    let user = await User.findOne({ uid: userId });

    // Create user if doesn't exist
    if (!user) {
      user = new User({
        uid: userId,
        email: req.user?.email || '',
        displayName: req.user?.email?.split('@')[0] || 'User',
      });
      await user.save();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({ success: true, data: user });
  } catch (error: any) {
    console.error('Get User Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findOneAndUpdate(
      { uid: userId },
      { $set: req.body },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { tier, stripeCustomerId, stripeSubscriptionId, currentPeriodEnd } = req.body;

    const user = await User.findOneAndUpdate(
      { uid: userId },
      {
        $set: {
          'subscription.tier': tier,
          'subscription.status': 'active',
          'subscription.stripeCustomerId': stripeCustomerId,
          'subscription.stripeSubscriptionId': stripeSubscriptionId,
          'subscription.currentPeriodEnd': currentPeriodEnd,
        },
      },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsageStats = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const limits = {
      free: { campaigns: 3, content: 10, seoAudits: 5 },
      pro: { campaigns: Infinity, content: Infinity, seoAudits: 50 },
      business: { campaigns: Infinity, content: Infinity, seoAudits: Infinity },
    };

    const tierLimits = limits[user.subscription.tier];

    res.json({
      success: true,
      data: {
        usage: user.usage,
        limits: tierLimits,
        subscription: user.subscription,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
