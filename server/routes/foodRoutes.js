import { Router } from 'express';
import {
  listFoods,
  getFood,
  createFood,
  getSmartTip,
  getSwapIdeas
} from '../controllers/foodController.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listFoods);
router.get('/:id', getFood);
router.get('/:id/tip', getSmartTip);
router.get('/:id/swaps', getSwapIdeas);
router.post('/', authRequired, createFood);

export default router;

