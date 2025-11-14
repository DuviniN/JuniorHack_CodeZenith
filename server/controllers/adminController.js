import Food from '../models/Food.js';
import Advisor from '../models/Advisor.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const listPendingFoods = async (_req, res) => {
  const foods = await Food.find({ status: 'pending' });
  res.json({ foods });
};

export const listApprovedFoods = async (_req, res) => {
  const foods = await Food.find({ status: 'approved' }).sort({ createdAt: -1 });
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

export const listAllAdvisors = async (_req, res) => {
  const advisors = await Advisor.find().sort({ createdAt: -1 });
  res.json({ advisors });
};

export const updateAdvisor = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  
  // Handle languages array if it's a string
  if (updateData.languages && typeof updateData.languages === 'string') {
    updateData.languages = updateData.languages.split(',').map((lang) => lang.trim());
  }

  const advisor = await Advisor.findByIdAndUpdate(id, updateData, { new: true });
  if (!advisor) {
    return res.status(404).json({ message: 'Advisor not found' });
  }
  res.json({ advisor });
};

export const deleteAdvisor = async (req, res) => {
  const { id } = req.params;
  const advisor = await Advisor.findByIdAndDelete(id);
  if (!advisor) {
    return res.status(404).json({ message: 'Advisor not found' });
  }
  res.json({ message: 'Advisor deleted successfully' });
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

export const listAllUsers = async (_req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ users });
};

export const listAllAppointments = async (_req, res) => {
  const appointments = await Appointment.find()
    .populate('advisor')
    .populate('user', 'name email')
    .sort({ scheduledFor: -1 });
  res.json({ appointments });
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

export const listAdmins = async (_req, res) => {
  const admins = await User.find({ role: 'admin' }).select('-password');
  res.json({ admins });
};

export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const admin = await User.findById(id);
  if (!admin || admin.role !== 'admin') {
    return res.status(404).json({ message: 'Admin not found' });
  }

  // Check if email is being changed and if it's already in use
  if (email && email !== admin.email) {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    admin.email = email;
  }

  if (name) admin.name = name;
  if (password) admin.password = password; // Will be hashed by pre-save hook

  await admin.save();
  const { password: _, ...safeAdmin } = admin.toObject({ versionKey: false });

  res.json({ admin: safeAdmin });
};

export const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  const admin = await User.findById(id);
  if (!admin || admin.role !== 'admin') {
    return res.status(404).json({ message: 'Admin not found' });
  }

  await User.findByIdAndDelete(id);
  res.json({ message: 'Admin deleted successfully' });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Prevent deleting admins through this endpoint
  if (user.role === 'admin') {
    return res.status(403).json({ message: 'Cannot delete admin users. Use admin delete endpoint instead.' });
  }

  await User.findByIdAndDelete(id);
  res.json({ message: 'User deleted successfully' });
};

// Shop management functions
export const createShop = async (req, res) => {
  try {
    const shop = await Shop.create(req.body);
    res.status(201).json({ shop });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const listAllShops = async (_req, res) => {
  try {
    const shops = await Shop.find().sort({ createdAt: -1 });
    res.json({ shops });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Handle specialties array if it's a string
    if (updateData.specialties && typeof updateData.specialties === 'string') {
      updateData.specialties = updateData.specialties.split(',').map((item) => item.trim());
    }

    const shop = await Shop.findByIdAndUpdate(id, updateData, { new: true });
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json({ shop });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findByIdAndDelete(id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

