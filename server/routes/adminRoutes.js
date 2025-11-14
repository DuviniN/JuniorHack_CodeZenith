import { Router } from 'express';
import {
  listPendingFoods,
  listApprovedFoods,
  approveFood,
  createAdvisor,
  listAllAdvisors,
  updateAdvisor,
  deleteAdvisor,
  getAdminKpis,
  createAdmin,
  listAdmins,
  updateAdmin,
  deleteAdmin,
  listAllUsers,
  listAllAppointments
} from '../controllers/adminController.js';
import { adminOnly, authRequired } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authRequired, adminOnly);

router.get('/foods/pending', listPendingFoods);
router.get('/foods/approved', listApprovedFoods);
router.post('/foods/:id/approve', approveFood);
router.post('/advisors', createAdvisor);
router.get('/advisors', listAllAdvisors);
router.put('/advisors/:id', updateAdvisor);
router.delete('/advisors/:id', deleteAdvisor);
router.post('/admins', createAdmin);
router.get('/admins', listAdmins);
router.put('/admins/:id', updateAdmin);
router.delete('/admins/:id', deleteAdmin);
router.get('/users', listAllUsers);
router.get('/appointments', listAllAppointments);
router.get('/kpis', getAdminKpis);

export default router;

