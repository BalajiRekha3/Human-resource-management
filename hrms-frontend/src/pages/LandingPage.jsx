import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleGetStarted = () => {
        if (isAuthenticated()) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">H</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            HRMS<span className="text-blue-600">Pro</span>
                        </h1>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center text-sm font-medium">
                        <a href="#features" className="text-gray-600 hover:text-blue-600 transition">
                            Features
                        </a>
                        <a href="#solutions" className="text-gray-600 hover:text-blue-600 transition">
                            Solutions
                        </a>
                        <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition">
                            Pricing
                        </a>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28 text-center">
                <div className="animate-fade-in">
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wide text-blue-600 uppercase bg-blue-50 rounded-full">
                        Modern HR Solution
                    </span>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                        Manage your workforce <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            with intelligence
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        The all-in-one platform for employee management, payroll, and performance tracking.
                        Built to scale with your growing business.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={handleGetStarted}
                            className="w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all transform hover:-translate-y-1"
                        >
                            Start Free Trial
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto border-2 border-gray-200 text-gray-700 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 flex items-center justify-center space-x-2 transition"
                        >
                            <span>View Demo</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Features Grid */}
                <div id="features" className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: 'Team Management',
                            desc: 'Easily manage roles, permissions, and employee profiles in one unified dashboard.',
                            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
                            color: 'blue',
                        },
                        {
                            title: 'Smart Analytics',
                            desc: 'Gain deep insights into workforce productivity and attendance with AI-driven reports.',
                            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                            color: 'indigo',
                        },
                        {
                            title: 'Automated Payroll',
                            desc: 'Error-free salary calculations and tax processing with single-click automation.',
                            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                            color: 'purple',
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="group p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300"
                        >
                            <div
                                className={`w-14 h-14 bg-${item.color}-50 rounded-2xl flex items-center justify-center mb-6 mx-auto text-${item.color}-600 group-hover:scale-110 transition-transform`}
                            >
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-400 text-sm">© 2026 HRMS Pro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
