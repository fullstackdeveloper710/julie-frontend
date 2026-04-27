import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import authenticate from '@/middlewares/authenticate';

const router = Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/verify', authController.verifyEmail);
router.get('/me', authenticate, authController.getMe);

export default router;
