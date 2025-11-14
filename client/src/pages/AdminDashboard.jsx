import { useEffect, useState } from 'react';
import api from '../services/api.js';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('foods');
    const [pendingFoods, setPendingFoods] = useState([]);
    const [kpis, setKpis] = useState(null);
    const [status, setStatus] = useState('idle');
    const [form, setForm] = useState({
        name: '',
        specialty: '',
        city: '',
        languages: 'Sinhala, English',
        bio: '',
        feeLkr: 3500
    });
    const [adminForm, setAdminForm] = useState({
        name: '',
        email: '',
        password: ''
    });

    const loadData = async () => {
        setStatus('loading');
        try {
            const [foodsRes, kpiRes] = await Promise.all([
                api.get('/admin/foods/pending'),
                api.get('/admin/kpis')
            ]);
            setPendingFoods(foodsRes.data.foods);
            setKpis(kpiRes.data);
            setStatus('succeeded');
        } catch (error) {
            console.error(error);
            setStatus('failed');
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const approveFood = async (id) => {
        await api.post(`/admin/foods/${id}/approve`);
        setPendingFoods((prev) => prev.filter((food) => food._id !== id));
    };

    const handleAdvisorSubmit = async (e) => {
        e.preventDefault();
        await api.post('/admin/advisors', {
            ...form,
            languages: form.languages.split(',').map((lang) => lang.trim())
        });
        setForm({
            name: '',
            specialty: '',
            city: '',
            languages: 'Sinhala, English',
            bio: '',
            feeLkr: 3500
        });
        loadData();
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/admins', adminForm);
            setAdminForm({ name: '', email: '', password: '' });
            alert('Admin created successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create admin');
        }
    };

    const tabs = [
        { id: 'foods', label: 'Pending Foods' },
        { id: 'admin', label: 'Add Admin' },
        { id: 'advisor', label: 'Add Advisor' }
    ];

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-2xl font-semibold text-slate-900">Admin dashboard</h2>
                <p className="text-slate-500">
                    Approve user foods, onboard advisors, and monitor Nutrition Advisor KPIs.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['pendingFoods', 'advisorCount', 'appointmentCount', 'userCount'].map((key) => (
                    <div key={key} className="card text-center">
                        <p className="text-sm text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-2xl font-semibold text-slate-900">{kpis?.[key] ?? '—'}</p>
                    </div>
                ))}
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-200">
                <div className="flex space-x-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 text-sm font-semibold transition ${
                                activeTab === tab.id
                                    ? 'border-b-2 border-brand-primary text-brand-primary'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="card">
                {activeTab === 'foods' && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-800">Pending foods</h3>
                            <button
                                className="text-sm text-brand-dark hover:text-brand-primary"
                                type="button"
                                onClick={loadData}
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Loading...' : 'Refresh'}
                            </button>
                        </div>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {pendingFoods.map((food) => (
                                <div key={food._id} className="border border-slate-100 rounded-xl p-4 hover:border-brand-primary transition">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-800">{food.name}</p>
                                            <p className="text-sm text-slate-500 mt-1">{food.description}</p>
                                            <div className="flex gap-2 mt-2 text-xs text-slate-600">
                                                <span>{food.calories} kcal</span>
                                                <span>•</span>
                                                <span>{food.category}</span>
                                                <span>•</span>
                                                <span className={`px-2 py-0.5 rounded-full ${
                                                    food.rating === 'good' ? 'bg-green-100 text-green-700' :
                                                    food.rating === 'moderate' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-rose-100 text-rose-700'
                                                }`}>
                                                    {food.rating}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => approveFood(food._id)}
                                            className="ml-4 px-4 py-2 rounded-full bg-brand-primary text-white text-sm font-semibold hover:bg-brand-dark transition"
                                        >
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {!pendingFoods.length && (
                                <p className="text-slate-500 text-sm text-center py-8">No pending foods 🎉</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'admin' && (
                    <form className="space-y-4 max-w-md" onSubmit={handleAdminSubmit}>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-1">Create new admin</h3>
                            <p className="text-xs text-slate-500">Admins can only be created here, not via registration.</p>
                        </div>
                        {['name', 'email', 'password'].map((field) => (
                            <div key={field}>
                                <label className="text-sm text-slate-600 capitalize font-medium">{field}</label>
                                <input
                                    type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                                    value={adminForm[field]}
                                    onChange={(e) => setAdminForm((prev) => ({ ...prev, [field]: e.target.value }))}
                                    className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                    required
                                    placeholder={`Enter ${field}`}
                                />
                            </div>
                        ))}
                        <button
                            type="submit"
                            className="w-full bg-brand-primary text-white py-3 rounded-xl font-semibold hover:bg-brand-dark transition"
                        >
                            Create admin
                        </button>
                    </form>
                )}

                {activeTab === 'advisor' && (
                    <form className="space-y-4 max-w-md" onSubmit={handleAdvisorSubmit}>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-1">Add advisor</h3>
                            <p className="text-xs text-slate-500">Create a new nutrition advisor profile.</p>
                        </div>
                        {['name', 'specialty', 'city', 'languages'].map((field) => (
                            <div key={field}>
                                <label className="text-sm text-slate-600 capitalize font-medium">{field}</label>
                                <input
                                    type="text"
                                    value={form[field]}
                                    onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                                    className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                    required={field !== 'languages'}
                                    placeholder={field === 'languages' ? 'e.g., Sinhala, English' : `Enter ${field}`}
                                />
                            </div>
                        ))}
                        <div>
                            <label className="text-sm text-slate-600 font-medium">Fee (LKR)</label>
                            <input
                                type="number"
                                value={form.feeLkr}
                                onChange={(e) => setForm((prev) => ({ ...prev, feeLkr: Number(e.target.value) }))}
                                className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                placeholder="3500"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 font-medium">Short bio</label>
                            <textarea
                                value={form.bio}
                                onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                                className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                rows="4"
                                placeholder="Enter advisor's bio..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-brand-primary text-white py-3 rounded-xl font-semibold hover:bg-brand-dark transition"
                        >
                            Save advisor
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

