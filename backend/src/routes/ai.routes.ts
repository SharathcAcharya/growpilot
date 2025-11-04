import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { chatCopilot } from '../controllers/ai.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// AI Chat Copilot
router.post('/chat', chatCopilot);

export default router;
