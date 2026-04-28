import { Router } from 'express';
import * as agencyController from '../controllers/agency.controller';
import authenticate from '@/middlewares/authenticate';

const router = Router();

router.post('/', authenticate, agencyController.createAgency);
router.get('/', authenticate, agencyController.listMyAgencies);
router.get('/me', authenticate, agencyController.getMyAgency);
router.get('/:id', authenticate, agencyController.getAgencyById);
router.patch('/me', authenticate, agencyController.updateMyAgency);
router.patch('/:id', authenticate, agencyController.updateAgencyById);

export default router;
