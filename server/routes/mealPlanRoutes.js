import { Router } from 'express';
import {
  getMealPlansByDisease,
  getMealPlansByGoal,
  getAllMealPlans,
  getMealPlanById,
  getPersonalizedMealPlan,
  getDiseaseRestrictions,
  getAllDiseaseRestrictions
} from '../controllers/mealPlanController.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes - specific routes must come before generic ones
router.get('/restrictions', getAllDiseaseRestrictions);
router.get('/restrictions/:disease', getDiseaseRestrictions);
router.get('/disease/:disease', getMealPlansByDisease);
router.get('/goal/:goal', getMealPlansByGoal);
router.get('/personalized', authRequired, getPersonalizedMealPlan);
router.get('/:id', getMealPlanById);
router.get('/', getAllMealPlans);


export default router;

