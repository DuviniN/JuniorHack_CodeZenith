import Advisor from '../models/Advisor.js';
import Appointment from '../models/Appointment.js';
import Shop from '../models/Shop.js';

const fallbackAdvisors = [
  {
    name: 'Dr. Chamari Kulatunga',
    specialty: 'Diabetes & metabolic health',
    experienceYears: 12,
    city: 'Colombo',
    languages: ['Sinhala', 'English'],
    bio: 'Hospital-based dietitian helping busy executives tame blood sugar with Sri Lankan staples.',
    contactEmail: 'chamari@nutriadvisor.lk',
    virtual: true,
    rating: 4.9,
    feeLkr: 4500
  },
  {
    name: 'Nutritionist Udani Perera',
    specialty: 'Women wellness & plant-forward meals',
    experienceYears: 8,
    city: 'Kandy',
    languages: ['Sinhala', 'English', 'Tamil'],
    bio: 'Loves building meal plans around local greens, mallung, and village rice.',
    contactEmail: 'udani@nutriadvisor.lk',
    virtual: true,
    rating: 4.8,
    feeLkr: 3200
  },
  {
    name: 'Coach Malkanthi Gunasekara',
    specialty: 'Student & athlete fuelling',
    experienceYears: 15,
    city: 'Galle',
    languages: ['Sinhala'],
    bio: 'Former netball coach bringing heart-healthy Sri Lankan plates to active youth.',
    contactEmail: 'coachmalk@nutriadvisor.lk',
    virtual: false,
    rating: 4.7,
    feeLkr: 2800
  }
];

export const listAdvisors = async (_req, res) => {
  const advisors = await Advisor.find().limit(25);
  if (!advisors.length) {
    return res.json({ advisors: fallbackAdvisors });
  }
  res.json({ advisors });
};

export const bookAppointment = async (req, res) => {
  const { advisorId, scheduledFor, notes } = req.body;

  if (!advisorId || !scheduledFor) {
    return res
      .status(400)
      .json({ message: 'Advisor and schedule time required' });
  }

  const appointment = await Appointment.create({
    user: req.user._id,
    advisor: advisorId,
    scheduledFor,
    notes
  });

  // Populate advisor details before sending response
  await appointment.populate('advisor');

  res.status(201).json({ appointment });
};

export const listAppointments = async (req, res) => {
  const appointments = await Appointment.find({ user: req.user._id })
    .populate('advisor')
    .sort({ scheduledFor: 1 });
  res.json({ appointments });
};

export const getAppointment = async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findOne({ _id: id, user: req.user._id })
    .populate('advisor');
  
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  
  res.json({ appointment });
};

export const listHealthyShops = async (_req, res) => {
  try {
    const shops = await Shop.find().sort({ createdAt: -1 });
    res.json({ shops });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

