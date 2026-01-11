import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { employeeAPI, attendanceAPI, leaveBalanceAPI, payrollAPI, leaveAPI } from '../services/api';
import { Users, Briefcase, UserCheck, TrendingUp, Clock, Calendar, CreditCard, Shield, FileText, User, X } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        activeEmployees: 0,
        presentToday: 0,
        absentToday: 0,
        leaveBalance: [],
        lastSalary: null,
        leaveStats: { pending: 0, approved: 0, rejected: 0 }
    });
    const { user, employeeId, isAdmin, isHR } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const currentYear = new Date().getFullYear();

            if (isAdmin || isHR) {
                // Fetch Employees and Attendance
                // We calculate counts on frontend to avoid dependency on missing backend 'count' endpoints
                // Fetch Employees first (Reliable)
                let allEmployees = [];
                try {
                    const employeesRes = await employeeAPI.getAll();
                    allEmployees = employeesRes.data || [];
                } catch (empErr) {
                    console.error("Error fetching employees:", empErr);
                }

                // Fetch Attendance separately (Prone to 500 Lob stream error)
                let attendanceList = [];
                try {
                    const attendanceRes = await attendanceAPI.getByDate(today);
                    if (Array.isArray(attendanceRes.data)) {
                        attendanceList = attendanceRes.data;
                    } else if (attendanceRes.data && Array.isArray(attendanceRes.data.data)) {
                        attendanceList = attendanceRes.data.data;
                    }
                } catch (attErr) {
                    console.error("Error fetching attendance:", attErr);
                    // If attendance fails, we just show 0 for present/absent but keep employee stats
                }

                // Calculate Stats
                const activeCount = allEmployees.filter(e => e.employmentStatus === 'ACTIVE').length;
                const itCount = allEmployees.filter(e => e.department === 'IT').length;
                const hrCount = allEmployees.filter(e => e.department === 'HR').length;

                const presentCount = attendanceList.filter(a => a.status === 'PRESENT').length;
                const absentCount = attendanceList.filter(a => a.status === 'ABSENT').length;

                setStats(prev => ({
                    ...prev,
                    totalEmployees: allEmployees.length,
                    activeEmployees: activeCount,
                    itDept: itCount,
                    hrDept: hrCount,
                    presentToday: presentCount,
                    absentToday: absentCount,
                }));
            } else if (employeeId) {
                // Employee View Data
                try {
                    const [balances, payrolls, leavesRes] = await Promise.all([
                        leaveBalanceAPI.getAllForEmployee(employeeId, currentYear),
                        payrollAPI.getEmployeePayrolls(employeeId),
                        leaveAPI.getEmployeeLeaves(employeeId)
                    ]);

                    const leaveList = leavesRes.data.success ? (leavesRes.data.data || []) : [];
                    const pending = leaveList.filter(l => l.status === 'PENDING').length;
                    const approved = leaveList.filter(l => l.status === 'APPROVED').length;
                    const rejected = leaveList.filter(l => l.status === 'REJECTED').length;

                    setStats(prev => ({
                        ...prev,
                        leaveBalance: balances.data.success ? (balances.data.data || []) : [],
                        lastSalary: payrolls.data.success ? (payrolls.data.data?.[0] || null) : null,
                        leaveStats: { pending, approved, rejected }
                    }));
                } catch (empError) {
                    console.error("Error fetching employee specific data", empError);
                }
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Don't show empty stats on error, keep defaults (0)
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, title, value, color }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                <div className={`${color} p-3.5 rounded-xl shadow-sm`}>
                    <Icon size={24} className="text-white" />
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

            {/* Admin/HR Dashboard */}
            {isAdmin || isHR ? (
                <div className="space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                        <StatCard icon={Users} title="Total Employees" value={stats.totalEmployees} color="bg-blue-500" />
                        <StatCard icon={UserCheck} title="Active Employees" value={stats.activeEmployees} color="bg-green-500" />
                        <StatCard icon={Briefcase} title="IT Department" value={stats.itDept} color="bg-purple-500" />
                        <StatCard icon={TrendingUp} title="HR Department" value={stats.hrDept} color="bg-orange-500" />
                        <StatCard icon={Clock} title="Present Today" value={stats.presentToday} color="bg-green-600" />
                        <StatCard icon={Calendar} title="Absent Today" value={stats.absentToday} color="bg-red-600" />
                    </div>

                    {/* Admin Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <QuickActionLink href="/dashboard/employees" icon={Users} title="Manage Employees" subtitle="View and edit records" color="text-blue-600" borderColor="border-blue-200" hoverColor="hover:bg-blue-50" />
                            <QuickActionLink href="/dashboard/attendance" icon={Clock} title="Attendance Records" subtitle="System-wide logs" color="text-green-600" borderColor="border-green-200" hoverColor="hover:bg-green-50" />
                            <QuickActionLink href="/dashboard/leave/approve" icon={Calendar} title="Leave Requests" subtitle="Pending approvals" color="text-purple-600" borderColor="border-purple-200" hoverColor="hover:bg-purple-50" />
                        </div>
                    </div>
                </div>
            ) : (
                /* Employee Dashboard */
                <div className="space-y-8">
                    {!employeeId && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg flex items-center gap-3">
                            <Shield className="text-yellow-400" size={24} />
                            <p className="text-yellow-700">Link your account to an employee profile to see more details.</p>
                        </div>
                    )}

                    {/* Leave Status Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-amber-400">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Pending Leaves</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.leaveStats?.pending || 0}</p>
                                </div>
                                <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
                                    <Clock size={20} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-emerald-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Approved Leaves</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.leaveStats?.approved || 0}</p>
                                </div>
                                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                                    <UserCheck size={20} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-rose-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Rejected Leaves</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.leaveStats?.rejected || 0}</p>
                                </div>
                                <div className="bg-rose-50 p-3 rounded-xl text-rose-600">
                                    <X size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Leave Balance Card */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Calendar className="text-blue-600" size={24} />
                                Leave Balance ({new Date().getFullYear()})
                            </h2>
                            {stats.leaveBalance.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {stats.leaveBalance.map((item) => (
                                        <div key={item.leaveTypeId} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-700">{item.leaveTypeName}</p>
                                                <p className="text-xs text-gray-500">Total: {item.totalDays} Days</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-blue-600">{item.remainingDays}</p>
                                                <p className="text-[10px] uppercase text-gray-400 font-bold">Remaining</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No leave balances initialized yet.</p>
                            )}
                        </div>

                        {/* Recent Payroll Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CreditCard className="text-green-600" size={24} />
                                Last Payslip
                            </h2>
                            {stats.lastSalary ? (
                                <div className="space-y-4">
                                    <div className="text-center pb-4 border-b border-gray-100">
                                        <p className="text-sm text-gray-500">Net Payable</p>
                                        <p className="text-3xl font-bold text-gray-900">₹{stats.lastSalary.netSalary.toLocaleString()}</p>
                                        <p className="text-xs text-green-600 font-bold mt-1 uppercase tracking-wider">{stats.lastSalary.status}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Month</span>
                                            <span className="font-medium">{new Date(stats.lastSalary.payPeriodStart).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Basic</span>
                                            <span className="font-medium">₹{stats.lastSalary.basicSalary.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <a href="/dashboard/payroll" className="block text-center text-blue-600 text-sm font-bold mt-4 hover:underline">View All Payslips</a>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FileText size={48} className="text-gray-200 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm italic">No payslips generated yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Employee Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Employee Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <QuickActionLink href="/dashboard/leave/apply" icon={Calendar} title="Apply Leave" subtitle="Request time off" color="text-blue-600" borderColor="border-blue-200" hoverColor="hover:bg-blue-50" />
                            <QuickActionLink href="/dashboard/attendance" icon={Clock} title="Clock Management" subtitle="Daily attendance" color="text-green-600" borderColor="border-green-200" hoverColor="hover:bg-green-50" />
                            <QuickActionLink href="/dashboard/profile" icon={User} title="My Profile" subtitle="Personal records" color="text-purple-600" borderColor="border-purple-200" hoverColor="hover:bg-purple-50" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper component for Quick Action Links
const QuickActionLink = ({ href, icon: Icon, title, subtitle, color, borderColor, hoverColor }) => (
    <a
        href={href}
        className={`p-6 border-2 ${borderColor} rounded-2xl ${hoverColor} transition-all duration-300 text-center group`}
    >
        <Icon size={40} className={`${color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </a>
);


export default Dashboard;
