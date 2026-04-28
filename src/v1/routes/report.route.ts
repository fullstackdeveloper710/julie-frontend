import { Router } from 'express';
import * as reportController from '../controllers/report.controller';
import authenticate from '@/middlewares/authenticate';

const router = Router();

router.post('/', authenticate, reportController.createReport);
router.post('/ai/generate', authenticate, reportController.generateAIReport);
router.get('/me', authenticate, reportController.getMyReports);
router.patch('/:id', authenticate, reportController.updateReport);
router.delete('/:id', authenticate, reportController.deleteReport);

export default router;
