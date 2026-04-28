import { Router } from 'express';
import * as managerController from '../controllers/manager.controller';
import authenticate from '@/middlewares/authenticate';

const router = Router();

router.post('/', authenticate, managerController.createManager);
router.get('/', authenticate, managerController.listManagers);
router.patch('/:id/status', authenticate, managerController.setManagerStatus);
router.delete('/:id', authenticate, managerController.deleteManager);

export default router;
