import { Link } from 'react-router-dom';

const Landing = () => {
    const features = [
        {
            icon: '🍛',
            title: 'Sri Lankan Food Database',
            description: 'Explore 80+ authentic Sri Lankan dishes with detailed nutrition information, ratings, and cultural context.'
        },
        {
            icon: '📊',
            title: 'Smart Analytics',
            description: 'Track your 7-day calorie intake, monitor macros, and see your progress with beautiful visualizations.'
        },
        {
            icon: '💡',
            title: 'AI-Powered Tips',
            description: 'Get personalized smart tips and healthier food swap suggestions tailored to your goals.'
        },
        {
            icon: '📝',
            title: 'Meal Logging',
            description: 'Log your breakfast, lunch, and dinner with automatic calorie and macro calculations.'
        },
        {
            icon: '👨‍⚕️',
            title: 'Expert Advisors',
            description: 'Connect with certified nutrition advisors, book appointments, and get professional guidance.'
        },
        {
            icon: '🛒',
            title: 'Healthy Shops',
            description: 'Discover healthy food shops in Sri Lanka with map links and curated recommendations.'
        }
    ];

    const tips = [
        {
            text: 'Start your day with a balanced breakfast including protein, carbs, and healthy fats.',
            color: 'bg-blue-50 border-blue-200'
        },
        {
            text: 'Traditional Sri Lankan rice and curry can be healthy when portion-controlled and balanced.',
            color: 'bg-green-50 border-green-200'
        },
        {
            text: 'Stay hydrated! Aim for 8-10 glasses of water daily, especially in tropical climates.',
            color: 'bg-cyan-50 border-cyan-200'
        },
        {
            text: 'Include local vegetables like gotukola, murunga, and kankun in your meals for added nutrition.',
            color: 'bg-orange-50 border-orange-200'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-green-50/30">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-brand-dark/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
                                    Your Personal
                                    <span className="block text-brand-primary">Sri Lankan</span>
                                    <span className="block">Nutrition Coach</span>
                                </h1>
                                <p className="text-xl text-slate-600 leading-relaxed">
                                    Discover authentic Sri Lankan cuisine, track your meals, and achieve your health goals with
                                    culturally-aware nutrition guidance powered by AI and expert advisors.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/register"
                                    className="px-8 py-4 bg-brand-primary text-white rounded-xl font-semibold text-lg shadow-lg shadow-brand-primary/30 hover:bg-brand-dark transition-all duration-300 transform hover:scale-105 text-center"
                                >
                                    Get Started Free
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-8 py-4 bg-white text-brand-primary border-2 border-brand-primary rounded-xl font-semibold text-lg hover:bg-brand-primary hover:text-white transition-all duration-300 transform hover:scale-105 text-center"
                                >
                                    Sign In
                                </Link>
                            </div>

                            <div className="flex items-center gap-6 pt-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-brand-primary">80+</div>
                                    <div className="text-sm text-slate-600">Foods</div>
                                </div>
                                <div className="h-12 w-px bg-slate-300"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-brand-primary">24/7</div>
                                    <div className="text-sm text-slate-600">AI Support</div>
                                </div>
                                <div className="h-12 w-px bg-slate-300"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-brand-primary">100%</div>
                                    <div className="text-sm text-slate-600">Free</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Hero Image */}
                        <div className="relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop&q=80"
                                    alt="Healthy Sri Lankan Food"
                                    className="w-full h-[500px] object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-primary/20 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-brand-dark/20 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Everything You Need for
                            <span className="text-brand-primary"> Healthy Living</span>
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            A comprehensive platform designed specifically for Sri Lankan cuisine and lifestyle
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100"
                            >
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tips Section */}
            <section className="py-20 bg-gradient-to-br from-brand-primary/5 to-brand-dark/5">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Quick Nutrition <span className="text-brand-primary">Tips</span>
                        </h2>
                        <p className="text-xl text-slate-600">
                            Start your journey with these helpful insights
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {tips.map((tip, index) => (
                            <div
                                key={index}
                                className={`p-6 rounded-xl border-2 ${tip.color} transform hover:scale-105 transition-all duration-300`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-2xl">💚</div>
                                    <p className="text-slate-800 font-medium leading-relaxed">{tip.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-brand-primary to-brand-dark">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Transform Your Health?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who are already on their journey to better nutrition with
                        culturally-relevant Sri Lankan meal planning.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-white text-brand-primary rounded-xl font-semibold text-lg shadow-xl hover:bg-slate-50 transition-all duration-300 transform hover:scale-105"
                        >
                            Create Free Account
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;

