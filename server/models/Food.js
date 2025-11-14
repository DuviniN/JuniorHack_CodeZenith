import mongoose from 'mongoose';

const swapSchema = new mongoose.Schema(
  {
    title: String,
    description: String
  },
  { _id: false }
);

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    category: String,
    portionGrams: { type: Number, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    sugar: Number,
    fiber: Number,
    rating: {
      type: String,
      enum: ['good', 'moderate', 'high-risk'],
      default: 'good'
    },
    status: {
      type: String,
      enum: ['approved', 'pending'],
      default: 'approved'
    },
    swaps: [swapSchema],
    smartTip: String,
    tags: [String],
    culturalContext: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Food = mongoose.model('Food', foodSchema);

export default Food;

