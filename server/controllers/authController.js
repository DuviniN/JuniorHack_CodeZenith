import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const safeUser = (userDoc) => {
  const { password, ...rest } = userDoc.toObject({ versionKey: false });
  return rest;
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  // Registration always creates regular users - admins can only be created by existing admins
  const user = await User.create({
    name,
    email,
    password,
    role: 'user'
  });
  const token = generateToken(user._id);

  res.status(201).json({ user: safeUser(user), token });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);
  res.json({ user: safeUser(user), token });
};

export const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

export const updateOnboarding = async (req, res) => {
  const updates = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { onboarding: updates, onboardingCompleted: true },
    { new: true }
  );

  res.json({ user });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, onboarding, preferences } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      updates.email = email;
    }
    if (onboarding) updates.onboarding = onboarding;
    if (preferences) updates.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');

    res.json({ user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

