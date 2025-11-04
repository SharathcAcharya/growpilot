import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  generateContent,
  getContent,
  getContentById,
  updateContent,
  deleteContent,
  publishContent,
} from '../controllers/content.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/generate', generateContent);
router.get('/', getContent);
router.get('/:id', getContentById);
router.put('/:id', updateContent);
router.delete('/:id', deleteContent);
router.post('/:id/publish', publishContent);

export default router;
