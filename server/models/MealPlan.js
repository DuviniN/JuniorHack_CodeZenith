import mongoose from 'mongoose';

const mealItemSchema = new mongoose.Schema(
  {
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    foodName: String,
    portionCount: { type: Number, default: 1 },
    calories: Number,
    notes: String
  },
  { _id: false }
);

const mealSchema = new mongoose.Schema(
  {
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true
    },
    foods: [mealItemSchema],
    totalCalories: Number,
    description: String
  },
  { _id: false }
);

const mealPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    disease: {
      type: String,
      enum: ['diabetes', 'hypertension', 'heart-disease', 'obesity', 'kidney-disease', 'none'],
      default: 'none'
    },
    goal: {
      type: String,
      enum: ['weight-loss', 'maintenance', 'muscle', 'diabetes', 'student'],
      default: 'maintenance'
    },
    dailyCalories: Number,
    meals: [mealSchema],
    foodsToAvoid: [String],
    dietaryRestrictions: [String],
    tips: [String],
    description: String
  },
  { timestamps: true }
);

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

export default MealPlan;

