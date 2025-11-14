import Food from '../models/Food.js';
import Advisor from '../models/Advisor.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const listPendingFoods = async (_req, res) => {
  const foods = await Food.find({ status: 'pending' });
  res.json({ foods });
};

export const approveFood = async (req, res) => {
  const { id } = req.params;
  const food = await Food.findByIdAndUpdate(
    id,
    { status: 'approved' },
    { new: true }
  );
  if (!food) return res.status(404).json({ message: 'Food not found' });
  res.json({ food });
};

export const createAdvisor = async (req, res) => {
  const advisor = await Advisor.create(req.body);
  res.status(201).json({ advisor });
};

export const getAdminKpis = async (_req, res) => {
  const [pendingFoods, advisorCount, appointmentCount, userCount] =
    await Promise.all([
      Food.countDocuments({ status: 'pending' }),
      Advisor.countDocuments(),
      Appointment.countDocuments(),
      User.countDocuments()
    ]);

  res.json({
    pendingFoods,
    advisorCount,
    appointmentCount,
    userCount
  });
};

export const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const admin = await User.create({
    name,
    email,
    password,
    role: 'admin'
  });

  const token = generateToken(admin._id);
  const { password: _, ...safeAdmin } = admin.toObject({ versionKey: false });

  res.status(201).json({ user: safeAdmin, token });
};

