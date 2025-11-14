import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMeal, fetchMeals } from '../slices/mealsSlice.js';
import { fetchFoods } from '../slices/foodsSlice.js';

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

const Meals = () => {
  const dispatch = useDispatch();
  const foods = useSelector((state) => state.foods.items);
  const meals = useSelector((state) => state.meals.logs);
  const [form, setForm] = useState({
    mealType: 'breakfast',
    foodId: '',
    portionCount: 1,
    notes: '',
    swapsAccepted: 0
  });

  useEffect(() => {
    dispatch(fetchMeals());
    dispatch(fetchFoods());
  }, [dispatch]);

  const selectedFood = useMemo(
    () => foods.find((food) => food._id === form.foodId),
    [foods, form.foodId]
  );

  const preview = selectedFood
    ? {
        calories: selectedFood.calories * form.portionCount,
        protein: selectedFood.protein * form.portionCount,
        carbs: selectedFood.carbs * form.portionCount,
        fat: selectedFood.fat * form.portionCount
      }
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.foodId) return;
    await dispatch(
      addMeal({
        mealType: form.mealType,
        notes: form.notes,
        swapsAccepted: form.swapsAccepted,
        items: [{ foodId: form.foodId, portionCount: form.portionCount }]
      })
    );
    setForm((prev) => ({ ...prev, notes: '', swapsAccepted: 0 }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="card">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Log a meal</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-slate-600">Meal type</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {mealTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setForm((prev) => ({ ...prev, mealType: type }))}
                  className={`px-3 py-2 rounded-xl text-sm capitalize ${
                    form.mealType === type
                      ? 'bg-brand-primary text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-600">Food</label>
            <select
              className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2"
              value={form.foodId}
              onChange={(e) => setForm((prev) => ({ ...prev, foodId: e.target.value }))}
              required
            >
              <option value="">Choose a food</option>
              {foods.map((food) => (
                <option key={food._id} value={food._id}>
                  {food.name} ({food.calories} kcal)
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-600">Portions</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2"
                value={form.portionCount}
                onChange={(e) => setForm((prev) => ({ ...prev, portionCount: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Swaps accepted</label>
              <input
                type="number"
                min="0"
                className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2"
                value={form.swapsAccepted}
                onChange={(e) => setForm((prev) => ({ ...prev, swapsAccepted: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-600">Notes</label>
            <textarea
              className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2"
              rows="3"
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          {preview && (
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl p-3">
              <p>{preview.calories} kcal</p>
              <p>{preview.protein} g protein</p>
              <p>{preview.carbs} g carbs</p>
              <p>{preview.fat} g fat</p>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-brand-primary text-white py-3 rounded-2xl text-lg font-semibold hover:bg-brand-dark"
          >
            Add meal
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Meal history</h2>
        <div className="space-y-3 max-h-[540px] overflow-y-auto pr-2">
          {meals.map((meal) => (
            <div key={meal._id} className="border border-slate-100 rounded-xl p-3">
              <p className="text-sm text-slate-500">
                {new Date(meal.loggedAt).toLocaleString()} •{' '}
                <span className="uppercase text-slate-700 font-semibold">{meal.mealType}</span>
              </p>
              <p className="text-slate-800 font-semibold">{meal.totalCalories} kcal</p>
              <p className="text-sm text-slate-500">
                {meal.foods?.map((item) => item.foodName).join(', ')}
              </p>
              <p className="text-xs text-teal-600 mt-1">
                Swaps accepted: {meal.swapsAccepted || 0}
              </p>
            </div>
          ))}
          {!meals.length && <p className="text-slate-500 text-sm">No meals logged yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Meals;

