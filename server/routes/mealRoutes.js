import { Router } from 'express';
import { authRequired } from '../middleware/authMiddleware.js';
import { logMeal, listMeals } from '../controllers/mealController.js';

const router = Router();

router.use(authRequired);
router.post('/', logMeal);
router.get('/', listMeals);

export default router;

