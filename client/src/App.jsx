import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Foods from './pages/Foods.jsx';
import FoodDetail from './pages/FoodDetail.jsx';
import Meals from './pages/Meals.jsx';
import AdvisorDirectory from './pages/AdvisorDirectory.jsx';
import Shops from './pages/Shops.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import BookingDetails from './pages/BookingDetails.jsx';
import { fetchProfile } from './slices/authSlice.js';

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route
            path="/"
            element={
              token && user ? (
                <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute userOnly>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute userOnly>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute userOnly>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foods"
            element={
              <ProtectedRoute userOnly>
                <Foods />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foods/:id"
            element={
              <ProtectedRoute userOnly>
                <FoodDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meals"
            element={
              <ProtectedRoute userOnly>
                <Meals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/advisors"
            element={
              <ProtectedRoute userOnly>
                <AdvisorDirectory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shops"
            element={
              <ProtectedRoute userOnly>
                <Shops />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/:id"
            element={
              <ProtectedRoute userOnly>
                <BookingDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
