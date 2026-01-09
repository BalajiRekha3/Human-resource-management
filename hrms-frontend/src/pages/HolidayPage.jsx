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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <StatCard title="Public Holidays" value={countByType('PUBLIC')} color="red" />
                    <StatCard title="Festivals" value={countByType('FESTIVAL')} color="purple" />
                    <StatCard title="Optional Holidays" value={countByType('OPTIONAL')} color="yellow" />
                </div>

                {/* CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT LIST */}
                    <div className="bg-white rounded-2xl border shadow-sm p-4 h-[680px] custom-scroll">
                        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <CalendarDays size={18} /> Holiday List – 2026
                        </h2>

                        <div className="space-y-6">
                            {monthOrder.map(month => (
                                holidaysByMonth[month] && (
                                    <div key={month}>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                            {month}
                                        </h3>

                                        <div className="space-y-3">
                                            {holidaysByMonth[month].map(h => (
                                                <div
                                                    key={h.id}
                                                    className="p-3 rounded-xl border bg-gray-50 hover:bg-white hover:shadow transition cursor-pointer"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium text-gray-900">{h.name}</span>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${badgeColor[h.type]}`}>
                                                            {h.type}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">{h.description}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(h.date).toDateString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    {/* RIGHT CALENDAR */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-4">
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
const StatCard = ({ title, value, color }) => {
    const accent = {
        red: 'from-red-500 to-red-400',
        purple: 'from-purple-500 to-purple-400',
        yellow: 'from-yellow-500 to-yellow-400'
    };

    return (
        <div className="relative bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition">
            <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${accent[color]}`} />
            <p className="text-sm text-gray-500">{title}</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{value}</h2>
        </div>
    );
};

export default HolidayPage;
