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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50 bg-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <CalendarIcon size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">
                        {monthNames[month]} {year}
                    </h2>
                </div>
                <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
                    <button onClick={prevMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition text-gray-600">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition">
                        Today
                    </button>
                    <button onClick={nextMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition text-gray-600">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 border-b border-gray-50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-2.5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 bg-gray-50/50 gap-[1px]">
                {/* Empty cells for prev month */}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-gray-50/30 aspect-square min-h-[60px]" />
                ))}

                {/* Days */}
                {Array.from({ length: days }).map((_, i) => {
                    const day = i + 1;
                    const dayHolidays = getHolidaysForDate(day);

                    return (
                        <div key={day} className={`bg-white aspect-square min-h-[60px] p-1.5 relative group transition-all duration-200 hover:bg-blue-50/30 ${isToday(day) ? 'bg-blue-50/20' : ''}`}>
                            <div className="flex items-center justify-center">
                                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold transition-all ${isToday(day) ? 'bg-blue-600 text-white shadow-sm scale-110' : 'text-gray-600'}`}>
                                    {day}
                                </span>
                            </div>

                            <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                                {dayHolidays.map((holiday, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-1.5 h-1.5 rounded-full ring-1 ring-white shadow-sm ${holiday.type === 'PUBLIC'
                                            ? 'bg-red-500'
                                            : holiday.type === 'OPTIONAL'
                                                ? 'bg-yellow-500'
                                                : 'bg-purple-500'
                                            }`}
                                        title={`${holiday.name}: ${holiday.description || ''}`}
                                    />
                                ))}
                            </div>

                            {/* Hover Tooltip (Simulated with group-hover) */}
                            {dayHolidays.length > 0 && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 hidden group-hover:block z-50 bg-gray-900 text-white text-[10px] p-2 rounded-lg shadow-xl pointer-events-none">
                                    {dayHolidays.map((h, hidx) => (
                                        <div key={hidx} className="mb-1 last:mb-0">
                                            <span className="font-bold block text-blue-300">{h.name}</span>
                                            <span className="opacity-80">{h.type}</span>
                                        </div>
                                    ))}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HolidayCalendar;
