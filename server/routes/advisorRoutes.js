import { Router } from 'express';
import {
  listAdvisors,
  bookAppointment,
  listAppointments,
  listHealthyShops
} from '../controllers/advisorController.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listAdvisors);
router.get('/shops', listHealthyShops);
router.post('/appointments', authRequired, bookAppointment);
router.get('/appointments', authRequired, listAppointments);

export default router;

