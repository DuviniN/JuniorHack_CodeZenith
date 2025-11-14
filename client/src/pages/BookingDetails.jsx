import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api.js';
import { getAdvisorImage } from '../utils/imageHelpers.js';
import { fetchAppointments } from '../slices/advisorSlice.js';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.advisors);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        // Try to find appointment in Redux store first
        const foundAppointment = appointments.find((apt) => apt._id === id);
        if (foundAppointment && foundAppointment.advisor) {
          setAppointment(foundAppointment);
          setLoading(false);
          return;
        }

        // If not found, fetch from API
        const { data } = await api.get(`/advisors/appointments/${id}`);
        setAppointment(data.appointment);
      } catch (error) {
        console.error('Failed to load appointment:', error);
        alert('Failed to load booking details');
        navigate('/advisors');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAppointment();
    } else {
      navigate('/advisors');
    }
  }, [id, navigate, appointments]);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="card">
        <p className="text-center text-slate-500">Loading booking details...</p>
      </div>
    );
  }

  if (!appointment || !appointment.advisor) {
    return (
      <div className="card">
        <p className="text-center text-slate-500">Booking not found</p>
        <Link
          to="/advisors"
          className="mt-4 inline-block px-4 py-2 rounded-full bg-brand-primary text-white text-sm font-semibold hover:bg-brand-dark transition"
        >
          Back to Advisors
        </Link>
      </div>
    );
  }

  const advisor = appointment.advisor;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-900">Booking Details</h1>
        <Link
          to="/advisors"
          className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
        >
          ← Back to Advisors
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Advisor Details Section */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-800">Advisor Information</h2>
            <span className={`px-3 py-1 text-xs rounded-full ${
              appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
              appointment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
              appointment.status === 'completed' ? 'bg-blue-100 text-blue-700' :
              'bg-red-100 text-red-700'
            }`}>
              {appointment.status?.toUpperCase()}
            </span>
          </div>

          <div className="h-64 w-full overflow-hidden rounded-2xl">
            <img
              src={advisor.photoUrl || getAdvisorImage(advisor.name)}
              alt={advisor.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{advisor.name}</h3>
              {advisor.specialty && (
                <p className="text-slate-600 mt-1">{advisor.specialty}</p>
              )}
            </div>

            {advisor.bio && (
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Bio</p>
                <p className="text-slate-700">{advisor.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              {advisor.city && (
                <div>
                  <p className="text-xs text-slate-500 font-medium">Location</p>
                  <p className="text-sm text-slate-800">{advisor.city}</p>
                </div>
              )}
              {advisor.experienceYears && (
                <div>
                  <p className="text-xs text-slate-500 font-medium">Experience</p>
                  <p className="text-sm text-slate-800">{advisor.experienceYears} years</p>
                </div>
              )}
              {advisor.rating && (
                <div>
                  <p className="text-xs text-slate-500 font-medium">Rating</p>
                  <p className="text-sm text-slate-800">{advisor.rating} ★</p>
                </div>
              )}
              {advisor.feeLkr && (
                <div>
                  <p className="text-xs text-slate-500 font-medium">Fee</p>
                  <p className="text-sm text-slate-800">LKR {advisor.feeLkr}</p>
                </div>
              )}
            </div>

            {advisor.languages && advisor.languages.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Languages</p>
                <p className="text-sm text-slate-800">
                  {Array.isArray(advisor.languages) ? advisor.languages.join(', ') : advisor.languages}
                </p>
              </div>
            )}

            {advisor.virtual !== undefined && (
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Consultation Type</p>
                <p className="text-sm text-slate-800">
                  {advisor.virtual ? 'Virtual Consultations Available' : 'In-person Consultations'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact & Booking Details Section */}
        <div className="space-y-6">
          {/* Contact Details */}
          <div className="card space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800">Contact Details</h2>
            <div className="space-y-3">
              {advisor.contactEmail && (
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Email</p>
                  <a
                    href={`mailto:${advisor.contactEmail}`}
                    className="text-sm text-brand-primary hover:text-brand-dark break-all"
                  >
                    {advisor.contactEmail}
                  </a>
                </div>
              )}
              {advisor.calendarUrl && (
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Calendar</p>
                  <a
                    href={advisor.calendarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-brand-primary hover:text-brand-dark break-all"
                  >
                    View Calendar →
                  </a>
                </div>
              )}
              {!advisor.contactEmail && !advisor.calendarUrl && (
                <p className="text-sm text-slate-500">Contact details will be shared after confirmation</p>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="card space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800">Booking Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Appointment ID</p>
                <p className="text-sm text-slate-800 font-mono">{appointment._id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Scheduled Date & Time</p>
                <p className="text-sm text-slate-800 font-semibold">
                  {new Date(appointment.scheduledFor).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Status</p>
                <p className="text-sm text-slate-800 capitalize">{appointment.status}</p>
              </div>
              {appointment.notes && (
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Notes</p>
                  <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">{appointment.notes}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Booked On</p>
                <p className="text-sm text-slate-800">
                  {new Date(appointment.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="card bg-gradient-to-r from-brand-primary/10 to-brand-primary/5">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Next Steps</h3>
            <div className="space-y-2 text-sm text-slate-700">
              <p>• You will receive a confirmation email shortly</p>
              <p>• The advisor will contact you before the scheduled time</p>
              <p>• Prepare any questions or health information you'd like to discuss</p>
              {advisor.virtual && (
                <p>• A meeting link will be sent to you for the virtual consultation</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;

