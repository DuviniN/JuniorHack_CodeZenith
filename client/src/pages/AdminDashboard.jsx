import { useEffect, useState } from 'react';
import api from '../services/api.js';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('foods');
    const [pendingFoods, setPendingFoods] = useState([]);
    const [approvedFoods, setApprovedFoods] = useState([]);
    const [kpis, setKpis] = useState(null);
    const [status, setStatus] = useState('idle');
    const [admins, setAdmins] = useState([]);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [advisors, setAdvisors] = useState([]);
    const [editingAdvisor, setEditingAdvisor] = useState(null);
    const [users, setUsers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [shops, setShops] = useState([]);
    const [editingShop, setEditingShop] = useState(null);
    const [pendingFoodsSearch, setPendingFoodsSearch] = useState('');
    const [approvedFoodsSearch, setApprovedFoodsSearch] = useState('');
    const [form, setForm] = useState({
        name: '',
        specialty: '',
        city: '',
        languages: 'Sinhala, English',
        bio: '',
        feeLkr: 3500
    });
    const [editAdvisorForm, setEditAdvisorForm] = useState({
        name: '',
        specialty: '',
        city: '',
        languages: 'Sinhala, English',
        bio: '',
        feeLkr: 3500,
        experienceYears: '',
        contactEmail: '',
        virtual: true,
        rating: 4.8,
        calendarUrl: ''
    });
    const [adminForm, setAdminForm] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [editAdminForm, setEditAdminForm] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [shopForm, setShopForm] = useState({
        name: '',
        city: '',
        websiteUrl: '',
        mapUrl: '',
        specialties: '',
        description: '',
        phone: '',
        email: ''
    });
    const [editShopForm, setEditShopForm] = useState({
        name: '',
        city: '',
        websiteUrl: '',
        mapUrl: '',
        specialties: '',
        description: '',
        phone: '',
        email: ''
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

    const loadAdmins = async () => {
        try {
            const res = await api.get('/admin/admins');
            setAdmins(res.data.admins);
        } catch (error) {
            console.error(error);
            alert('Failed to load admins');
        }
    };

    const loadAdvisors = async () => {
        try {
            const res = await api.get('/admin/advisors');
            setAdvisors(res.data.advisors);
        } catch (error) {
            console.error(error);
            alert('Failed to load advisors');
        }
    };

    const loadUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.users);
        } catch (error) {
            console.error(error);
            alert('Failed to load users');
        }
    };

    const loadShops = async () => {
        try {
            const res = await api.get('/admin/shops');
            setShops(res.data.shops);
        } catch (error) {
            console.error(error);
            alert('Failed to load shops');
        }
    };

    const loadAppointments = async () => {
        try {
            const res = await api.get('/admin/appointments');
            setAppointments(res.data.appointments);
        } catch (error) {
            console.error(error);
            alert('Failed to load appointments');
        }
    };

    const loadApprovedFoods = async () => {
        try {
            const res = await api.get('/admin/foods/approved');
            setApprovedFoods(res.data.foods);
        } catch (error) {
            console.error(error);
            alert('Failed to load approved foods');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }
        try {
            await api.delete(`/admin/users/${id}`);
            alert('User deleted successfully!');
            loadUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleShopSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/shops', {
                ...shopForm,
                specialties: shopForm.specialties ? shopForm.specialties.split(',').map((item) => item.trim()) : []
            });
            setShopForm({
                name: '',
                city: '',
                websiteUrl: '',
                mapUrl: '',
                specialties: '',
                description: '',
                phone: '',
                email: ''
            });
            alert('Shop created successfully!');
            loadShops();
            setActiveTab('manageShops');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create shop');
        }
    };

    const handleEditShop = (shop) => {
        setEditingShop(shop._id);
        setEditShopForm({
            name: shop.name || '',
            city: shop.city || '',
            websiteUrl: shop.websiteUrl || '',
            mapUrl: shop.mapUrl || '',
            specialties: Array.isArray(shop.specialties) ? shop.specialties.join(', ') : shop.specialties || '',
            description: shop.description || '',
            phone: shop.phone || '',
            email: shop.email || ''
        });
    };

    const handleUpdateShop = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/admin/shops/${editingShop}`, {
                ...editShopForm,
                specialties: editShopForm.specialties ? editShopForm.specialties.split(',').map((item) => item.trim()) : []
            });
            setEditingShop(null);
            setEditShopForm({
                name: '',
                city: '',
                websiteUrl: '',
                mapUrl: '',
                specialties: '',
                description: '',
                phone: '',
                email: ''
            });
            alert('Shop updated successfully!');
            loadShops();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update shop');
        }
    };

    const handleDeleteShop = async (id) => {
        if (!window.confirm('Are you sure you want to delete this shop?')) {
            return;
        }
        try {
            await api.delete(`/admin/shops/${id}`);
            alert('Shop deleted successfully!');
            loadShops();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete shop');
        }
    };

    const filteredPendingFoods = pendingFoods.filter((food) =>
        food.name.toLowerCase().includes(pendingFoodsSearch.toLowerCase()) ||
        (food.description && food.description.toLowerCase().includes(pendingFoodsSearch.toLowerCase())) ||
        (food.category && food.category.toLowerCase().includes(pendingFoodsSearch.toLowerCase()))
    );

    const filteredApprovedFoods = approvedFoods.filter((food) =>
        food.name.toLowerCase().includes(approvedFoodsSearch.toLowerCase()) ||
        (food.description && food.description.toLowerCase().includes(approvedFoodsSearch.toLowerCase())) ||
        (food.category && food.category.toLowerCase().includes(approvedFoodsSearch.toLowerCase()))
    );

    useEffect(() => {
        loadData();
        loadAdmins();
        loadAdvisors();
    }, []);

    useEffect(() => {
        if (activeTab === 'manageAdmins') {
            loadAdmins();
        }
        if (activeTab === 'manageAdvisors') {
            loadAdvisors();
        }
        if (activeTab === 'approvedFoods') {
            loadApprovedFoods();
        }
        if (activeTab === 'manageUsers') {
            loadUsers();
        }
        if (activeTab === 'shop' || activeTab === 'manageShops') {
            loadShops();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const approveFood = async (id) => {
        await api.post(`/admin/foods/${id}/approve`);
        setPendingFoods((prev) => prev.filter((food) => food._id !== id));
        loadApprovedFoods(); // Refresh approved foods list
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
        loadAdvisors();
    };

    const handleEditAdvisor = (advisor) => {
        setEditingAdvisor(advisor._id);
        setEditAdvisorForm({
            name: advisor.name || '',
            specialty: advisor.specialty || '',
            city: advisor.city || '',
            languages: Array.isArray(advisor.languages) ? advisor.languages.join(', ') : advisor.languages || 'Sinhala, English',
            bio: advisor.bio || '',
            feeLkr: advisor.feeLkr || 3500,
            experienceYears: advisor.experienceYears || '',
            contactEmail: advisor.contactEmail || '',
            virtual: advisor.virtual !== undefined ? advisor.virtual : true,
            rating: advisor.rating || 4.8,
            calendarUrl: advisor.calendarUrl || ''
        });
    };

    const handleUpdateAdvisor = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/admin/advisors/${editingAdvisor}`, {
                ...editAdvisorForm,
                languages: editAdvisorForm.languages.split(',').map((lang) => lang.trim())
            });
            setEditingAdvisor(null);
            setEditAdvisorForm({
                name: '',
                specialty: '',
                city: '',
                languages: 'Sinhala, English',
                bio: '',
                feeLkr: 3500,
                experienceYears: '',
                contactEmail: '',
                virtual: true,
                rating: 4.8,
                calendarUrl: ''
            });
            alert('Advisor updated successfully!');
            loadAdvisors();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update advisor');
        }
    };

    const handleDeleteAdvisor = async (id) => {
        if (!window.confirm('Are you sure you want to delete this advisor?')) {
            return;
        }
        try {
            await api.delete(`/admin/advisors/${id}`);
            alert('Advisor deleted successfully!');
            loadAdvisors();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete advisor');
        }
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/admins', adminForm);
            setAdminForm({ name: '', email: '', password: '' });
            alert('Admin created successfully!');
            loadAdmins();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create admin');
        }
    };

    const handleEditAdmin = (admin) => {
        setEditingAdmin(admin._id);
        setEditAdminForm({
            name: admin.name,
            email: admin.email,
            password: ''
        });
    };

    const handleUpdateAdmin = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/admin/admins/${editingAdmin}`, editAdminForm);
            setEditingAdmin(null);
            setEditAdminForm({ name: '', email: '', password: '' });
            alert('Admin updated successfully!');
            loadAdmins();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update admin');
        }
    };

    const handleDeleteAdmin = async (id) => {
        if (!window.confirm('Are you sure you want to delete this admin?')) {
            return;
        }
        try {
            await api.delete(`/admin/admins/${id}`);
            alert('Admin deleted successfully!');
            loadAdmins();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete admin');
        }
    };

    const tabs = [
        { id: 'foods', label: 'Pending Foods' },
        { id: 'approvedFoods', label: 'Approved Foods' },
        { id: 'admin', label: 'Add Admin' },
        { id: 'manageAdmins', label: 'Manage Admins' },
        { id: 'advisor', label: 'Add Advisor' },
        { id: 'manageAdvisors', label: 'Manage Advisors' },
        { id: 'manageUsers', label: 'Manage Users' },
        { id: 'shop', label: 'Add Shop' },
        { id: 'manageShops', label: 'Manage Shops' }
    ];

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-2xl font-semibold text-slate-900">Admin dashboard</h2>
                <p className="text-slate-500">
                    Approve user foods, onboard advisors, and monitor NutriLanka KPIs.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { key: 'pendingFoods', label: 'Pending Foods' },
                    { key: 'advisorCount', label: 'Advisors' },
                    { key: 'appointmentCount', label: 'Appointments' },
                    { key: 'userCount', label: 'Users' }
                ].map((item) => (
                    <div
                        key={item.key}
                        className="card text-center"
                    >
                        <p className="text-sm text-slate-500">{item.label}</p>
                        <p className="text-2xl font-semibold text-slate-900">{kpis?.[item.key] ?? '—'}</p>
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
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search pending foods by name, description, or category..."
                                value={pendingFoodsSearch}
                                onChange={(e) => setPendingFoodsSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                            />
                        </div>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {filteredPendingFoods.map((food) => (
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
                            {!filteredPendingFoods.length && pendingFoods.length > 0 && (
                                <p className="text-slate-500 text-sm text-center py-8">No foods match your search</p>
                            )}
                            {!pendingFoods.length && (
                                <p className="text-slate-500 text-sm text-center py-8">No pending foods 🎉</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'approvedFoods' && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-800">Approved foods</h3>
                            <button
                                className="text-sm text-brand-dark hover:text-brand-primary"
                                type="button"
                                onClick={loadApprovedFoods}
                            >
                                Refresh
                            </button>
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search approved foods by name, description, or category..."
                                value={approvedFoodsSearch}
                                onChange={(e) => setApprovedFoodsSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                            />
                        </div>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {filteredApprovedFoods.map((food) => (
                                <div key={food._id} className="border border-slate-100 rounded-xl p-4 hover:border-brand-primary transition">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-semibold text-slate-800">{food.name}</p>
                                                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
                                                    Approved
                                                </span>
                                            </div>
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
                                            {food.createdAt && (
                                                <p className="text-xs text-slate-400 mt-2">
                                                    Approved: {new Date(food.createdAt).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!filteredApprovedFoods.length && approvedFoods.length > 0 && (
                                <p className="text-slate-500 text-sm text-center py-8">No foods match your search</p>
                            )}
                            {!approvedFoods.length && (
                                <p className="text-slate-500 text-sm text-center py-8">No approved foods yet</p>
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

                {activeTab === 'manageAdmins' && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-800">All Admins</h3>
                            <button
                                className="text-sm text-brand-dark hover:text-brand-primary"
                                type="button"
                                onClick={loadAdmins}
                            >
                                Refresh
                            </button>
                        </div>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {admins.map((admin) => (
                                <div key={admin._id} className="border border-slate-100 rounded-xl p-4 hover:border-brand-primary transition">
                                    {editingAdmin === admin._id ? (
                                        <form onSubmit={handleUpdateAdmin} className="space-y-3">
                                            <div>
                                                <label className="text-sm text-slate-600 font-medium">Name</label>
                                                <input
                                                    type="text"
                                                    value={editAdminForm.name}
                                                    onChange={(e) => setEditAdminForm((prev) => ({ ...prev, name: e.target.value }))}
                                                    className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-slate-600 font-medium">Email</label>
                                                <input
                                                    type="email"
                                                    value={editAdminForm.email}
                                                    onChange={(e) => setEditAdminForm((prev) => ({ ...prev, email: e.target.value }))}
                                                    className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-slate-600 font-medium">New Password (leave blank to keep current)</label>
                                                <input
                                                    type="password"
                                                    value={editAdminForm.password}
                                                    onChange={(e) => setEditAdminForm((prev) => ({ ...prev, password: e.target.value }))}
                                                    className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                    placeholder="Enter new password (optional)"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 rounded-full bg-brand-primary text-white text-sm font-semibold hover:bg-brand-dark transition"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingAdmin(null);
                                                        setEditAdminForm({ name: '', email: '', password: '' });
                                                    }}
                                                    className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-800">{admin.name}</p>
                                                <p className="text-sm text-slate-500 mt-1">{admin.email}</p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Created: {new Date(admin.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => handleEditAdmin(admin)}
                                                    className="px-4 py-2 rounded-full border border-brand-primary text-brand-primary text-sm font-semibold hover:bg-brand-primary hover:text-white transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAdmin(admin._id)}
                                                    className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {!admins.length && (
                                <p className="text-slate-500 text-sm text-center py-8">No admins found</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'advisor' && (
                    <form className="space-y-4 max-w-md" onSubmit={handleAdvisorSubmit}>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-1">Add advisor</h3>
                            <p className="text-xs text-slate-500">Create a new advisor profile.</p>
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

                {activeTab === 'manageAdvisors' && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-800">All Advisors</h3>
                            <button
                                className="text-sm text-brand-dark hover:text-brand-primary"
                                type="button"
                                onClick={loadAdvisors}
                            >
                                Refresh
                            </button>
                        </div>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {advisors.map((advisor) => (
                                <div key={advisor._id} className="border border-slate-100 rounded-xl p-4 hover:border-brand-primary transition">
                                    {editingAdvisor === advisor._id ? (
                                        <form onSubmit={handleUpdateAdvisor} className="space-y-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-sm text-slate-600 font-medium">Name</label>
                                                    <input
                                                        type="text"
                                                        value={editAdvisorForm.name}
                                                        onChange={(e) => setEditAdvisorForm((prev) => ({ ...prev, name: e.target.value }))}
                                                        className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm text-slate-600 font-medium">Specialty</label>
                                                    <input
                                                        type="text"
                                                        value={editAdvisorForm.specialty}
                                                        onChange={(e) => setEditAdvisorForm((prev) => ({ ...prev, specialty: e.target.value }))}
                                                        className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm text-slate-600 font-medium">City</label>
                                                    <input
                                                        type="text"
                                                        value={editAdvisorForm.city}
                                                        onChange={(e) => setEditAdvisorForm((prev) => ({ ...prev, city: e.target.value }))}
                                                        className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm text-slate-600 font-medium">Languages</label>
                                                    <input
                                                        type="text"
                                                        value={editAdvisorForm.languages}
                                                        onChange={(e) => setEditAdvisorForm((prev) => ({ ...prev, languages: e.target.value }))}
                                                        className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                        placeholder="e.g., Sinhala, English"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm text-slate-600 font-medium">Fee (LKR)</label>
                                                    <input
                                                        type="number"
                                                        value={editAdvisorForm.feeLkr}
                                                        onChange={(e) => setEditAdvisorForm((prev) => ({ ...prev, feeLkr: Number(e.target.value) }))}
                                                        className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm text-slate-600 font-medium">Experience Years</label>
                                                    <input
                                                        type="number"
                                                        value={editAdvisorForm.experienceYears}
                                                        onChange={(e) => setEditAdvisorForm((prev) => ({ ...prev, experienceYears: Number(e.target.value) }))}
                                                        className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm text-slate-600 font-medium">Contact Email</label>
                                                    <input
                                                        type="email"
                                                        value={editAdvisorForm.contactEmail}
                                                        onChange={(e) => setEditAdvisorForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                                                        className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm text-slate-600 font-medium">Rating</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="5"
                                                        value={editAdvisorForm.rating}
                                                        onChange={(e) => setEditAdvisorForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                                                        className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm text-slate-600 font-medium">Calendar URL</label>
                                                    <input
                                                        type="url"
                                                        value={editAdvisorForm.calendarUrl}
                                                        onChange={(e) => setEditAdvisorForm((prev) => ({ ...prev, calendarUrl: e.target.value }))}
                                                        className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={editAdvisorForm.virtual}
                                                        onChange={(e) => setEditAdvisorForm((prev) => ({ ...prev, virtual: e.target.checked }))}
                                                        className="rounded border-slate-200"
                                                    />
                                                    <label className="text-sm text-slate-600 font-medium">Virtual Consultations</label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm text-slate-600 font-medium">Bio</label>
                                                <textarea
                                                    value={editAdvisorForm.bio}
                                                    onChange={(e) => setEditAdvisorForm((prev) => ({ ...prev, bio: e.target.value }))}
                                                    className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                    rows="3"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 rounded-full bg-brand-primary text-white text-sm font-semibold hover:bg-brand-dark transition"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingAdvisor(null);
                                                        setEditAdvisorForm({
                                                            name: '',
                                                            specialty: '',
                                                            city: '',
                                                            languages: 'Sinhala, English',
                                                            bio: '',
                                                            feeLkr: 3500,
                                                            experienceYears: '',
                                                            contactEmail: '',
                                                            virtual: true,
                                                            rating: 4.8,
                                                            calendarUrl: ''
                                                        });
                                                    }}
                                                    className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-800">{advisor.name}</p>
                                                <p className="text-sm text-slate-500 mt-1">
                                                    {advisor.specialty && <span>{advisor.specialty}</span>}
                                                    {advisor.specialty && advisor.city && <span> • </span>}
                                                    {advisor.city && <span>{advisor.city}</span>}
                                                </p>
                                                {advisor.languages && advisor.languages.length > 0 && (
                                                    <p className="text-sm text-slate-500 mt-1">
                                                        Languages: {Array.isArray(advisor.languages) ? advisor.languages.join(', ') : advisor.languages}
                                                    </p>
                                                )}
                                                {advisor.bio && (
                                                    <p className="text-sm text-slate-600 mt-1">{advisor.bio}</p>
                                                )}
                                                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                                                    {advisor.feeLkr && <span>Fee: LKR {advisor.feeLkr}</span>}
                                                    {advisor.experienceYears && <span>Experience: {advisor.experienceYears} years</span>}
                                                    {advisor.rating && <span>Rating: {advisor.rating} ★</span>}
                                                    {advisor.virtual !== undefined && (
                                                        <span>{advisor.virtual ? 'Virtual' : 'In-person'}</span>
                                                    )}
                                                </div>
                                                {advisor.contactEmail && (
                                                    <p className="text-xs text-slate-400 mt-1">{advisor.contactEmail}</p>
                                                )}
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Created: {new Date(advisor.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => handleEditAdvisor(advisor)}
                                                    className="px-4 py-2 rounded-full border border-brand-primary text-brand-primary text-sm font-semibold hover:bg-brand-primary hover:text-white transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAdvisor(advisor._id)}
                                                    className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {!advisors.length && (
                                <p className="text-slate-500 text-sm text-center py-8">No advisors found</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'manageUsers' && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-800">All Users</h3>
                            <button
                                className="text-sm text-brand-dark hover:text-brand-primary"
                                type="button"
                                onClick={loadUsers}
                            >
                                Refresh
                            </button>
                        </div>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {users.filter((user) => user.role !== 'admin').map((user) => (
                                <div key={user._id} className="border border-slate-100 rounded-xl p-4 hover:border-brand-primary transition">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-800">{user.name}</p>
                                            <p className="text-sm text-slate-500 mt-1">{user.email}</p>
                                            <div className="flex gap-2 mt-2 text-xs">
                                                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                                    {user.role?.toUpperCase() || 'USER'}
                                                </span>
                                                {user.onboardingCompleted && (
                                                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                                        Onboarding Complete
                                                    </span>
                                                )}
                                            </div>
                                            {user.onboarding && (
                                                <div className="mt-2 text-xs text-slate-500">
                                                    <p>Age: {user.onboarding.age || 'N/A'}</p>
                                                    <p>Weight: {user.onboarding.weightKg || 'N/A'} kg</p>
                                                    <p>Height: {user.onboarding.heightCm || 'N/A'} cm</p>
                                                    <p>Goal: {user.onboarding.goal || 'N/A'}</p>
                                                </div>
                                            )}
                                            <p className="text-xs text-slate-400 mt-2">
                                                Joined: {new Date(user.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!users.filter((user) => user.role !== 'admin').length && (
                                <p className="text-slate-500 text-sm text-center py-8">No users found</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'shop' && (
                    <form className="space-y-4 max-w-md" onSubmit={handleShopSubmit}>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-1">Add shop</h3>
                            <p className="text-xs text-slate-500">Create a new shop profile.</p>
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 font-medium">Shop Name *</label>
                            <input
                                type="text"
                                value={shopForm.name}
                                onChange={(e) => setShopForm((prev) => ({ ...prev, name: e.target.value }))}
                                className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                required
                                placeholder="Enter shop name"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 font-medium">City *</label>
                            <input
                                type="text"
                                value={shopForm.city}
                                onChange={(e) => setShopForm((prev) => ({ ...prev, city: e.target.value }))}
                                className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                required
                                placeholder="Enter city"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 font-medium">Website URL *</label>
                            <input
                                type="url"
                                value={shopForm.websiteUrl}
                                onChange={(e) => setShopForm((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                                className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                required
                                placeholder="https://example.com"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 font-medium">Map URL (Optional)</label>
                            <input
                                type="url"
                                value={shopForm.mapUrl}
                                onChange={(e) => setShopForm((prev) => ({ ...prev, mapUrl: e.target.value }))}
                                className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                placeholder="https://maps.app.goo.gl/..."
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 font-medium">Specialties (Comma separated)</label>
                            <input
                                type="text"
                                value={shopForm.specialties}
                                onChange={(e) => setShopForm((prev) => ({ ...prev, specialties: e.target.value }))}
                                className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                placeholder="e.g., organic produce, healthy groceries"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 font-medium">Description (Optional)</label>
                            <textarea
                                value={shopForm.description}
                                onChange={(e) => setShopForm((prev) => ({ ...prev, description: e.target.value }))}
                                className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                rows="3"
                                placeholder="Enter shop description..."
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 font-medium">Phone (Optional)</label>
                            <input
                                type="tel"
                                value={shopForm.phone}
                                onChange={(e) => setShopForm((prev) => ({ ...prev, phone: e.target.value }))}
                                className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-600 font-medium">Email (Optional)</label>
                            <input
                                type="email"
                                value={shopForm.email}
                                onChange={(e) => setShopForm((prev) => ({ ...prev, email: e.target.value }))}
                                className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                placeholder="Enter email"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-brand-primary text-white py-3 rounded-xl font-semibold hover:bg-brand-dark transition"
                        >
                            Save shop
                        </button>
                    </form>
                )}

                {activeTab === 'manageShops' && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-800">All Shops</h3>
                            <button
                                className="text-sm text-brand-dark hover:text-brand-primary"
                                type="button"
                                onClick={loadShops}
                            >
                                Refresh
                            </button>
                        </div>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {shops.map((shop) => (
                                <div key={shop._id} className="border border-slate-100 rounded-xl p-4 hover:border-brand-primary transition">
                                    {editingShop === shop._id ? (
                                        <form onSubmit={handleUpdateShop} className="space-y-3">
                                            <div>
                                                <label className="text-sm text-slate-600 font-medium">Shop Name</label>
                                                <input
                                                    type="text"
                                                    value={editShopForm.name}
                                                    onChange={(e) => setEditShopForm((prev) => ({ ...prev, name: e.target.value }))}
                                                    className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-slate-600 font-medium">City</label>
                                                <input
                                                    type="text"
                                                    value={editShopForm.city}
                                                    onChange={(e) => setEditShopForm((prev) => ({ ...prev, city: e.target.value }))}
                                                    className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-slate-600 font-medium">Website URL</label>
                                                <input
                                                    type="url"
                                                    value={editShopForm.websiteUrl}
                                                    onChange={(e) => setEditShopForm((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                                                    className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-slate-600 font-medium">Map URL</label>
                                                <input
                                                    type="url"
                                                    value={editShopForm.mapUrl}
                                                    onChange={(e) => setEditShopForm((prev) => ({ ...prev, mapUrl: e.target.value }))}
                                                    className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-slate-600 font-medium">Specialties (Comma separated)</label>
                                                <input
                                                    type="text"
                                                    value={editShopForm.specialties}
                                                    onChange={(e) => setEditShopForm((prev) => ({ ...prev, specialties: e.target.value }))}
                                                    className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-slate-600 font-medium">Description</label>
                                                <textarea
                                                    value={editShopForm.description}
                                                    onChange={(e) => setEditShopForm((prev) => ({ ...prev, description: e.target.value }))}
                                                    className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                    rows="2"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-slate-600 font-medium">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={editShopForm.phone}
                                                    onChange={(e) => setEditShopForm((prev) => ({ ...prev, phone: e.target.value }))}
                                                    className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-slate-600 font-medium">Email</label>
                                                <input
                                                    type="email"
                                                    value={editShopForm.email}
                                                    onChange={(e) => setEditShopForm((prev) => ({ ...prev, email: e.target.value }))}
                                                    className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 rounded-full bg-brand-primary text-white text-sm font-semibold hover:bg-brand-dark transition"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingShop(null);
                                                        setEditShopForm({
                                                            name: '',
                                                            city: '',
                                                            websiteUrl: '',
                                                            mapUrl: '',
                                                            specialties: '',
                                                            description: '',
                                                            phone: '',
                                                            email: ''
                                                        });
                                                    }}
                                                    className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-800">{shop.name}</p>
                                                <p className="text-sm text-slate-500 mt-1">{shop.city}</p>
                                                <a
                                                    href={shop.websiteUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs text-brand-primary hover:underline mt-1 block"
                                                >
                                                    {shop.websiteUrl}
                                                </a>
                                                {shop.mapUrl && (
                                                    <a
                                                        href={shop.mapUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xs text-slate-500 hover:text-brand-primary mt-1 block"
                                                    >
                                                        View on map
                                                    </a>
                                                )}
                                                {shop.specialties && shop.specialties.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {Array.isArray(shop.specialties) ? (
                                                            shop.specialties.map((specialty, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-700"
                                                                >
                                                                    {specialty}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-700">
                                                                {shop.specialties}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                {shop.description && (
                                                    <p className="text-xs text-slate-500 mt-2">{shop.description}</p>
                                                )}
                                                {(shop.phone || shop.email) && (
                                                    <div className="text-xs text-slate-400 mt-2">
                                                        {shop.phone && <p>Phone: {shop.phone}</p>}
                                                        {shop.email && <p>Email: {shop.email}</p>}
                                                    </div>
                                                )}
                                                <p className="text-xs text-slate-400 mt-2">
                                                    Created: {new Date(shop.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => handleEditShop(shop)}
                                                    className="px-4 py-2 rounded-full border border-brand-primary text-brand-primary text-sm font-semibold hover:bg-brand-primary hover:text-white transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteShop(shop._id)}
                                                    className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {!shops.length && (
                                <p className="text-slate-500 text-sm text-center py-8">No shops found</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

