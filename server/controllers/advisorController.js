import Advisor from '../models/Advisor.js';
import Appointment from '../models/Appointment.js';

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
  res.json({
    shops: [
      {
        name: 'Good Market',
        city: 'Colombo',
        websiteUrl: 'https://www.goodmarket.global/info/srilanka/',
        mapUrl: 'https://maps.app.goo.gl/qXtJGe8k4V6oA2jD9',
        specialties: ['organic produce', 'marketplace events', 'organic PGS', 'healthy groceries']
      },
      {
        name: 'Haritha Foods',
        city: 'Hyderabad, India',
        websiteUrl: 'https://harithafoods.in/',
        mapUrl: 'https://maps.app.goo.gl/q4EoH1o9kG7fi1Gq6',
        specialties: ['millet staples', 'ready to cook', 'healthy spice mixes', 'millet flours']
      },
      {
        name: 'Saviru Spices Naturals',
        city: 'Matale',
        websiteUrl: 'https://bizconnect.idb.gov.lk/listing/matale/food-and-beverages,spice-related-industries/saviru-spices-naturals-pvt-ltd/',
        mapUrl: 'https://maps.app.goo.gl/c2KmZVbNUsngmKzF9',
        specialties: ['spices & condiments', 'dehydrated foods', 'processed foods', 'herbal products']
      }
    ]
  });
};

