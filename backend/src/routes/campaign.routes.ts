import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  generateCampaignCreative,
  deployCampaign,
  getCampaignAnalytics,
  optimizeCampaign,
} from '../controllers/campaign.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Campaign CRUD
router.post('/create', createCampaign);
router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);

// AI-powered features
router.post('/:id/generate-creative', generateCampaignCreative);
router.post('/:id/deploy', deployCampaign);
router.get('/:id/analytics', getCampaignAnalytics);
router.post('/:id/optimize', optimizeCampaign);

export default router;
