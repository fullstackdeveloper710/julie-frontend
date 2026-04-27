import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import authenticate from '@/middlewares/authenticate';

const router = Router();

router.post('/', authenticate, analyticsController.addAnalyticsData);
router.get('/me', authenticate, analyticsController.getMyAnalytics);

export default router;
