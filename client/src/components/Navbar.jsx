import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice.js';

const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-full text-sm font-medium transition ${
        isActive ? 'bg-brand-primary text-white shadow-md shadow-teal-200' : 'text-slate-600 hover:bg-slate-100'
      }`
    }
  >
    {label}
  </NavLink>
);

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Different navigation links for admin vs user
  const links = user?.role === 'admin' 
    ? [
        { to: '/admin', label: 'Admin Dashboard' }
      ]
    : [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/foods', label: 'Foods' },
        { to: '/meals', label: 'Meals' },
        { to: '/advisors', label: 'Advisors' },
        { to: '/profile', label: 'Profile' }
      ];

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-brand-primary text-white flex items-center justify-center font-bold">
            NA
          </div>
          <div>
            <p className="text-slate-900 font-semibold">NutriLanka</p>
            <p className="text-xs text-slate-500">Sri Lankan Diets</p>
          </div>
        </div>
        {token ? (
          <div className="flex items-center gap-2">
            {links.map((link) => (
              <NavItem key={link.to} to={link.to} label={link.label} />
            ))}
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-brand-dark"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-2">
            <NavLink
              to="/login"
              className="px-4 py-2 rounded-full text-sm font-semibold bg-brand-primary text-white shadow-lg shadow-teal-200 hover:bg-brand-dark transition"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="px-4 py-2 rounded-full text-sm font-semibold border border-brand-primary text-brand-primary hover:bg-teal-50 transition"
            >
              Register
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

