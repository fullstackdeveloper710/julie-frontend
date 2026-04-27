import { Router } from 'express';
import * as monthlyDataController from '../controllers/monthlyData.controller';
import authenticate from '@/middlewares/authenticate';

const router = Router();

router.post('/', authenticate, monthlyDataController.saveMonthlyData);

export default router;
