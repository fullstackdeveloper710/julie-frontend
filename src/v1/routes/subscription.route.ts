import { Router } from 'express';
import * as subscriptionController from '../controllers/subscription.controller';
import authenticate from '@/middlewares/authenticate';

const router = Router();

router.get('/me', authenticate, subscriptionController.getMySubscription);
router.get('/customer/:stripeCustomerId', subscriptionController.getSubscriptionByCustomerId);
router.post('/sync', subscriptionController.syncSubscription);
router.post('/initialize', authenticate, subscriptionController.initializeSubscription);
router.post('/cancel', authenticate, subscriptionController.cancelSubscription);
router.post('/create-checkout', authenticate, subscriptionController.createCheckoutSession);
export default router;
