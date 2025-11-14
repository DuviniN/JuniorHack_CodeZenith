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

  // Always generate dynamic swap ideas based on lower-calorie foods from database
  // Find lower-calorie alternatives from the database
  // First, try to find foods in the same category with lower calories
  const sameCategoryFoods = await Food.find({
    _id: { $ne: food._id },
    status: 'approved',
    category: food.category,
    calories: { $lt: food.calories }
  })
    .sort({ calories: -1 }) // Sort by calories descending (closest to original)
    .limit(5);

  // If we have same-category foods, use them. Otherwise, get any lower-calorie foods
  let lowerCalorieFoods = sameCategoryFoods;
  
  if (lowerCalorieFoods.length < 3) {
    // Fill with foods from other categories
    const otherCategoryFoods = await Food.find({
      _id: { $ne: food._id },
      status: 'approved',
      calories: { $lt: food.calories },
      ...(food.category ? { category: { $ne: food.category } } : {}),
      // Exclude foods already selected
      _id: { $nin: lowerCalorieFoods.map(f => f._id) }
    })
      .sort({ calories: -1 })
      .limit(3 - lowerCalorieFoods.length);
    
    lowerCalorieFoods = [...lowerCalorieFoods, ...otherCategoryFoods];
  }

  // Take up to 3 foods (already limited in queries above)
  lowerCalorieFoods = lowerCalorieFoods.slice(0, 3);

  if (lowerCalorieFoods.length === 0) {
    // Fallback generic swaps if no lower-calorie foods found
    return res.json({
      swaps: [
        {
          title: 'Reduce portion size',
          description: `Try eating half portion of ${food.name} to reduce calories by ${Math.round(food.calories / 2)} kcal`
        },
        {
          title: 'Add more vegetables',
          description: `Pair ${food.name} with steamed gotukola, cucumber salad, or kola mallung to add fiber and feel fuller`
        },
        {
          title: 'Cooking method swap',
          description: 'Use less oil, steam instead of fry, or use second-press coconut milk to reduce calories'
        }
      ]
    });
  }

  // Generate swap ideas based on found lower-calorie foods
  const swaps = lowerCalorieFoods.map((swapFood, index) => {
    const calorieDiff = food.calories - swapFood.calories;
    const caloriePercent = Math.round((calorieDiff / food.calories) * 100);
    
    // Determine if it's same category
    const isSameCategory = swapFood.category === food.category;
    
    // Generate contextual title
    let title;
    if (isSameCategory) {
      title = `Lower-calorie ${food.category} option`;
    } else if (caloriePercent >= 30) {
      title = `Light alternative: ${swapFood.name}`;
    } else {
      title = `Healthier swap: ${swapFood.name}`;
    }

    // Generate detailed description
    let description = `Swap ${food.name} for ${swapFood.name} - saves ${calorieDiff} calories (${caloriePercent}% less)`;
    
    // Add contextual description based on calorie difference
    if (caloriePercent >= 30) {
      description += '. This is a significantly lighter option!';
    } else if (caloriePercent >= 15) {
      description += '. A moderate reduction while keeping similar nutrition.';
    } else {
      description += '. A slightly lighter alternative.';
    }

    // Add nutritional benefits if relevant
    if (swapFood.protein > food.protein) {
      description += ` Plus, you'll get more protein (${swapFood.protein}g vs ${food.protein}g).`;
    }
    if (swapFood.fiber && food.fiber && swapFood.fiber > food.fiber) {
      description += ` Higher fiber content too!`;
    }
    if (swapFood.rating === 'good' && food.rating !== 'good') {
      description += ` Better nutrition rating!`;
    }

    return {
      title,
      description,
      foodId: swapFood._id.toString(),
      foodName: swapFood.name,
      calories: swapFood.calories,
      calorieDifference: calorieDiff,
      category: swapFood.category
    };
  });

  res.json({ swaps });
};

