import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  fetchFoodById,
  fetchSmartTip,
  fetchSwapIdeas
} from '../slices/foodsSlice.js';
import { getFoodImage } from '../utils/imageHelpers.js';

const FoodDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected, smartTips, swaps } = useSelector((state) => state.foods);

  useEffect(() => {
    if (id) {
      dispatch(fetchFoodById(id));
    }
  }, [dispatch, id]);

  if (!selected) {
    return <p className="text-center text-slate-500">Loading food...</p>;
  }

  const tip = smartTips[id];
  const swapIdeas = swaps[id];

  return (
    <div className="space-y-5">
      <div className="card p-0 overflow-hidden">
        <div className="h-64 w-full">
          <img
            src={getFoodImage(selected.name)}
            alt={selected.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-brand-dark">
                {selected.category}
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">{selected.name}</h1>
              <p className="text-slate-600 mt-2">{selected.description}</p>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                selected.rating === 'good'
                  ? 'bg-green-100 text-green-700'
                  : selected.rating === 'moderate'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {selected.rating === 'good'
                ? 'Good Choice'
                : selected.rating === 'moderate'
                ? 'Okay in Moderation'
                : 'High Sugar-Fat'}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Calories', value: `${selected.calories} kcal` },
              { label: 'Protein', value: `${selected.protein} g` },
              { label: 'Carbs', value: `${selected.carbs} g` },
              { label: 'Fat', value: `${selected.fat} g` }
            ].map((item) => (
              <div key={item.label} className="border border-slate-100 rounded-xl p-3 text-center">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="text-xl font-semibold text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Smart tip</h3>
            <button
              onClick={() => dispatch(fetchSmartTip(id))}
              className="text-sm px-3 py-1 rounded-full bg-brand-primary text-white hover:bg-brand-dark"
            >
              Get tip
            </button>
          </div>
          {tip ? (
            <p className="text-slate-600">{tip}</p>
          ) : (
            <p className="text-slate-400 text-sm">Tap the button to fetch a contextual tip.</p>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Swap ideas</h3>
            <button
              onClick={() => dispatch(fetchSwapIdeas(id))}
              className="text-sm px-3 py-1 rounded-full border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            >
              Show swaps
            </button>
          </div>
          {swapIdeas ? (
            <ul className="space-y-2 text-sm text-slate-600">
              {swapIdeas.map((swap) => (
                <li key={swap.title} className="border border-slate-100 rounded-xl px-3 py-2">
                  <p className="font-semibold text-slate-800">{swap.title}</p>
                  <p>{swap.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-sm">Request swaps to see healthier options.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;

