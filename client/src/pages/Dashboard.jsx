import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AnalyticsChart from '../components/AnalyticsChart.jsx';
import { fetchWeeklyAnalytics } from '../slices/analyticsSlice.js';
import { fetchMeals } from '../slices/mealsSlice.js';

const StatCard = ({ label, value, suffix, accent }) => (
    <div className="card">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-3xl font-semibold text-slate-900">
            {value}
            <span className="text-base font-medium text-slate-500 ml-1">{suffix}</span>
        </p>
        {accent && <p className="text-xs text-teal-600 mt-2">{accent}</p>}
    </div>
);

const Dashboard = () => {
    const dispatch = useDispatch();
    const { summary, trend } = useSelector((state) => state.analytics);
    const meals = useSelector((state) => state.meals.logs);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchWeeklyAnalytics());
        dispatch(fetchMeals());
    }, [dispatch]);

    return (
        <div className="space-y-6">
            {/* Creative Header Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-primary via-brand-primary/90 to-brand-dark text-white p-8 md:p-12 shadow-2xl">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-0">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-xl">
                            NL
                        </div>
                        <p className="text-sm text-white/80 uppercase tracking-wider font-medium">NutriLanka</p>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Ayubowan, {user?.name?.split(' ')[0] || 'friend'}! 👋
                    </h1>

                    <p className="text-lg text-white/90 mb-6 max-w-2xl leading-relaxed">
                        Transform your health journey with <span className="font-semibold">culturally-aware nutrition</span>.
                        Discover authentic Sri Lankan meals, track your progress, and connect with expert advisors.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/meals"
                            className="px-6 py-3 rounded-full bg-white text-brand-primary text-sm font-semibold hover:bg-white/90 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        >
                            Log a Meal
                        </Link>
                        <Link
                            to="/foods"
                            className="px-6 py-3 rounded-full border-2 border-white/30 text-white text-sm font-semibold hover:bg-white/10 backdrop-blur-sm transition-all"
                        >
                            🔍 Explore Foods
                        </Link>
                        <Link
                            to="/advisors"
                            className="px-6 py-3 rounded-full border-2 border-white/30 text-white text-sm font-semibold hover:bg-white/10 backdrop-blur-sm transition-all"
                        >
                            👨‍⚕️ Find Advisor
                        </Link>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20">
                        <div>
                            <p className="text-2xl font-bold">{summary?.totalCalories || 0}</p>
                            <p className="text-xs text-white/70 uppercase tracking-wide">Weekly Calories</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{meals.length || 0}</p>
                            <p className="text-xs text-white/70 uppercase tracking-wide">Meals Logged</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{summary?.swapsAccepted || 0}</p>
                            <p className="text-xs text-white/70 uppercase tracking-wide">Smart Swaps</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    label="Weekly calories"
                    value={summary?.totalCalories || 0}
                    suffix="kcal"
                    accent="Track vs target 11,200 kcal/week"
                />
                <StatCard
                    label="Average per day"
                    value={summary?.averageCalories || 0}
                    suffix="kcal"
                    accent="Based on last 7 days"
                />
                <StatCard
                    label="Swaps accepted"
                    value={summary?.swapsAccepted || 0}
                    suffix="times"
                    accent="Smart swaps reduce sugar/fat"
                />
            </section>

            <AnalyticsChart data={trend} />

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">Recent meals</h3>
                        <Link to="/meals" className="text-sm text-brand-dark font-medium hover:text-brand-primary">
                            View all
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {meals.slice(0, 4).map((meal) => (
                            <div
                                key={meal._id}
                                className="border border-slate-100 rounded-xl px-3 py-2 text-sm text-slate-600"
                            >
                                <p className="font-semibold text-slate-800 capitalize">{meal.mealType}</p>
                                <p>
                                    {meal.totalCalories} kcal • {meal.foods?.map((f) => f.foodName).join(', ')}
                                </p>
                            </div>
                        ))}
                        {!meals.length && <p className="text-slate-500 text-sm">Log a meal to see analytics.</p>}
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Meal plans</h3>
                    <div className="space-y-3">
                        {[
                            { title: 'Weight-loss plan', detail: 'Red rice + mallung + lean fish (350 kcal)' },
                            { title: 'Diabetes control', detail: 'Kurakkan roti + dhal + gotukola (320 kcal)' },
                            { title: 'Student fuel', detail: 'Kottu lite + herbal tea (550 kcal)' }
                        ].map((plan) => (
                            <div key={plan.title} className="border border-slate-100 rounded-xl px-3 py-2">
                                <p className="font-semibold text-slate-800">{plan.title}</p>
                                <p className="text-sm text-slate-500">{plan.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;

