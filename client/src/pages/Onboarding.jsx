import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { submitOnboarding } from '../slices/authSlice.js';

const Onboarding = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age: user?.onboarding?.age || '',
    weightKg: user?.onboarding?.weightKg || '',
    heightCm: user?.onboarding?.heightCm || '',
    activityLevel: user?.onboarding?.activityLevel || 'light',
    goal: user?.onboarding?.goal || 'weight-loss'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(submitOnboarding(form));
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto card mt-10">
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">Onboarding</h2>
      <p className="text-slate-500 mb-6">
        Tell us about your goals so we can tailor Sri Lankan meals for you.
      </p>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm text-slate-600">Age</label>
          <input
            type="number"
            name="age"
            className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2"
            value={form.age}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Weight (kg)</label>
          <input
            type="number"
            name="weightKg"
            className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2"
            value={form.weightKg}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Height (cm)</label>
          <input
            type="number"
            name="heightCm"
            className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2"
            value={form.heightCm}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Activity level</label>
          <select
            name="activityLevel"
            className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2"
            value={form.activityLevel}
            onChange={handleChange}
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Light movement</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-slate-600">Main goal</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            {['weight-loss', 'maintenance', 'muscle', 'diabetes'].map((goal) => (
              <label
                key={goal}
                className={`border rounded-xl px-3 py-2 text-sm capitalize cursor-pointer ${
                  form.goal === goal ? 'border-brand-primary bg-teal-50' : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="goal"
                  value={goal}
                  className="mr-2"
                  checked={form.goal === goal}
                  onChange={handleChange}
                />
                {goal.replace('-', ' ')}
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="md:col-span-2 mt-4 bg-brand-primary text-white py-3 rounded-2xl text-lg font-semibold hover:bg-brand-dark"
        >
          Save and continue
        </button>
      </form>
    </div>
  );
};

export default Onboarding;

