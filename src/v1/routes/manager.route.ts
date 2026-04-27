import { Router } from 'express';
import * as managerController from '../controllers/manager.controller';
import authenticate from '@/middlewares/authenticate';

const router = Router();

// Create manager (invite)
router.post('/', authenticate, managerController.createManager);

export default router;
