import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateOnboarding
} from '../controllers/authController.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authRequired, getProfile);
router.put('/onboarding', authRequired, updateOnboarding);

export default router;

