import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { employeeAPI, attendanceAPI } from '../services/api';
import { Users, Briefcase, UserCheck, TrendingUp, Clock, Calendar } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        activeEmployees: 0,
        itDept: 0,
        hrDept: 0,
        presentToday: 0,
        absentToday: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];

            const [activeCount, itCount, hrCount, allEmployees, todayAttendance] = await Promise.all([
                employeeAPI.getActiveCount(),
                employeeAPI.getDeptCount('IT'),
                employeeAPI.getDeptCount('HR'),
                employeeAPI.getAll(),
                attendanceAPI.getByDate(today),
            ]);

            const presentCount = todayAttendance.data.filter(a => a.status === 'PRESENT').length;
            const absentCount = todayAttendance.data.filter(a => a.status === 'ABSENT').length;

            setStats({
                totalEmployees: allEmployees.data.length,
                activeEmployees: activeCount.data.activeEmployees,
                itDept: itCount.data.departmentEmployeeCount,
                hrDept: hrCount.data.departmentEmployeeCount,
                presentToday: presentCount,
                absentToday: absentCount,
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, title, value, color }) => (
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
                </div>
                <div className={`${color} p-4 rounded-full`}>
                    <Icon size={32} className="text-white" />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Welcome back, {user?.username}! 👋
                </h1>
                <p className="text-gray-600 mt-2">Here's what's happening today</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                <StatCard
                    icon={Users}
                    title="Total Employees"
                    value={stats.totalEmployees}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={UserCheck}
                    title="Active Employees"
                    value={stats.activeEmployees}
                    color="bg-green-500"
                />
                <StatCard
                    icon={Briefcase}
                    title="IT Department"
                    value={stats.itDept}
                    color="bg-purple-500"
                />
                <StatCard
                    icon={TrendingUp}
                    title="HR Department"
                    value={stats.hrDept}
                    color="bg-orange-500"
                />
                <StatCard
                    icon={Clock}
                    title="Present Today"
                    value={stats.presentToday}
                    color="bg-green-600"
                />
                <StatCard
                    icon={Calendar}
                    title="Absent Today"
                    value={stats.absentToday}
                    color="bg-red-600"
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/dashboard/employees"
                        className="p-6 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition text-center"
                    >
                        <Users size={32} className="text-blue-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-gray-900">Manage Employees</h3>
                        <p className="text-sm text-gray-600 mt-1">View and edit employee records</p>
                    </a>
                    <a
                        href="/dashboard/attendance"
                        className="p-6 border-2 border-green-200 rounded-lg hover:bg-green-50 transition text-center"
                    >
                        <Clock size={32} className="text-green-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-gray-900">Attendance</h3>
                        <p className="text-sm text-gray-600 mt-1">Clock in/out and view attendance</p>
                    </a>
                    <a
                        href="/dashboard/employees/add"
                        className="p-6 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition text-center"
                    >
                        <UserCheck size={32} className="text-purple-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-gray-900">Add Employee</h3>
                        <p className="text-sm text-gray-600 mt-1">Register a new employee</p>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
