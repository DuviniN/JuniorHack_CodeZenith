import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api.js';

const MealPlans = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('restrictions'); // 'personalized', 'disease', 'restrictions'
  const [mealPlans, setMealPlans] = useState([]);
  const [restrictions, setRestrictions] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState('diabetes');
  const [selectedRestriction, setSelectedRestriction] = useState(null);
  const [loading, setLoading] = useState(false);

  const diseases = [
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'hypertension', label: 'Hypertension' },
    { value: 'heart-disease', label: 'Heart Disease' },
    { value: 'obesity', label: 'Obesity' },
    { value: 'kidney-disease', label: 'Kidney Disease' }
  ];

  useEffect(() => {
    if (activeTab === 'personalized') {
      loadPersonalizedPlans();
    } else if (activeTab === 'disease') {
      loadDiseasePlans(selectedDisease);
    } else if (activeTab === 'restrictions') {
      loadAllRestrictions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedDisease]);

  const loadPersonalizedPlans = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/meal-plans/personalized');
      setMealPlans(data.mealPlans || []);
    } catch (error) {
      console.error('Failed to load personalized plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDiseasePlans = async (disease) => {
    setLoading(true);
    setMealPlans([]); // Clear previous plans immediately
    try {
      const { data } = await api.get(`/meal-plans/disease/${disease}`);
      console.log(`Loaded meal plans for ${disease}:`, data.mealPlans);
      setMealPlans(data.mealPlans || []);
    } catch (error) {
      console.error('Failed to load disease plans:', error);
      setMealPlans([]); // Ensure empty array on error
    } finally {
      setLoading(false);
    }
  };

  const loadAllRestrictions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/meal-plans/restrictions');
      setRestrictions(data.restrictions || []);
    } catch (error) {
      console.error('Failed to load restrictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRestrictionDetails = async (disease) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/meal-plans/restrictions/${disease}`);
      setSelectedRestriction(data.restriction);
    } catch (error) {
      console.error('Failed to load restriction details:', error);
    } finally {
      setLoading(false);
    }
  };

  const userGoal = user?.onboarding?.goal || 'maintenance';

  const getDiseaseIcon = (disease) => {
    const icons = {
      'diabetes': '🩺',
      'hypertension': '💓',
      'heart-disease': '❤️',
      'obesity': '⚖️',
      'kidney-disease': '🫘'
    };
    return icons[disease] || '🏥';
  };

  const getDiseaseColor = (disease) => {
    const colors = {
      'diabetes': 'from-blue-500 to-blue-600',
      'hypertension': 'from-red-500 to-red-600',
      'heart-disease': 'from-pink-500 to-pink-600',
      'obesity': 'from-orange-500 to-orange-600',
      'kidney-disease': 'from-purple-500 to-purple-600'
    };
    return colors[disease] || 'from-slate-500 to-slate-600';
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Meal Plans & Dietary Guidelines</h2>
        <p className="text-slate-500">
          Discover personalized meal plans and learn what foods to avoid based on your health goals and conditions.
        </p>
      </div>

      {/* Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Tabs */}
        <div className="lg:col-span-1">
          <div className="card p-0 overflow-hidden">
            <div className="p-2">
              <button
                onClick={() => {
                  setActiveTab('restrictions');
                  setSelectedRestriction(null);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition ${
                  activeTab === 'restrictions'
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="font-semibold">What NOT to Eat</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('personalized');
                  setSelectedRestriction(null);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition ${
                  activeTab === 'personalized'
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="font-semibold">Personalized Plans</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('disease');
                  setSelectedRestriction(null);
                  loadDiseasePlans(selectedDisease);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition ${
                  activeTab === 'disease'
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="font-semibold">Disease Plans</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3">
          <div className="card">
        {activeTab === 'personalized' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Meal Plans for Your Goal: {userGoal.replace('-', ' ').toUpperCase()}
              </h3>
              <p className="text-sm text-slate-500">
                These meal plans are tailored based on your profile and goals.
              </p>
            </div>
            {loading ? (
              <p className="text-slate-500 text-center py-8">Loading meal plans...</p>
            ) : mealPlans.length > 0 ? (
              <div className="space-y-4">
                {mealPlans.map((plan) => (
                  <MealPlanCard key={plan._id} plan={plan} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">
                No personalized meal plans available. Complete your onboarding to get personalized recommendations.
              </p>
            )}
          </div>
        )}

        {activeTab === 'disease' && (
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-slate-800 mb-2">Disease-Specific Meal Plans</h3>
              <p className="text-slate-500 mb-4">Select a condition to view tailored meal plans with calorie information.</p>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Select Disease/Condition:</label>
              <select
                value={selectedDisease}
                onChange={(e) => {
                  const newDisease = e.target.value;
                  setSelectedDisease(newDisease);
                  setMealPlans([]); // Clear plans immediately when changing disease
                  loadDiseasePlans(newDisease);
                }}
                className="w-full md:w-auto rounded-xl border border-slate-200 px-4 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
              >
                {diseases.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            {loading ? (
              <p className="text-slate-500 text-center py-8">Loading meal plans...</p>
            ) : mealPlans.length > 0 ? (
              <div className="space-y-4">
                {mealPlans.map((plan) => (
                  <MealPlanCard key={plan._id} plan={plan} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No meal plans available for this condition.</p>
            )}
          </div>
        )}

        {activeTab === 'restrictions' && (
          <div>
            {!selectedRestriction ? (
              <>
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-slate-800 mb-2">Foods to Avoid by Condition</h3>
                  <p className="text-slate-500">
                    Learn which foods you should avoid or limit based on your health condition.
                  </p>
                </div>
                {loading ? (
                  <p className="text-slate-500 text-center py-8">Loading restrictions...</p>
                ) : restrictions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {restrictions.map((restriction) => (
                      <div
                        key={restriction._id}
                        className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl bg-gradient-to-br ${getDiseaseColor(restriction.disease)}`}
                        onClick={() => loadRestrictionDetails(restriction.disease)}
                      >
                        <div className="relative z-10">
                          <div className="text-4xl mb-3">{getDiseaseIcon(restriction.disease)}</div>
                          <h4 className="text-xl font-bold text-white mb-2">
                            {restriction.diseaseName || restriction.disease}
                          </h4>
                        </div>
                        <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No restrictions data available.</p>
                )}
              </>
            ) : (
              <div>
                <div className="mb-6">
                  <button
                    onClick={() => setSelectedRestriction(null)}
                    className="text-sm text-slate-500 hover:text-slate-700 mb-3 flex items-center gap-2"
                  >
                    <span>←</span> Back to conditions
                  </button>
                  <h4 className="text-2xl font-semibold text-slate-800">
                    {selectedRestriction.diseaseName || selectedRestriction.disease}
                  </h4>
                </div>

                {selectedRestriction.description && (
                  <p className="text-slate-600 mb-4">{selectedRestriction.description}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-slate-800 mb-3 text-red-600">⚠️ Foods to Avoid</h5>
                    <div className="space-y-2">
                      {selectedRestriction.foodsToAvoid?.map((food, idx) => (
                        <div key={idx} className="border border-red-100 rounded-lg p-3 bg-red-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-800">{food.foodName}</p>
                              <p className="text-sm text-slate-600 mt-1">{food.reason}</p>
                            </div>
                            <span
                              className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                                food.severity === 'high'
                                  ? 'bg-red-200 text-red-800'
                                  : food.severity === 'moderate'
                                  ? 'bg-orange-200 text-orange-800'
                                  : 'bg-yellow-200 text-yellow-800'
                              }`}
                            >
                              {food.severity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-slate-800 mb-3 text-green-600">✅ Recommended Foods</h5>
                    <div className="space-y-2">
                      {selectedRestriction.recommendedFoods?.map((food, idx) => (
                        <div key={idx} className="border border-green-100 rounded-lg p-3 bg-green-50">
                          <p className="font-semibold text-slate-800">{food}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedRestriction.dailyCalorieRange && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                    <h5 className="font-semibold text-slate-800 mb-2">Daily Calorie Range</h5>
                    <p className="text-slate-600">
                      {selectedRestriction.dailyCalorieRange.min} - {selectedRestriction.dailyCalorieRange.max} kcal per day
                    </p>
                  </div>
                )}

                {selectedRestriction.tips && selectedRestriction.tips.length > 0 && (
                  <div className="mt-6">
                    <h5 className="font-semibold text-slate-800 mb-4 text-lg flex items-center gap-2">
                      <span className="text-2xl">💡</span>
                      <span>Tips & Recommendations</span>
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedRestriction.tips.map((tip, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-4 bg-gradient-to-br from-brand-primary/5 to-brand-primary/10 rounded-xl border border-brand-primary/20 hover:border-brand-primary/40 transition"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-slate-700 font-medium flex-1">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRestriction.generalGuidelines && selectedRestriction.generalGuidelines.length > 0 && (
                  <div className="mt-6">
                    <h5 className="font-semibold text-slate-800 mb-4 text-lg flex items-center gap-2">
                      <span className="text-2xl">📋</span>
                      <span>General Guidelines</span>
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedRestriction.generalGuidelines.map((guideline, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-slate-300 transition"
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs mt-0.5">
                            ✓
                          </div>
                          <p className="text-slate-700 flex-1">{guideline}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MealPlanCard = ({ plan }) => {
  const totalDailyCalories = plan.meals?.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0) || plan.dailyCalories || 0;

  return (
    <div className="border border-slate-200 rounded-xl p-6 hover:border-brand-primary transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-xl font-semibold text-slate-800 mb-1">{plan.name}</h4>
          {plan.description && <p className="text-sm text-slate-600">{plan.description}</p>}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-brand-primary">{totalDailyCalories}</p>
          <p className="text-xs text-slate-500">kcal/day</p>
        </div>
      </div>

      {plan.dietaryRestrictions && plan.dietaryRestrictions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {plan.dietaryRestrictions.map((restriction, idx) => (
            <span key={idx} className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
              {restriction}
            </span>
          ))}
        </div>
      )}

      {plan.meals && plan.meals.length > 0 && (
        <div className="space-y-3 mb-4">
          {plan.meals.map((meal, idx) => (
            <div key={idx} className="border border-slate-100 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-slate-800 capitalize">{meal.mealType}</h5>
                <span className="text-sm text-slate-600">{meal.totalCalories} kcal</span>
              </div>
              {meal.description && <p className="text-sm text-slate-600 mb-2">{meal.description}</p>}
              {meal.foods && meal.foods.length > 0 && (
                <div className="space-y-1">
                  {meal.foods.map((food, foodIdx) => (
                    <div key={foodIdx} className="text-sm text-slate-600">
                      • {food.foodName} {food.portionCount > 1 && `(${food.portionCount} portions)`}
                      {food.notes && <span className="text-slate-400 ml-2">- {food.notes}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {plan.foodsToAvoid && plan.foodsToAvoid.length > 0 && (
        <div className="mb-4">
          <h5 className="font-semibold text-slate-800 mb-2 text-sm">Foods to Avoid:</h5>
          <div className="flex flex-wrap gap-2">
            {plan.foodsToAvoid.map((food, idx) => (
              <span key={idx} className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs">
                {food}
              </span>
            ))}
          </div>
        </div>
      )}

      {plan.tips && plan.tips.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <h5 className="font-semibold text-slate-800 mb-3 text-sm flex items-center gap-2">
            <span className="text-lg">💡</span>
            <span>Tips & Recommendations</span>
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {plan.tips.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-3 bg-gradient-to-br from-brand-primary/5 to-brand-primary/10 rounded-lg border border-brand-primary/20"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-sm text-slate-700 font-medium flex-1">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlans;

