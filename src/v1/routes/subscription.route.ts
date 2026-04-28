import { Router } from 'express';
import * as subscriptionController from '../controllers/subscription.controller';
import authenticate from '@/middlewares/authenticate';

const router = Router();

router.get('/me', authenticate, subscriptionController.getMySubscription);
router.get('/customer/:stripeCustomerId', subscriptionController.getSubscriptionByCustomerId);
router.post('/sync', subscriptionController.syncSubscription);

export default router;
