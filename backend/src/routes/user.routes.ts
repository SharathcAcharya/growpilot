import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  getCurrentUser,
  updateUser,
  updateSubscription,
  getUsageStats,
} from '../controllers/user.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/me', getCurrentUser);
router.put('/me', updateUser);
router.put('/subscription', updateSubscription);
router.get('/usage', getUsageStats);

export default router;
