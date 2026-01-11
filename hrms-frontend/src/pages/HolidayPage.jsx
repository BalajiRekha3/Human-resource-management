import React from 'react';
import HolidayCalendar from '../components/calendar/HolidayCalendar';
import { Plus, CalendarDays } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* =======================
   CUSTOM SCROLLBAR STYLE
======================= */
const scrollbarStyle = `
.custom-scroll {
    overflow-y: auto;
}
.custom-scroll::-webkit-scrollbar {
    width: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
    background: rgba(100,116,139,.35);
    border-radius: 10px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(100,116,139,.6);
}
.custom-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(100,116,139,.4) transparent;
}
`;

const HolidayPage = () => {
    const { hasRole } = useAuth();
    const isAdmin = hasRole('ROLE_ADMIN') || hasRole('ROLE_HR');

    const holidays = [
        { id: 1, date: '2026-01-01', name: 'New Year', type: 'OPTIONAL', description: 'New Year Day' },
        { id: 2, date: '2026-01-14', name: 'Makar Sankranti', type: 'FESTIVAL', description: 'Harvest Festival' },
        { id: 3, date: '2026-01-26', name: 'Republic Day', type: 'PUBLIC', description: 'Republic Day of India' },
        { id: 4, date: '2026-03-04', name: 'Holi', type: 'FESTIVAL', description: 'Festival of Colors' },
        { id: 5, date: '2026-03-29', name: 'Good Friday', type: 'PUBLIC', description: 'Christian Holiday' },
        { id: 6, date: '2026-04-14', name: 'Ambedkar Jayanti', type: 'PUBLIC', description: 'Birth Anniversary of B.R. Ambedkar' },
        { id: 7, date: '2026-05-01', name: 'Labour Day', type: 'PUBLIC', description: 'International Workers Day' },
        { id: 8, date: '2026-08-15', name: 'Independence Day', type: 'PUBLIC', description: 'Independence Day of India' },
        { id: 9, date: '2026-09-05', name: 'Janmashtami', type: 'FESTIVAL', description: 'Birth of Lord Krishna' },
        { id: 10, date: '2026-10-02', name: 'Gandhi Jayanti', type: 'PUBLIC', description: 'Birth Anniversary of Mahatma Gandhi' },
        { id: 11, date: '2026-10-20', name: 'Dussehra', type: 'FESTIVAL', description: 'Vijayadashami' },
        { id: 12, date: '2026-11-09', name: 'Diwali', type: 'FESTIVAL', description: 'Festival of Lights' },
        { id: 13, date: '2026-12-25', name: 'Christmas', type: 'PUBLIC', description: 'Birth of Jesus Christ' }
    ];

    const badgeColor = {
        PUBLIC: 'bg-red-100 text-red-700',
        FESTIVAL: 'bg-purple-100 text-purple-700',
        OPTIONAL: 'bg-yellow-100 text-yellow-700'
    };

    const countByType = (type) => holidays.filter(h => h.type === type).length;

    const holidaysByMonth = holidays.reduce((acc, h) => {
        const month = new Date(h.date).toLocaleString('default', { month: 'long' });
        if (!acc[month]) acc[month] = [];
        acc[month].push(h);
        return acc;
    }, {});

    const monthOrder = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <>
            <style>{scrollbarStyle}</style>

            <div className="space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Holiday Calendar</h1>
                        <p className="text-gray-500 mt-1">Company holidays & festivals – 2026</p>
                    </div>

                    {isAdmin && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition">
                            <Plus size={18} />
                            Add Holiday
                        </button>
                    )}
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Public Holidays" value={countByType('PUBLIC')} color="bg-rose-500" icon={CalendarDays} />
                    <StatCard title="Festivals" value={countByType('FESTIVAL')} color="bg-violet-500" icon={CalendarDays} />
                    <StatCard title="Optional Holidays" value={countByType('OPTIONAL')} color="bg-amber-500" icon={CalendarDays} />
                </div>

                {/* CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* LEFT LIST - 4 Columns (approx 33%) */}
                    <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-[620px] flex flex-col">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                            <div className="p-2 bg-gray-50 text-gray-500 rounded-lg">
                                <CalendarDays size={18} />
                            </div>
                            <h2 className="font-bold text-gray-800">Holiday List – 2026</h2>
                        </div>

                        <div className="flex-1 custom-scroll pr-2">
                            <div className="space-y-6">
                                {monthOrder.map(month => (
                                    holidaysByMonth[month] && (
                                        <div key={month} className="relative">
                                            <div className="sticky top-0 bg-white z-10 py-1 mb-3">
                                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                    {month}
                                                </h3>
                                            </div>

                                            <div className="space-y-2">
                                                {holidaysByMonth[month].map(h => (
                                                    <div
                                                        key={h.id}
                                                        className="group p-3 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:border-blue-100 hover:shadow-md transition-all duration-300 cursor-default"
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <span className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{h.name}</span>
                                                                <p className="text-[10px] text-gray-500 mt-0.5 font-medium italic">
                                                                    {new Date(h.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                                                </p>
                                                            </div>
                                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${badgeColor[h.type]}`}>
                                                                {h.type}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-gray-500 mt-2 line-clamp-2 leading-relaxed">{h.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CALENDAR - 8 Columns (approx 66%) */}
                    <div className="lg:col-span-8">
                        <HolidayCalendar holidays={holidays} />
                    </div>
                </div>
            </div>
        </>
    );
};

/* =======================
   STAT CARD
======================= */
const StatCard = ({ title, value, color, icon: Icon }) => {
    return (
        <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                <div className={`${color} p-4 rounded-2xl shadow-lg ring-4 ring-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>

            {/* Subtle bottom accent line */}
            <div className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full ${color} opacity-20`} />
        </div>
    );
};

export default HolidayPage;
