import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Content from '../models/Content';
import User from '../models/User';
import { AIService } from '../services/ai.service';

export const generateContent = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { type, topic, keywords, tone, length, brandId, platform } = req.body;

    const result = await AIService.generateContent({
      type,
      topic,
      keywords,
      tone,
      length,
    });

    if (!result.success) {
      res.status(500).json({ success: false, message: 'Failed to generate content' });
      return;
    }

    const content = new Content({
      userId: user._id,
      brandId,
      type,
      platform,
      title: topic,
      content: result.content || '',
      metadata: {
        wordCount: (result.content || '').split(/\s+/).length,
        readingTime: Math.ceil((result.content || '').split(/\s+/).length / 200),
        tone,
        keywords,
      },
      aiGenerated: {
        isAI: true,
        prompt: topic,
        model: 'gpt-4o',
        tokensUsed: result.tokensUsed,
      },
    });

    await content.save();

    await User.updateOne({ uid: userId }, { $inc: { 'usage.contentGenerated': 1 } });

    res.status(201).json({ success: true, data: content });
  } catch (error: any) {
    console.error('Generate Content Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getContent = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { type, status, limit = 20, skip = 0 } = req.query;
    const filter: any = { userId: user._id };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const content = await Content.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Content.countDocuments(filter);

    res.json({ success: true, data: content, pagination: { total, limit: Number(limit), skip: Number(skip) } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getContentById = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const content = await Content.findOne({ _id: id, userId: user._id });
    if (!content) {
      res.status(404).json({ success: false, message: 'Content not found' });
      return;
    }

    res.json({ success: true, data: content });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContent = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const content = await Content.findOne({ _id: id, userId: user._id });
    if (!content) {
      res.status(404).json({ success: false, message: 'Content not found' });
      return;
    }

    // Save version history
    if (req.body.content && req.body.content !== content.content) {
      content.versions.push({
        content: content.content,
        timestamp: new Date(),
        editedBy: userId,
      });
    }

    Object.assign(content, req.body);
    await content.save();

    res.json({ success: true, data: content });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContent = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const content = await Content.findOneAndDelete({ _id: id, userId: user._id });
    if (!content) {
      res.status(404).json({ success: false, message: 'Content not found' });
      return;
    }

    res.json({ success: true, message: 'Content deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const publishContent = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const content = await Content.findOne({ _id: id, userId: user._id });
    if (!content) {
      res.status(404).json({ success: false, message: 'Content not found' });
      return;
    }

    content.status = 'published';
    content.publishedAt = new Date();
    await content.save();

    res.json({ success: true, data: content });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
