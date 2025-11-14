import ChatBox from '../components/ChatBox.jsx';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const Chat = () => {
  const { user } = useSelector((state) => state.auth);

  // Build an initial profile from the stored onboarding data (if present)
  const initialProfile = user?.onboarding
    ? {
        name: user.name,
        age: user.onboarding.age,
        weightKg: user.onboarding.weightKg,
        heightCm: user.onboarding.heightCm,
        goal: user.onboarding.goal,
        dietaryPreferences: user.onboarding.dietaryPreferences || '',
        allergies: user.onboarding.allergies || '',
        preferredCuisine: user.onboarding.preferredCuisine || ''
      }
    : { name: user?.name || '', dietaryPreferences: '', allergies: '', preferredCuisine: '' };

  const [profile, setProfile] = useState(initialProfile);

  // If authentication/profile is loaded later, update local profile
  useEffect(() => {
    setProfile(initialProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Nutrition Chat</h1>

      {/* Small preferences form to let the user state their desires/preferences */}
      <section className="card p-4">
        <h2 className="text-lg font-medium">Your preferences (used to tailor advice)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div>
            <label className="text-sm">Goal (e.g., lose weight, gain muscle)</label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 mt-1"
              value={profile.goal || ''}
              onChange={(e) => setProfile((p) => ({ ...p, goal: e.target.value }))}
              placeholder="e.g., lose weight"
            />
          </div>

          <div>
            <label className="text-sm">Dietary preferences (vegetarian, vegan, keto)</label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 mt-1"
              value={profile.dietaryPreferences || ''}
              onChange={(e) => setProfile((p) => ({ ...p, dietaryPreferences: e.target.value }))}
              placeholder="e.g., vegetarian, no beef"
            />
          </div>

          <div>
            <label className="text-sm">Allergies / intolerances</label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 mt-1"
              value={profile.allergies || ''}
              onChange={(e) => setProfile((p) => ({ ...p, allergies: e.target.value }))}
              placeholder="e.g., peanuts, lactose"
            />
          </div>

          <div>
            <label className="text-sm">Preferred cuisine</label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 mt-1"
              value={profile.preferredCuisine || ''}
              onChange={(e) => setProfile((p) => ({ ...p, preferredCuisine: e.target.value }))}
              placeholder="e.g., Sri Lankan, Mediterranean"
            />
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-3">These fields are used only for the chat session and won't be saved unless you update your profile.</p>
      </section>

      <ChatBox userProfile={profile} />
    </div>
  );
};

export default Chat;
