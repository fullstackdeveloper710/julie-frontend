import { Router } from 'express';
import * as managerController from '../controllers/manager.controller';
import authenticate from '@/middlewares/authenticate';

const router = Router();

router.post('/', authenticate, managerController.createManager);
router.get('/', authenticate, managerController.listManagers);
router.patch('/:id/status', authenticate, managerController.setManagerStatus);
router.post('/:id/resend-invite', authenticate, managerController.resendManagerInvite);
router.patch('/:id/agency', authenticate, managerController.assignManagerAgency);
router.delete('/:id', authenticate, managerController.deleteManager);

export default router;
