import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MealPlan from '../models/MealPlan.js';
import DiseaseRestriction from '../models/DiseaseRestriction.js';
import connectDB from '../config/db.js';

dotenv.config();

const mealPlans = [
  {
    name: 'Diabetes-Friendly Daily Plan',
    disease: 'diabetes',
    goal: 'diabetes',
    dailyCalories: 1800,
    description: 'A balanced meal plan designed to help manage blood sugar levels with low glycemic index foods.',
    meals: [
      {
        mealType: 'breakfast',
        description: 'Start your day with fiber-rich options',
        foods: [
          { foodName: 'Kurakkan roti (1 piece)', portionCount: 1, calories: 120, notes: 'Whole grain, low GI' },
          { foodName: 'Dhal curry (1/2 cup)', portionCount: 1, calories: 150, notes: 'High protein, high fiber' },
          { foodName: 'Gotukola sambol (1/4 cup)', portionCount: 1, calories: 30, notes: 'Rich in antioxidants' }
        ],
        totalCalories: 300
      },
      {
        mealType: 'lunch',
        description: 'Balanced meal with lean protein and vegetables',
        foods: [
          { foodName: 'Red rice (1 cup)', portionCount: 1, calories: 220, notes: 'Lower GI than white rice' },
          { foodName: 'Grilled fish (100g)', portionCount: 1, calories: 200, notes: 'Lean protein' },
          { foodName: 'Mallung (1/2 cup)', portionCount: 1, calories: 50, notes: 'High fiber greens' },
          { foodName: 'Cucumber salad', portionCount: 1, calories: 20, notes: 'Hydrating and low calorie' }
        ],
        totalCalories: 490
      },
      {
        mealType: 'dinner',
        description: 'Light dinner to prevent blood sugar spikes',
        foods: [
          { foodName: 'Kurakkan roti (1 piece)', portionCount: 1, calories: 120, notes: 'Whole grain' },
          { foodName: 'Dhal curry (1/2 cup)', portionCount: 1, calories: 150, notes: 'Plant protein' },
          { foodName: 'Gotukola mallung (1/2 cup)', portionCount: 1, calories: 40, notes: 'Nutrient-dense greens' }
        ],
        totalCalories: 310
      },
      {
        mealType: 'snack',
        description: 'Healthy snack options',
        foods: [
          { foodName: 'Green tea', portionCount: 1, calories: 2, notes: 'Antioxidant-rich' },
          { foodName: 'Handful of roasted chickpeas', portionCount: 1, calories: 150, notes: 'High protein, low GI' }
        ],
        totalCalories: 152
      }
    ],
    foodsToAvoid: ['White rice (large portions)', 'Sugar-sweetened beverages', 'Fried foods', 'Sweets and desserts'],
    dietaryRestrictions: ['Low glycemic index', 'High fiber', 'Moderate protein', 'Low sugar'],
    tips: [
      'Eat smaller, frequent meals (5-6 times a day)',
      'Choose whole grains over refined grains',
      'Include protein with every meal',
      'Monitor portion sizes carefully',
      'Stay hydrated with water or herbal tea'
    ]
  },
  {
    name: 'Hypertension Control Plan',
    disease: 'hypertension',
    goal: 'maintenance',
    dailyCalories: 2000,
    description: 'Low-sodium meal plan to help manage blood pressure with heart-healthy Sri Lankan foods.',
    meals: [
      {
        mealType: 'breakfast',
        description: 'Low-sodium breakfast',
        foods: [
          { foodName: 'Oats porridge (1 cup)', portionCount: 1, calories: 150, notes: 'Low sodium, high fiber' },
          { foodName: 'Fresh fruits (banana/apple)', portionCount: 1, calories: 100, notes: 'Potassium-rich' }
        ],
        totalCalories: 250
      },
      {
        mealType: 'lunch',
        description: 'Balanced low-sodium lunch',
        foods: [
          { foodName: 'Red rice (1 cup)', portionCount: 1, calories: 220, notes: 'Whole grain' },
          { foodName: 'Steamed fish (100g)', portionCount: 1, calories: 200, notes: 'Omega-3 rich' },
          { foodName: 'Steamed vegetables (mixed)', portionCount: 1, calories: 80, notes: 'No added salt' },
          { foodName: 'Fresh lime juice', portionCount: 1, calories: 30, notes: 'Vitamin C' }
        ],
        totalCalories: 530
      },
      {
        mealType: 'dinner',
        description: 'Light dinner',
        foods: [
          { foodName: 'Kurakkan roti (1 piece)', portionCount: 1, calories: 120, notes: 'Whole grain' },
          { foodName: 'Dhal curry (low salt) (1/2 cup)', portionCount: 1, calories: 150, notes: 'Plant protein' },
          { foodName: 'Gotukola mallung (1/2 cup)', portionCount: 1, calories: 40, notes: 'Potassium-rich' }
        ],
        totalCalories: 310
      }
    ],
    foodsToAvoid: ['Processed foods', 'Pickles and achcharu', 'Salted fish', 'Coconut sambol (high salt)', 'Instant noodles'],
    dietaryRestrictions: ['Low sodium', 'High potassium', 'Heart-healthy fats', 'Moderate calories'],
    tips: [
      'Limit salt intake to less than 2g per day',
      'Use herbs and spices instead of salt',
      'Choose fresh foods over processed',
      'Include potassium-rich foods (bananas, leafy greens)',
      'Stay hydrated with water'
    ]
  },
  {
    name: 'Weight Loss Plan',
    disease: 'obesity',
    goal: 'weight-loss',
    dailyCalories: 1500,
    description: 'Calorie-controlled meal plan for sustainable weight loss with Sri Lankan favorites.',
    meals: [
      {
        mealType: 'breakfast',
        description: 'High-protein breakfast',
        foods: [
          { foodName: 'Kurakkan roti (1 piece)', portionCount: 1, calories: 120, notes: 'Whole grain, filling' },
          { foodName: 'Dhal curry (1/2 cup)', portionCount: 1, calories: 150, notes: 'High protein' },
          { foodName: 'Green tea', portionCount: 1, calories: 2, notes: 'Metabolism booster' }
        ],
        totalCalories: 272
      },
      {
        mealType: 'lunch',
        description: 'Balanced, portion-controlled lunch',
        foods: [
          { foodName: 'Red rice (1/2 cup)', portionCount: 1, calories: 110, notes: 'Smaller portion' },
          { foodName: 'Grilled chicken (80g)', portionCount: 1, calories: 180, notes: 'Lean protein' },
          { foodName: 'Mallung (1 cup)', portionCount: 1, calories: 50, notes: 'Low calorie, high fiber' },
          { foodName: 'Cucumber salad', portionCount: 1, calories: 20, notes: 'Hydrating' }
        ],
        totalCalories: 360
      },
      {
        mealType: 'dinner',
        description: 'Light dinner',
        foods: [
          { foodName: 'Steamed vegetables (mixed) (1 cup)', portionCount: 1, calories: 80, notes: 'Low calorie' },
          { foodName: 'Boiled egg (1)', portionCount: 1, calories: 70, notes: 'Protein' },
          { foodName: 'Gotukola sambol (1/4 cup)', portionCount: 1, calories: 30, notes: 'Nutrient-dense' }
        ],
        totalCalories: 180
      },
      {
        mealType: 'snack',
        description: 'Healthy snacks',
        foods: [
          { foodName: 'Fresh fruits (apple/guava)', portionCount: 1, calories: 80, notes: 'Fiber-rich' },
          { foodName: 'Green tea', portionCount: 1, calories: 2, notes: 'Antioxidants' }
        ],
        totalCalories: 82
      }
    ],
    foodsToAvoid: ['Fried foods', 'Sweets and desserts', 'Large portions of rice', 'Coconut milk curries (frequent)', 'Sugar-sweetened drinks'],
    dietaryRestrictions: ['Calorie-controlled', 'High protein', 'High fiber', 'Low fat'],
    tips: [
      'Eat slowly and mindfully',
      'Drink water before meals',
      'Include protein in every meal',
      'Choose whole grains',
      'Practice portion control',
      'Stay active daily'
    ]
  },
  {
    name: 'Student Fuel Plan',
    disease: 'none',
    goal: 'student',
    dailyCalories: 2200,
    description: 'Energy-packed meal plan for active students with budget-friendly Sri Lankan options.',
    meals: [
      {
        mealType: 'breakfast',
        description: 'Energizing breakfast',
        foods: [
          { foodName: 'Hoppers (2)', portionCount: 2, calories: 200, notes: 'Quick energy' },
          { foodName: 'Dhal curry (1/2 cup)', portionCount: 1, calories: 150, notes: 'Protein' },
          { foodName: 'Tea with milk', portionCount: 1, calories: 50, notes: 'Caffeine boost' }
        ],
        totalCalories: 400
      },
      {
        mealType: 'lunch',
        description: 'Satisfying lunch',
        foods: [
          { foodName: 'Rice (1 cup)', portionCount: 1, calories: 220, notes: 'Carbohydrates' },
          { foodName: 'Chicken curry (100g)', portionCount: 1, calories: 250, notes: 'Protein' },
          { foodName: 'Vegetable curry (mixed) (1/2 cup)', portionCount: 1, calories: 100, notes: 'Vitamins' },
          { foodName: 'Papadam (1)', portionCount: 1, calories: 50, notes: 'Crunchy side' }
        ],
        totalCalories: 620
      },
      {
        mealType: 'dinner',
        description: 'Balanced dinner',
        foods: [
          { foodName: 'Kottu roti (1 plate)', portionCount: 1, calories: 600, notes: 'Filling and delicious' },
          { foodName: 'Fresh lime juice', portionCount: 1, calories: 30, notes: 'Vitamin C' }
        ],
        totalCalories: 630
      },
      {
        mealType: 'snack',
        description: 'Study snacks',
        foods: [
          { foodName: 'Roasted peanuts (handful)', portionCount: 1, calories: 200, notes: 'Protein and healthy fats' },
          { foodName: 'Fresh fruits', portionCount: 1, calories: 100, notes: 'Natural sugars' }
        ],
        totalCalories: 300
      }
    ],
    foodsToAvoid: ['Excessive junk food', 'Too much caffeine', 'Skipping meals'],
    dietaryRestrictions: ['Balanced nutrition', 'Energy-dense', 'Budget-friendly'],
    tips: [
      'Don\'t skip breakfast - it fuels your brain',
      'Stay hydrated throughout the day',
      'Include protein for sustained energy',
      'Choose whole foods over processed',
      'Plan meals ahead to save time and money'
    ]
  },
  {
    name: 'Heart-Healthy Daily Plan',
    disease: 'heart-disease',
    goal: 'maintenance',
    dailyCalories: 1900,
    description: 'Heart-healthy meal plan focused on reducing saturated fats and promoting cardiovascular wellness.',
    meals: [
      {
        mealType: 'breakfast',
        description: 'Heart-healthy start',
        foods: [
          { foodName: 'Oats porridge (1 cup)', portionCount: 1, calories: 150, notes: 'High fiber, low cholesterol' },
          { foodName: 'Fresh fruits (banana/apple)', portionCount: 1, calories: 100, notes: 'Antioxidants' },
          { foodName: 'Green tea', portionCount: 1, calories: 2, notes: 'Heart-protective' }
        ],
        totalCalories: 252
      },
      {
        mealType: 'lunch',
        description: 'Balanced heart-healthy lunch',
        foods: [
          { foodName: 'Red rice (1 cup)', portionCount: 1, calories: 220, notes: 'Whole grain' },
          { foodName: 'Grilled fish (100g)', portionCount: 1, calories: 200, notes: 'Omega-3 rich' },
          { foodName: 'Steamed vegetables (mixed) (1 cup)', portionCount: 1, calories: 80, notes: 'Antioxidants' },
          { foodName: 'Dhal curry (1/2 cup)', portionCount: 1, calories: 150, notes: 'Plant protein' }
        ],
        totalCalories: 650
      },
      {
        mealType: 'dinner',
        description: 'Light heart-healthy dinner',
        foods: [
          { foodName: 'Kurakkan roti (1 piece)', portionCount: 1, calories: 120, notes: 'Whole grain' },
          { foodName: 'Steamed chicken (80g)', portionCount: 1, calories: 150, notes: 'Lean protein' },
          { foodName: 'Gotukola mallung (1/2 cup)', portionCount: 1, calories: 40, notes: 'Nutrient-dense' }
        ],
        totalCalories: 310
      },
      {
        mealType: 'snack',
        description: 'Healthy heart snacks',
        foods: [
          { foodName: 'Handful of almonds (10-12)', portionCount: 1, calories: 80, notes: 'Healthy fats' },
          { foodName: 'Fresh fruits', portionCount: 1, calories: 100, notes: 'Antioxidants' }
        ],
        totalCalories: 180
      }
    ],
    foodsToAvoid: ['Fried foods', 'Coconut oil (excessive)', 'Processed meats', 'Full-fat dairy', 'Sweets'],
    dietaryRestrictions: ['Low saturated fat', 'High omega-3', 'High fiber', 'Antioxidant-rich'],
    tips: [
      'Choose lean proteins (fish, chicken)',
      'Include omega-3 rich foods regularly',
      'Limit saturated and trans fats',
      'Eat plenty of fiber-rich foods',
      'Include antioxidant-rich vegetables',
      'Stay physically active',
      'Monitor cholesterol levels'
    ]
  },
  {
    name: 'Kidney-Friendly Daily Plan',
    disease: 'kidney-disease',
    goal: 'maintenance',
    dailyCalories: 1800,
    description: 'Kidney-friendly meal plan with controlled protein, sodium, and potassium intake.',
    meals: [
      {
        mealType: 'breakfast',
        description: 'Low-potassium breakfast',
        foods: [
          { foodName: 'White bread (2 slices)', portionCount: 1, calories: 160, notes: 'Low potassium' },
          { foodName: 'Low-sodium butter (1 tsp)', portionCount: 1, calories: 35, notes: 'Minimal sodium' },
          { foodName: 'Tea (weak)', portionCount: 1, calories: 2, notes: 'Low potassium' }
        ],
        totalCalories: 197
      },
      {
        mealType: 'lunch',
        description: 'Controlled protein lunch',
        foods: [
          { foodName: 'White rice (1 cup)', portionCount: 1, calories: 220, notes: 'Low potassium' },
          { foodName: 'Steamed fish (80g)', portionCount: 1, calories: 160, notes: 'Controlled protein' },
          { foodName: 'Cabbage curry (1/2 cup)', portionCount: 1, calories: 30, notes: 'Low potassium vegetable' },
          { foodName: 'Cucumber salad', portionCount: 1, calories: 20, notes: 'Low potassium' }
        ],
        totalCalories: 430
      },
      {
        mealType: 'dinner',
        description: 'Light kidney-friendly dinner',
        foods: [
          { foodName: 'White rice (1/2 cup)', portionCount: 1, calories: 110, notes: 'Smaller portion' },
          { foodName: 'Steamed chicken (60g)', portionCount: 1, calories: 120, notes: 'Controlled protein' },
          { foodName: 'Steamed cabbage (1/2 cup)', portionCount: 1, calories: 15, notes: 'Low potassium' }
        ],
        totalCalories: 245
      },
      {
        mealType: 'snack',
        description: 'Kidney-safe snacks',
        foods: [
          { foodName: 'Apple (1 small)', portionCount: 1, calories: 80, notes: 'Low potassium fruit' },
          { foodName: 'White bread (1 slice)', portionCount: 1, calories: 80, notes: 'Low potassium' }
        ],
        totalCalories: 160
      }
    ],
    foodsToAvoid: ['High-sodium foods', 'Bananas and oranges', 'Dark colas', 'Processed foods', 'Dairy (excessive)', 'Nuts (excessive)'],
    dietaryRestrictions: ['Low sodium', 'Controlled protein', 'Low potassium', 'Low phosphorus'],
    tips: [
      'Limit sodium intake strictly',
      'Control protein portions (consult doctor)',
      'Avoid high-potassium foods',
      'Limit phosphorus-rich foods',
      'Stay hydrated as advised by doctor',
      'Choose fresh, unprocessed foods',
      'Work closely with a renal dietitian'
    ]
  }
];

