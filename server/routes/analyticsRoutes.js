import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import { getWeeklyAnalytics } from '../controllers/analyticsController.js';

const router = Router();

router.get('/weekly', authRequired, getWeeklyAnalytics);

export default router;

