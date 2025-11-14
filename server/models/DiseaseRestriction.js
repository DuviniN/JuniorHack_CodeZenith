import mongoose from 'mongoose';

const foodToAvoidSchema = new mongoose.Schema(
  {
    foodName: String,
    reason: String,
    severity: {
      type: String,
      enum: ['high', 'moderate', 'low'],
      default: 'moderate'
    }
  },
  { _id: false }
);

const macronutrientGuidelinesSchema = new mongoose.Schema(
  {
    carbs: { min: Number, max: Number },
    protein: { min: Number, max: Number },
    fat: { min: Number, max: Number }
  },
  { _id: false }
);

const diseaseRestrictionSchema = new mongoose.Schema(
  {
    disease: {
      type: String,
      enum: ['diabetes', 'hypertension', 'heart-disease', 'obesity', 'kidney-disease'],
      required: true,
      unique: true
    },
    diseaseName: String, // Display name
    description: String,
    foodsToAvoid: [foodToAvoidSchema],
    recommendedFoods: [String],
    dailyCalorieRange: {
      min: Number,
      max: Number
    },
    macronutrientGuidelines: macronutrientGuidelinesSchema,
    tips: [String],
    generalGuidelines: [String]
  },
  { timestamps: true }
);

const DiseaseRestriction = mongoose.model('DiseaseRestriction', diseaseRestrictionSchema);

export default DiseaseRestriction;

