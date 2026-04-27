import { Router } from 'express';
import * as annualCheckinController from '../controllers/annualCheckin.controller';
import authenticate from '@/middlewares/authenticate';

const router = Router();

router.post('/', authenticate, annualCheckinController.createAnnualCheckin);
router.get('/me', authenticate, annualCheckinController.getMyAnnualCheckins);
router.get('/current', authenticate, annualCheckinController.getCurrentAnnualCheckin);
router.patch('/:id', authenticate, annualCheckinController.updateAnnualCheckin);

export default router;
