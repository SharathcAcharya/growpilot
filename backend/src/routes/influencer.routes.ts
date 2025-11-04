import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  searchInfluencers,
  getInfluencers,
  getInfluencerById,
  scoreInfluencer,
  updateCollaborationStatus,
  generateOutreach,
} from '../controllers/influencer.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/search', searchInfluencers);
router.get('/', getInfluencers);
router.get('/:id', getInfluencerById);
router.post('/:id/score', scoreInfluencer);
router.put('/:id/collaboration', updateCollaborationStatus);
router.post('/:id/outreach', generateOutreach);

export default router;
