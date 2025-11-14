import { Router } from 'express';
import {
  listAdvisors,
  bookAppointment,
  listAppointments,
  getAppointment,
  listHealthyShops
} from '../controllers/advisorController.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listAdvisors);
router.get('/shops', listHealthyShops);
router.post('/appointments', authRequired, bookAppointment);
router.get('/appointments', authRequired, listAppointments);
router.get('/appointments/:id', authRequired, getAppointment);

export default router;

