import { Router } from 'express';
import * as agencyController from '../controllers/agency.controller';
import authenticate from '@/middlewares/authenticate';

const router = Router();

router.post('/', authenticate, agencyController.createAgency);
router.get('/me', authenticate, agencyController.getMyAgency);
router.patch('/me', authenticate, agencyController.updateMyAgency);

export default router;
