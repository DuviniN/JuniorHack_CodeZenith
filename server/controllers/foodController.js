import Food from '../models/Food.js';

export const listFoods = async (req, res) => {
  const { q, rating } = req.query;

  const filter = { status: 'approved' };
  if (rating) filter.rating = rating;
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } }
    ];
  }

  const foods = await Food.find(filter).limit(50);
  res.json({ foods });
};

export const getFood = async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food || (food.status !== 'approved' && req.user?.role !== 'admin')) {
    return res.status(404).json({ message: 'Food not found' });
  }
  res.json({ food });
};

export const createFood = async (req, res) => {
  const payload = {
    ...req.body,
    createdBy: req.user._id,
    status: req.user.role === 'admin' ? 'approved' : 'pending'
  };

  const food = await Food.create(payload);
  res.status(201).json({ food });
};

export const getSmartTip = async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).json({ message: 'Food not found' });
  res.json({
    tip:
      food.smartTip ||
      'Use coconut sambol sparingly, add fresh gotukola salad on the side.'
  });
};

export const getSwapIdeas = async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) return res.status(404).json({ message: 'Food not found' });

  if (food.swaps?.length) {
    return res.json({ swaps: food.swaps.slice(0, 3) });
  }

  res.json({
    swaps: [
      {
        title: 'Add more veggies',
        description: 'Swap half the rice for steamed gotukola + beetroot salad'
      },
      {
        title: 'Lower coconut milk',
        description: 'Use second-press coconut milk to reduce saturated fat'
      },
      {
        title: 'Roast not fry',
        description: 'Air fry cutlets for crunch without deep oil'
      }
    ]
  });
};

