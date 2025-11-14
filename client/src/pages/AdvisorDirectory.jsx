import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchAdvisors,
  fetchAppointments,
  bookAppointment
} from '../slices/advisorSlice.js';
import { getAdvisorImage } from '../utils/imageHelpers.js';

const AdvisorDirectory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, appointments } = useSelector((state) => state.advisors);
  const [form, setForm] = useState({ advisorId: '', scheduledFor: '', notes: '' });

  useEffect(() => {
    dispatch(fetchAdvisors());
    dispatch(fetchAppointments());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.advisorId || !form.scheduledFor) return;
    const result = await dispatch(bookAppointment(form));
    if (result.type === 'advisors/book/fulfilled') {
      // Navigate to booking details page
      navigate(`/booking/${result.payload._id}`);
    }
    setForm({ advisorId: '', scheduledFor: '', notes: '' });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400 text-white p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <p className="uppercase text-xs tracking-[0.3em] text-white/70">Advisor concierge</p>
            <h1 className="text-4xl font-semibold mt-3">Sri Lankan nutritionists on call</h1>
            <p className="mt-4 text-white/80">
              Book culturally-aware dietitians, discover healthy grocers, and build a support squad
              for your goals.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
                Virtual & in-person
              </span>
              <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
                Sinhala • Tamil • English
              </span>
              <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
                Metabolic | Women’s health | Students
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            {['nutrition', 'wellness sri lanka', 'ayurveda meals', 'healthy cooking'].map((tag) => (
              <img
                key={tag}
                src={`https://source.unsplash.com/featured/400x400/?${encodeURIComponent(tag)}`}
                alt="Advisor mood"
                className="rounded-2xl object-cover h-32 w-full md:h-40 md:w-40 shadow-lg shadow-black/20"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Featured advisors</h2>
          <p className="text-sm text-slate-500">Tap a card to pre-fill the booking form</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {list.map((advisor) => (
            <button
              key={advisor._id || advisor.name}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, advisorId: advisor._id }))}
              className={`text-left rounded-3xl border border-slate-100 overflow-hidden shadow-lg hover:-translate-y-1 transition focus:outline-none ${
                form.advisorId === advisor._id ? 'ring-4 ring-green-200' : ''
              }`}
            >
              <div className="h-64 w-full overflow-hidden">
                <img
                  src={advisor.image || getAdvisorImage(advisor.name)}
                  alt={advisor.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{advisor.name}</p>
                    <p className="text-sm text-slate-500">
                      {advisor.specialty} • {advisor.city}
                    </p>
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    {advisor.rating?.toFixed ? advisor.rating.toFixed(1) : advisor.rating || '4.8'} ★
                  </span>
                </div>
                <p className="text-sm text-slate-500">{advisor.languages?.join(', ')}</p>
                <p className="text-sm text-slate-600">{advisor.bio}</p>
                <div className="flex items-center justify-between text-sm text-green-700 font-semibold">
                  <span>Fee ~ LKR {advisor.feeLkr || 3500}</span>
                  <span className="cursor-pointer">Book session →</span>
                </div>
              </div>
            </button>
          ))}
          {!list.length && (
            <p className="text-slate-500 text-sm">No advisors seeded yet — add some via admin.</p>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form className="card space-y-4" onSubmit={handleSubmit}>
          <h3 className="text-lg font-semibold text-slate-800">Book an appointment</h3>
          <div>
            <label className="text-sm text-slate-600">Advisor</label>
            <select
              className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2"
              value={form.advisorId}
              onChange={(e) => setForm((prev) => ({ ...prev, advisorId: e.target.value }))}
              required
            >
              <option value="">Select advisor</option>
              {list.map((advisor) => (
                <option key={advisor._id} value={advisor._id}>
                  {advisor.name} ({advisor.specialty})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">Calendar slot</label>
            <input
              type="datetime-local"
              className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2"
              value={form.scheduledFor}
              onChange={(e) => setForm((prev) => ({ ...prev, scheduledFor: e.target.value }))}
              required
            />
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
          <button
            type="submit"
            className="w-full bg-brand-primary text-white py-2 rounded-xl font-semibold shadow-lg shadow-teal-200 hover:bg-brand-dark"
          >
            Book slot
          </button>
        </form>

        <div className="card">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Upcoming appointments</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {appointments.map((appointment) => (
              <button
                key={appointment._id}
                onClick={() => navigate(`/booking/${appointment._id}`)}
                className="w-full text-left border border-slate-100 rounded-xl p-3 hover:border-brand-primary hover:shadow-md transition"
              >
                <p className="text-slate-800 font-semibold">
                  {appointment.advisor?.name || 'Advisor TBD'}
                </p>
                <p className="text-sm text-slate-500">
                  {new Date(appointment.scheduledFor).toLocaleString()}
                </p>
                <p className="text-xs text-green-600 uppercase">{appointment.status}</p>
                <p className="text-xs text-brand-primary mt-1">View details →</p>
              </button>
            ))}
            {!appointments.length && (
              <p className="text-slate-500 text-sm">No appointments booked yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdvisorDirectory;
