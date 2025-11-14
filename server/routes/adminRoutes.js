import { Router } from 'express';
import {
  listPendingFoods,
  approveFood,
  createAdvisor,
  getAdminKpis,
  createAdmin
} from '../controllers/adminController.js';
import { adminOnly, authRequired } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authRequired, adminOnly);

router.get('/foods/pending', listPendingFoods);
router.post('/foods/:id/approve', approveFood);
router.post('/advisors', createAdvisor);
router.post('/admins', createAdmin);
router.get('/kpis', getAdminKpis);

export default router;

