import React, { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../services/api';
import { FileText, Users, Clock, Briefcase, TrendingUp, Download } from 'lucide-react';
import { toast } from 'react-toastify';

const ReportsPage = () => {
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        departments: [],
        attendance: { present: 0, absent: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const [allEmp, activeCount, todayAtt] = await Promise.all([
                employeeAPI.getAll(),
                employeeAPI.getActiveCount(),
                attendanceAPI.getByDate(today)
            ]);

            const presentCount = todayAtt.data.data.filter(a => a.status === 'PRESENT').length;
            const absentCount = todayAtt.data.data.filter(a => a.status === 'ABSENT').length;

            // Group by department
            const deptMap = allEmp.data.reduce((acc, emp) => {
                acc[emp.department] = (acc[emp.department] || 0) + 1;
                return acc;
            }, {});

            setStats({
                total: allEmp.data.length,
                active: activeCount.data.activeEmployees,
                departments: Object.entries(deptMap).map(([name, count]) => ({ name, count })),
                attendance: { present: presentCount, absent: absentCount }
            });
        } catch (error) {
            console.error('Error fetching report data:', error);
            toast.error('Failed to load report statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                    <p className="text-gray-500">Comprehensive overview of company metrics</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <Download size={18} />
                    Export Report
                </button>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ReportCard icon={Users} title="Total Headcount" value={stats.total} color="blue" />
                <ReportCard icon={TrendingUp} title="Active Workforce" value={stats.active} color="green" />
                <ReportCard icon={Clock} title="Today's Presence" value={stats.attendance.present} color="orange" />
                <ReportCard icon={Briefcase} title="Departments" value={stats.departments.length} color="indigo" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Distribution */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Department Distribution</h2>
                    <div className="space-y-4">
                        {stats.departments.map((dept, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>{dept.name}</span>
                                    <span>{dept.count} Employees</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${(dept.count / stats.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Attendance Summary */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Attendance Overview</h2>
                    <div className="flex items-center justify-center p-8">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                    className="text-gray-100"
                                    strokeDasharray="100, 100"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                />
                                <path
                                    className="text-blue-600"
                                    strokeDasharray={`${(stats.attendance.present / (stats.attendance.present + stats.attendance.absent || 1)) * 100}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold">{Math.round((stats.attendance.present / (stats.attendance.present + stats.attendance.absent || 1)) * 100)}%</span>
                                <span className="text-xs text-gray-500 font-medium">Present Today</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-blue-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-600">Present</span>
                            </div>
                            <span className="text-xl font-bold">{stats.attendance.present}</span>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-600">Absent</span>
                            </div>
                            <span className="text-xl font-bold">{stats.attendance.absent}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReportCard = ({ icon: Icon, title, value, color }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        orange: 'bg-orange-50 text-orange-600',
        indigo: 'bg-indigo-50 text-indigo-600',
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

export default ReportsPage;
