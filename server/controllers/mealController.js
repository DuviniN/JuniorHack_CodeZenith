import MealLog from '../models/MealLog.js';
import Food from '../models/Food.js';

export const logMeal = async (req, res) => {
  const { mealType, items = [], notes } = req.body;

  if (!mealType || !items.length) {
    return res
      .status(400)
      .json({ message: 'Meal type and at least one food are required' });
  }

  const foodIds = items.map((item) => item.foodId);
  const foods = await Food.find({ _id: { $in: foodIds } });

  const foodMap = foods.reduce((acc, food) => {
    acc[food._id.toString()] = food;
    return acc;
  }, {});

  const foodsWithMacros = items.map((item) => {
    const source = foodMap[item.foodId];
    const portion = item.portionCount || 1;
    if (!source) {
      return {
        foodName: item.customName || 'Custom item',
        portionCount: portion,
        calories: item.calories || 0,
        protein: item.protein || 0,
        carbs: item.carbs || 0,
        fat: item.fat || 0
      };
    }

    return {
      food: source._id,
      foodName: source.name,
      portionCount: portion,
      calories: source.calories * portion,
      protein: source.protein * portion,
      carbs: source.carbs * portion,
      fat: source.fat * portion
    };
  });

  const totals = foodsWithMacros.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.carbs += item.carbs;
      acc.fat += item.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const mealLog = await MealLog.create({
    user: req.user._id,
    mealType,
    foods: foodsWithMacros,
    totalCalories: Math.round(totals.calories),
    totalProtein: Math.round(totals.protein * 10) / 10,
    totalCarbs: Math.round(totals.carbs * 10) / 10,
    totalFat: Math.round(totals.fat * 10) / 10,
    swapsAccepted: req.body.swapsAccepted || 0,
    notes
  });

  res.status(201).json({ meal: mealLog });
};

export const listMeals = async (req, res) => {
  const meals = await MealLog.find({ user: req.user._id })
    .sort({ loggedAt: -1 })
    .limit(20);
  res.json({ meals });
};

