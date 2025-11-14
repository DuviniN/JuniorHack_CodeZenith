import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const onboardingSchema = new mongoose.Schema(
  {
    age: Number,
    weightKg: Number,
    heightCm: Number,
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active'],
      default: 'light'
    },
    goal: {
      type: String,
      enum: ['weight-loss', 'maintenance', 'muscle', 'diabetes', 'student'],
      default: 'maintenance'
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    onboarding: onboardingSchema,
    onboardingCompleted: { type: Boolean, default: false },
    preferences: {
      dislikes: [String],
      allergies: [String]
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hook(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

