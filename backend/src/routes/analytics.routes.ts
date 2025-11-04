import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  getDashboardOverview,
  getPerformanceMetrics,
} from '../controllers/analytics.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/dashboard', getDashboardOverview);
router.get('/performance', getPerformanceMetrics);

export default router;
