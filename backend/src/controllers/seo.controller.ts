import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import SEOAudit from '../models/SEOAudit';
import User from '../models/User';
import { SEOService } from '../services/seo.service';

export const auditWebsite = async (req: AuthRequest, res: Response): Promise<void> => {
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

    // Check limits
    const limits = { free: 5, pro: 50, business: Infinity };
    if (user.usage.seoAudits >= limits[user.subscription.tier]) {
      res.status(403).json({ success: false, message: 'SEO audit limit reached. Please upgrade.' });
      return;
    }

    const { url, brandId, type = 'page' } = req.body;

    // Perform SEO audit
    const auditResult = await SEOService.auditWebsite(url);

    // Save to database
    const seoAudit = new SEOAudit({
      userId: user._id,
      brandId,
      type,
      ...auditResult,
    });

    await seoAudit.save();

    await User.updateOne({ uid: userId }, { $inc: { 'usage.seoAudits': 1 } });

    res.status(201).json({ success: true, data: seoAudit });
  } catch (error: any) {
    console.error('SEO Audit Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAudits = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { brandId, limit = 20, skip = 0 } = req.query;
    const filter: any = { userId: user._id };
    if (brandId) filter.brandId = brandId;

    const audits = await SEOAudit.find(filter)
      .sort({ auditedAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await SEOAudit.countDocuments(filter);

    res.json({ success: true, data: audits, pagination: { total, limit: Number(limit), skip: Number(skip) } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAuditById = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const audit = await SEOAudit.findOne({ _id: id, userId: user._id });
    if (!audit) {
      res.status(404).json({ success: false, message: 'Audit not found' });
      return;
    }

    res.json({ success: true, data: audit });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const findKeywords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { topic, competitors } = req.body;

    const keywords = await SEOService.findKeywords(topic, competitors);

    res.json({ success: true, data: keywords });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
