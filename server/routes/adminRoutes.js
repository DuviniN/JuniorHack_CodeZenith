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
  deleteUser,
  listAllAppointments,
  createShop,
  listAllShops,
  updateShop,
  deleteShop
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
router.delete('/users/:id', deleteUser);
router.get('/appointments', listAllAppointments);
router.get('/kpis', getAdminKpis);
router.post('/shops', createShop);
router.get('/shops', listAllShops);
router.put('/shops/:id', updateShop);
router.delete('/shops/:id', deleteShop);

export default router;

