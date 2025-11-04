import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AIService } from '../services/ai.service';

// Chat with AI Copilot
export const chatCopilot = async (req: AuthRequest, res: Response) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const response = await AIService.chatCopilot(
      message,
      conversationHistory || []
    );

    res.status(200).json({
      success: true,
      data: {
        response,
      },
    });
  } catch (error: any) {
    console.error('Chat copilot error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to chat with AI copilot',
    });
  }
};
