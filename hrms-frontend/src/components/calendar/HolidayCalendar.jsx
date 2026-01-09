import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const HolidayCalendar = ({ holidays }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay, year, month };
    };

    const { days, firstDay, year, month } = getDaysInMonth(currentDate);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    };

    const getHolidaysForDate = (day) => {
        return holidays.filter(h => {
            const hDate = new Date(h.date);
            return hDate.getDate() === day && hDate.getMonth() === month && hDate.getFullYear() === year;
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <CalendarIcon size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {monthNames[month]} {year}
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                        Today
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
                <div className="grid grid-cols-7 auto-rows-fr bg-gray-100 gap-[1px] min-w-[800px]">
                    {/* Empty cells for prev month */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-white h-32 p-2 relative group opacity-50" />
                    ))}

                    {/* Days */}
                    {Array.from({ length: days }).map((_, i) => {
                        const day = i + 1;
                        const dayHolidays = getHolidaysForDate(day);

                        return (
                            <div key={day} className={`bg-white h-32 p-2 relative group transition hover:bg-gray-50 ${isToday(day) ? 'bg-blue-50/30' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${isToday(day) ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700'}`}>
                                        {day}
                                    </span>
                                </div>

                                <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px]">
                                    {dayHolidays.map((holiday, idx) => (
                                        <div
                                            key={idx}
                                            className={`text-xs p-1.5 rounded border border-l-4 truncate cursor-pointer transition
                                                ${holiday.type === 'PUBLIC'
                                                    ? 'bg-red-50 border-red-200 border-l-red-500 text-red-700 hover:bg-red-100'
                                                    : holiday.type === 'OPTIONAL'
                                                        ? 'bg-yellow-50 border-yellow-200 border-l-yellow-500 text-yellow-700 hover:bg-yellow-100'
                                                        : 'bg-purple-50 border-purple-200 border-l-purple-500 text-purple-700 hover:bg-purple-100'
                                                }`}
                                            title={holiday.description || holiday.name}
                                        >
                                            {holiday.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HolidayCalendar;
