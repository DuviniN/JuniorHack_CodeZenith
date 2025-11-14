import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../slices/authSlice.js';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    weightKg: '',
    heightCm: '',
    activityLevel: 'light',
    goal: 'maintenance',
    dislikes: '',
    allergies: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        age: user.onboarding?.age || '',
        weightKg: user.onboarding?.weightKg || '',
        heightCm: user.onboarding?.heightCm || '',
        activityLevel: user.onboarding?.activityLevel || 'light',
        goal: user.onboarding?.goal || 'maintenance',
        dislikes: user.preferences?.dislikes?.join(', ') || '',
        allergies: user.preferences?.allergies?.join(', ') || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        // Name and email are not included - they cannot be changed
        onboarding: {
          age: Number(form.age),
          weightKg: Number(form.weightKg),
          heightCm: Number(form.heightCm),
          activityLevel: form.activityLevel,
          goal: form.goal
        },
        preferences: {
          dislikes: form.dislikes ? form.dislikes.split(',').map((item) => item.trim()).filter(Boolean) : [],
          allergies: form.allergies ? form.allergies.split(',').map((item) => item.trim()).filter(Boolean) : []
        }
      };

      await dispatch(updateProfile(payload)).unwrap();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: error || 'Failed to update profile' });
    }
  };

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary' },
    { value: 'light', label: 'Light movement' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'active', label: 'Active' }
  ];

  const goals = [
    { value: 'weight-loss', label: 'Weight Loss' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'muscle', label: 'Muscle Gain' },
    { value: 'diabetes', label: 'Diabetes Control' },
    { value: 'student', label: 'Student Fuel' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Profile</h2>
            <p className="text-slate-500 text-sm mt-1">View and update your personal information</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-dark transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded-xl text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  disabled={true}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 text-slate-500 cursor-not-allowed"
                  readOnly
                />
                <p className="text-xs text-slate-400 mt-1">Name cannot be changed</p>
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  disabled={true}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 text-slate-500 cursor-not-allowed"
                  readOnly
                />
                <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
              </div>
            </div>
          </section>

          {/* Health Metrics */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Health Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Weight (kg)</label>
                <input
                  type="number"
                  name="weightKg"
                  value={form.weightKg}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Height (cm)</label>
                <input
                  type="number"
                  name="heightCm"
                  value={form.heightCm}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
            </div>
          </section>

          {/* Activity & Goals */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Activity & Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Activity Level</label>
                <select
                  name="activityLevel"
                  value={form.activityLevel}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 disabled:bg-slate-50 disabled:text-slate-500"
                >
                  {activityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Goal</label>
                <select
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 disabled:bg-slate-50 disabled:text-slate-500"
                >
                  {goals.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">
                  Dislikes (comma-separated)
                </label>
                <input
                  type="text"
                  name="dislikes"
                  value={form.dislikes}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="e.g., fish, spicy food"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">
                  Allergies (comma-separated)
                </label>
                <input
                  type="text"
                  name="allergies"
                  value={form.allergies}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="e.g., nuts, dairy"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                type="submit"
                className="px-6 py-2 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-dark transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setMessage({ type: '', text: '' });
                  // Reset form to original values
                  if (user) {
                    setForm({
                      name: user.name || '',
                      email: user.email || '',
                      age: user.onboarding?.age || '',
                      weightKg: user.onboarding?.weightKg || '',
                      heightCm: user.onboarding?.heightCm || '',
                      activityLevel: user.onboarding?.activityLevel || 'light',
                      goal: user.onboarding?.goal || 'maintenance',
                      dislikes: user.preferences?.dislikes?.join(', ') || '',
                      allergies: user.preferences?.allergies?.join(', ') || ''
                    });
                  }
                }}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;

