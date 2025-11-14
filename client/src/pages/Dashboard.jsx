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
            <section className="card bg-gradient-to-r from-teal-50 to-white">
                <p className="text-sm text-brand-dark uppercase tracking-wide">Nutrition Advisor</p>
                <h1 className="text-3xl font-semibold text-slate-900 mt-2">
                    Ayubowan {user?.name?.split(' ')[0] || 'friend'} 👋
                </h1>
                <p className="text-slate-600 mt-2 max-w-2xl">
                    Keep your Sri Lankan meals balanced with analytics, cultural swaps, and advisor support.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                        to="/meals"
                        className="px-4 py-2 rounded-full bg-brand-primary text-white text-sm font-semibold hover:bg-brand-dark"
                    >
                        Log a meal
                    </Link>
                    <Link
                        to="/foods"
                        className="px-4 py-2 rounded-full border border-brand-primary text-brand-primary text-sm font-semibold hover:bg-brand-primary hover:text-white"
                    >
                        Browse foods
                    </Link>
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

