import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoods } from '../slices/foodsSlice.js';
import { getFoodImage } from '../utils/imageHelpers.js';

const ratingMap = {
  good: 'Good Choice',
  moderate: 'Okay in Moderation',
  'high-risk': 'High Sugar-Fat'
};

const Foods = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.foods);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchFoods(search));
  };

  return (
    <div className="space-y-5">
      <div className="card flex flex-col md:flex-row md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Food intelligence</h2>
          <p className="text-slate-500">
            Search Sri Lankan dishes, view macros, and discover healthier swaps.
          </p>
        </div>
        <form className="flex gap-2 md:ml-auto" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search string hoppers, kottu..."
            className="flex-1 rounded-full border border-slate-200 px-4 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-brand-primary text-white rounded-full font-semibold hover:bg-brand-dark"
          >
            Search
          </button>
        </form>
      </div>

      {status === 'loading' ? (
        <p className="text-center text-slate-500">Loading foods...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((food) => (
            <div key={food._id || food.name} className="card space-y-2 overflow-hidden p-0">
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={getFoodImage(food.name)}
                  alt={food.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">{food.name}</h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    food.rating === 'good'
                      ? 'bg-green-100 text-green-700'
                      : food.rating === 'moderate'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {ratingMap[food.rating]}
                </span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2">{food.description}</p>
                <p className="text-sm text-slate-600">
                  {food.calories} kcal • {food.protein}g protein • {food.carbs}g carbs • {food.fat}g
                  fat
                </p>
                <Link
                  to={`/foods/${food._id}`}
                  className="text-sm text-green-700 font-semibold inline-flex items-center gap-1"
                >
                  View details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Foods;

