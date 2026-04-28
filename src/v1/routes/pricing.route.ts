import { Router } from 'express';
import * as pricingController from '../controllers/pricing.controller';

const router = Router();

router.get('/', pricingController.getPricingPlans);

export default router;