import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  auditWebsite,
  getAudits,
  getAuditById,
  findKeywords,
} from '../controllers/seo.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/audit', auditWebsite);
router.get('/audits', getAudits);
router.get('/audits/:id', getAuditById);
router.post('/keywords', findKeywords);

export default router;
