import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../slices/authSlice.js';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, status, error, user } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(form));
    };

    useEffect(() => {
        if (token && user) {
            // Redirect admins to admin dashboard, users to regular dashboard
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        }
    }, [token, user, navigate]);

    return (
        <div className="max-w-md mx-auto card mt-10">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Welcome back</h2>
            <p className="text-slate-500 mb-6">Access your personalised Sri Lankan diet coach.</p>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="text-sm text-slate-600">Email</label>
                    <input
                        type="email"
                        className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2"
                        value={form.email}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                        required
                    />
                </div>
                <div>
                    <label className="text-sm text-slate-600">Password</label>
                    <input
                        type="password"
                        className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2"
                        value={form.password}
                        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-brand-primary text-white py-2 rounded-xl font-semibold hover:bg-brand-dark transition"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Signing in...' : 'Login'}
                </button>
            </form>
            <p className="text-sm text-center text-slate-500 mt-4">
                First time?{' '}
                <Link className="text-brand-dark font-medium hover:text-brand-primary" to="/register">
                    Create an account
                </Link>
            </p>
        </div>
    );
};

export default Login;

