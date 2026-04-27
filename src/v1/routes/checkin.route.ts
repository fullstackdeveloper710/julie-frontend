import { Router } from 'express';
import * as checkinController from '../controllers/checkin.controller';
import authenticate from '@/middlewares/authenticate';

const router = Router();

router.post('/', authenticate, checkinController.createCheckin);
router.get('/me', authenticate, checkinController.getMyCheckins);
router.patch('/:id', authenticate, checkinController.updateCheckin);

export default router;
