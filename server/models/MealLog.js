import mongoose from 'mongoose';

const mealFoodSchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    foodName: String,
    portionCount: { type: Number, default: 1 },
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  { _id: false }
);

const mealLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true
    },
    loggedAt: { type: Date, default: Date.now },
    foods: [mealFoodSchema],
    totalCalories: Number,
    totalProtein: Number,
    totalCarbs: Number,
    totalFat: Number,
    notes: String,
    swapsAccepted: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const MealLog = mongoose.model('MealLog', mealLogSchema);

export default MealLog;

