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

