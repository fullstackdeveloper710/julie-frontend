import { Router } from 'express';
import authRoutes from './auth.route';
import agencyRoutes from './agency.route';
import managerRoutes from './manager.route';
import reportRoutes from './report.route';
import analyticsRoutes from './analytics.route';
import checkinRoutes from './checkin.route';
import annualCheckinRoutes from './annualCheckin.route';
import subscriptionRoutes from './subscription.route';
import monthlyDataRoutes from './monthlyData.route';
import pricingRoutes from './pricing.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/agencies', agencyRoutes);
router.use('/managers', managerRoutes);
router.use('/reports', reportRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/checkins', checkinRoutes);
router.use('/annual-checkins', annualCheckinRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/monthly-data', monthlyDataRoutes);
router.use('/pricing', pricingRoutes);

export default router;
