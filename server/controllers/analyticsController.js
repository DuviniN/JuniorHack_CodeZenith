import MealLog from '../models/MealLog.js';

export const getWeeklyAnalytics = async (req, res) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);

  const logs = await MealLog.find({
    user: req.user._id,
    loggedAt: { $gte: sevenDaysAgo }
  }).sort({ loggedAt: 1 });

  const analytics = Array.from({ length: 7 }).map((_, idx) => {
    const day = new Date(sevenDaysAgo);
    day.setDate(sevenDaysAgo.getDate() + idx);
    return {
      date: day.toISOString().slice(0, 10),
      calories: 0,
      swapsAccepted: 0
    };
  });

  let totalCalories = 0;
  let swapsAccepted = 0;

  logs.forEach((log) => {
    const dateKey = log.loggedAt.toISOString().slice(0, 10);
    const bucket = analytics.find((day) => day.date === dateKey);
    if (bucket) {
      bucket.calories += log.totalCalories;
      bucket.swapsAccepted += log.swapsAccepted;
    }
    totalCalories += log.totalCalories;
    swapsAccepted += log.swapsAccepted;
  });

  res.json({
    summary: {
      totalCalories,
      averageCalories: analytics.length
        ? Math.round(totalCalories / analytics.length)
        : 0,
      swapsAccepted
    },
    trend: analytics
  });
};

