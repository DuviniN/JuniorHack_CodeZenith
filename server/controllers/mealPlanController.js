import MealPlan from '../models/MealPlan.js';
import DiseaseRestriction from '../models/DiseaseRestriction.js';
import User from '../models/User.js';

export const getMealPlansByDisease = async (req, res) => {
  try {
    const { disease } = req.params;
    const mealPlans = await MealPlan.find({ disease }).sort({ createdAt: -1 });
    res.json({ mealPlans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMealPlansByGoal = async (req, res) => {
  try {
    const { goal } = req.params;
    const mealPlans = await MealPlan.find({ goal }).sort({ createdAt: -1 });
    res.json({ mealPlans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMealPlans = async (_req, res) => {
  try {
    const mealPlans = await MealPlan.find().sort({ createdAt: -1 });
    res.json({ mealPlans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMealPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const mealPlan = await MealPlan.findById(id).populate('meals.foods.foodId');
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.json({ mealPlan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPersonalizedMealPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userGoal = user.onboarding?.goal || 'maintenance';
    let disease = 'none';

    // Map goal to disease if applicable
    if (userGoal === 'diabetes') {
      disease = 'diabetes';
    }

    // Find meal plans matching user's goal and disease
    const mealPlans = await MealPlan.find({
      $or: [
        { goal: userGoal },
        { disease: disease !== 'none' ? disease : { $ne: null } }
      ]
    }).limit(5).sort({ createdAt: -1 });

    res.json({ mealPlans, userGoal, disease });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDiseaseRestrictions = async (req, res) => {
  try {
    const { disease } = req.params;
    const restriction = await DiseaseRestriction.findOne({ disease });
    if (!restriction) {
      return res.status(404).json({ message: 'Disease restrictions not found' });
    }
    res.json({ restriction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllDiseaseRestrictions = async (_req, res) => {
  try {
    const restrictions = await DiseaseRestriction.find().sort({ disease: 1 });
    res.json({ restrictions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