const diseaseRestrictions = [
  {
    disease: 'diabetes',
    diseaseName: 'Diabetes',
    description: 'Dietary guidelines for managing Type 2 Diabetes with Sri Lankan foods.',
    foodsToAvoid: [
      { foodName: 'White rice (large portions)', reason: 'High glycemic index causes rapid blood sugar spikes', severity: 'high' },
      { foodName: 'Sugar-sweetened beverages', reason: 'Rapid blood sugar spike, empty calories', severity: 'high' },
      { foodName: 'Sweets and desserts (kavum, kokis)', reason: 'High sugar content', severity: 'high' },
      { foodName: 'Fried foods (fried rice, fried hoppers)', reason: 'High in unhealthy fats and calories', severity: 'moderate' },
      { foodName: 'Coconut sambol (excessive)', reason: 'High in saturated fats', severity: 'moderate' },
      { foodName: 'Processed foods', reason: 'Often high in sugar and sodium', severity: 'moderate' }
    ],
    recommendedFoods: [
      'Red rice',
      'Kurakkan roti',
      'Dhal curry',
      'Gotukola',
      'Mallung (various greens)',
      'Grilled fish',
      'Steamed vegetables',
      'Green tea'
    ],
    dailyCalorieRange: { min: 1500, max: 2000 },
    macronutrientGuidelines: {
      carbs: { min: 45, max: 60 },
      protein: { min: 15, max: 20 },
      fat: { min: 25, max: 35 }
    },
    tips: [
      'Eat smaller, frequent meals (5-6 times a day)',
      'Choose low glycemic index foods',
      'Include fiber-rich vegetables with every meal',
      'Monitor portion sizes carefully',
      'Limit processed and packaged foods',
      'Stay hydrated with water or herbal tea',
      'Regular physical activity is essential'
    ],
    generalGuidelines: [
      'Aim for consistent meal times',
      'Pair carbohydrates with protein or fat',
      'Read food labels for hidden sugars',
      'Choose whole grains over refined grains',
      'Include lean proteins in every meal'
    ]
  },
  {
    disease: 'hypertension',
    diseaseName: 'Hypertension (High Blood Pressure)',
    description: 'Low-sodium dietary guidelines to help manage blood pressure.',
    foodsToAvoid: [
      { foodName: 'Pickles and achcharu', reason: 'Very high in sodium', severity: 'high' },
      { foodName: 'Salted fish (karawala, dried fish)', reason: 'Extremely high sodium content', severity: 'high' },
      { foodName: 'Processed meats (sausages, ham)', reason: 'High sodium preservatives', severity: 'high' },
      { foodName: 'Instant noodles and packaged foods', reason: 'High sodium content', severity: 'high' },
      { foodName: 'Coconut sambol (with salt)', reason: 'High sodium when salted', severity: 'moderate' },
      { foodName: 'Canned foods', reason: 'High sodium preservatives', severity: 'moderate' }
    ],
    recommendedFoods: [
      'Fresh vegetables (steamed or raw)',
      'Fresh fruits (bananas, oranges)',
      'Lean proteins (fish, chicken)',
      'Whole grains',
      'Low-fat dairy',
      'Herbs and spices (instead of salt)',
      'Potassium-rich foods'
    ],
    dailyCalorieRange: { min: 1800, max: 2200 },
    macronutrientGuidelines: {
      carbs: { min: 50, max: 60 },
      protein: { min: 15, max: 20 },
      fat: { min: 25, max: 30 }
    },
    tips: [
      'Limit salt intake to less than 2g (1/2 teaspoon) per day',
      'Use herbs, spices, and lemon instead of salt',
      'Choose fresh foods over processed',
      'Include potassium-rich foods (bananas, leafy greens, sweet potatoes)',
      'Read food labels for sodium content',
      'Stay hydrated with water',
      'Limit alcohol consumption'
    ],
    generalGuidelines: [
      'Cook at home to control salt',
      'Rinse canned foods to reduce sodium',
      'Avoid adding salt at the table',
      'Choose low-sodium alternatives',
      'Include DASH diet principles'
    ]
  },
  {
    disease: 'heart-disease',
    diseaseName: 'Heart Disease',
    description: 'Heart-healthy dietary guidelines to support cardiovascular health.',
    foodsToAvoid: [
      { foodName: 'Fried foods (fried rice, fried hoppers)', reason: 'High in trans and saturated fats', severity: 'high' },
      { foodName: 'Coconut oil (excessive)', reason: 'High in saturated fats', severity: 'high' },
      { foodName: 'Processed meats', reason: 'High in saturated fats and sodium', severity: 'high' },
      { foodName: 'Sweets and desserts', reason: 'High in sugar and unhealthy fats', severity: 'moderate' },
      { foodName: 'Full-fat dairy products', reason: 'High in saturated fats', severity: 'moderate' },
      { foodName: 'Red meat (frequent consumption)', reason: 'High in saturated fats', severity: 'moderate' }
    ],
    recommendedFoods: [
      'Fatty fish (salmon, mackerel)',
      'Whole grains',
      'Leafy green vegetables',
      'Nuts and seeds (in moderation)',
      'Olive oil (in moderation)',
      'Fresh fruits',
      'Legumes (dhal, chickpeas)'
    ],
    dailyCalorieRange: { min: 1800, max: 2200 },
    macronutrientGuidelines: {
      carbs: { min: 50, max: 60 },
      protein: { min: 15, max: 20 },
      fat: { min: 25, max: 30 }
    },
    tips: [
      'Choose lean proteins (fish, chicken, legumes)',
      'Include omega-3 rich foods',
      'Limit saturated and trans fats',
      'Eat plenty of fiber-rich foods',
      'Choose whole grains',
      'Include antioxidant-rich foods',
      'Maintain a healthy weight'
    ],
    generalGuidelines: [
      'Follow Mediterranean-style eating',
      'Include fish 2-3 times per week',
      'Choose plant-based proteins often',
      'Limit processed foods',
      'Stay physically active'
    ]
  },
  {
    disease: 'obesity',
    diseaseName: 'Obesity / Weight Management',
    description: 'Calorie-controlled dietary guidelines for healthy weight loss and management.',
    foodsToAvoid: [
      { foodName: 'Fried foods', reason: 'Very high in calories and unhealthy fats', severity: 'high' },
      { foodName: 'Sweets and desserts', reason: 'High in sugar and calories', severity: 'high' },
      { foodName: 'Sugar-sweetened beverages', reason: 'Empty calories, no nutritional value', severity: 'high' },
      { foodName: 'Large portions of rice', reason: 'High in calories, easy to overeat', severity: 'moderate' },
      { foodName: 'Coconut milk curries (frequent)', reason: 'High in calories and saturated fats', severity: 'moderate' },
      { foodName: 'Processed snacks', reason: 'High in calories, low in nutrients', severity: 'moderate' }
    ],
    recommendedFoods: [
      'Steamed vegetables',
      'Grilled or baked proteins',
      'Whole grains (in controlled portions)',
      'Fresh fruits',
      'Leafy greens',
      'Legumes',
      'Low-fat dairy'
    ],
    dailyCalorieRange: { min: 1200, max: 1800 },
    macronutrientGuidelines: {
      carbs: { min: 40, max: 50 },
      protein: { min: 20, max: 30 },
      fat: { min: 25, max: 35 }
    },
    tips: [
      'Practice portion control',
      'Eat slowly and mindfully',
      'Include protein in every meal',
      'Choose whole, unprocessed foods',
      'Stay hydrated with water',
      'Plan meals ahead',
      'Regular physical activity is essential'
    ],
    generalGuidelines: [
      'Create a calorie deficit through diet and exercise',
      'Focus on nutrient-dense foods',
      'Avoid emotional eating',
      'Get adequate sleep',
      'Track your food intake'
    ]
  },
  {
    disease: 'kidney-disease',
    diseaseName: 'Kidney Disease',
    description: 'Dietary guidelines for managing kidney health and reducing kidney workload.',
    foodsToAvoid: [
      { foodName: 'High-sodium foods', reason: 'Increases blood pressure and fluid retention', severity: 'high' },
      { foodName: 'Processed foods', reason: 'High in sodium and phosphorus', severity: 'high' },
      { foodName: 'Dark colas and sodas', reason: 'High in phosphorus', severity: 'high' },
      { foodName: 'Bananas and oranges (excessive)', reason: 'High in potassium', severity: 'moderate' },
      { foodName: 'Dairy products (excessive)', reason: 'High in phosphorus and potassium', severity: 'moderate' },
      { foodName: 'Nuts and seeds (excessive)', reason: 'High in phosphorus', severity: 'moderate' }
    ],
    recommendedFoods: [
      'Low-potassium vegetables (cabbage, cucumber)',
      'Low-phosphorus proteins (fish, chicken)',
      'White rice (in moderation)',
      'Apples and berries',
      'Herbs and spices (instead of salt)'
    ],
    dailyCalorieRange: { min: 1500, max: 2000 },
    macronutrientGuidelines: {
      carbs: { min: 50, max: 60 },
      protein: { min: 0.8, max: 1.0 },
      fat: { min: 25, max: 35 }
    },
    tips: [
      'Limit sodium intake',
      'Control protein intake (consult doctor)',
      'Monitor potassium levels',
      'Limit phosphorus-rich foods',
      'Stay hydrated (as advised by doctor)',
      'Choose fresh, unprocessed foods',
      'Work with a renal dietitian'
    ],
    generalGuidelines: [
      'Follow your doctor\'s specific recommendations',
      'Monitor blood pressure regularly',
      'Control blood sugar if diabetic',
      'Limit processed foods',
      'Read food labels carefully'
    ]
  }
];

const seedMealPlans = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await MealPlan.deleteMany({});
    await DiseaseRestriction.deleteMany({});
    
    // Insert meal plans
    const insertedPlans = await MealPlan.insertMany(mealPlans);
    console.log(`✅ Inserted ${insertedPlans.length} meal plans`);
    
    // Insert disease restrictions
    const insertedRestrictions = await DiseaseRestriction.insertMany(diseaseRestrictions);
    console.log(`✅ Inserted ${insertedRestrictions.length} disease restrictions`);
    
    console.log('✅ Meal plans and restrictions seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding meal plans:', error);
    process.exit(1);
  }
};

seedMealPlans();

