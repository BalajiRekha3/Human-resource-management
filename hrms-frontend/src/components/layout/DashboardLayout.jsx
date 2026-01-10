import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { employeeAPI } from '../../services/api';
import {
    LayoutDashboard,
    UserPlus,
    Users,
    Calendar,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    Clock,
    User,
    CreditCard,
    DollarSign,
} from 'lucide-react';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout, employeeId } = useAuth();
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchProfileImage = async () => {
            if (employeeId) {
                try {
                    const response = await employeeAPI.getById(employeeId);
                    const data = response.data?.data || response.data;
                    if (data && data.profileImage) {
                        setProfileImage(data.profileImage);
                    }
                } catch (error) {
                    console.error('Failed to fetch profile image', error);
                }
            }
        };
        fetchProfileImage();
    }, [employeeId]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Create User Account', path: '/dashboard/users/create', icon: UserPlus, roles: ['ROLE_ADMIN', 'ROLE_HR'] },
        { name: 'Employees', path: '/dashboard/employees', icon: Users, roles: ['ROLE_ADMIN', 'ROLE_HR'] },
        { name: 'Attendance', path: '/dashboard/attendance', icon: Clock },
        {
            name: 'Leave',
            path: '/dashboard/leave',
            icon: Calendar,
            subItems: [
                { name: 'My Leaves', path: '/dashboard/leave' },
                { name: 'Apply Leave', path: '/dashboard/leave/apply' },
                { name: 'Approve Leaves', path: '/dashboard/leave/approve', roles: ['ROLE_ADMIN', 'ROLE_HR'] },
                { name: 'Leave Types', path: '/dashboard/leave/types', roles: ['ROLE_ADMIN', 'ROLE_HR'] }
            ]
        },
        { name: 'Reports', path: '/dashboard/reports', icon: FileText, roles: ['ROLE_ADMIN', 'ROLE_HR'] },
        { name: 'Holiday Calendar', path: '/dashboard/holidays', icon: Calendar },
        { name: 'Payroll Management', path: '/dashboard/payroll', icon: DollarSign, roles: ['ROLE_ADMIN', 'ROLE_HR'] },
        { name: 'My Payslips', path: '/dashboard/payslips', icon: FileText },
        { name: 'My Profile', path: '/dashboard/profile', icon: User },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-gray-100 fixed w-full z-30 top-0 shadow-sm">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <div className="flex items-center ml-4 lg:ml-0">
                                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                    <span className="text-white font-bold text-sm">H</span>
                                </div>
                                <span className="ml-3 text-xl font-bold text-gray-800">
                                    HRMS<span className="text-blue-600">Pro</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-700">{user?.username}</p>
                                    <p className="text-xs text-gray-500">{user?.roles?.[0]?.replace('ROLE_', '')}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden ring-2 ring-blue-100">
                                    {profileImage ? (
                                        <img src={profileImage} alt={user?.username} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-blue-600 font-semibold text-sm">
                                            {user?.username?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-16 bottom-0 bg-white border-r border-gray-100 w-64 transition-transform duration-300 ease-in-out z-20 overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0`}
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e1 transparent'
                }}
            >
                <style>{`
                    aside::-webkit-scrollbar {
                        width: 3px;
                    }
                    aside::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    aside::-webkit-scrollbar-thumb {
                        background: #cbd5e1;
                        border-radius: 2px;
                    }
                    aside::-webkit-scrollbar-thumb:hover {
                        background: #94a3b8;
                    }
                `}</style>
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const hasRole = (!item.role && !item.roles) ||
                            (item.role && user?.roles?.includes(item.role)) ||
                            (item.roles && item.roles.some(r => user?.roles?.includes(r)));

                        if (!hasRole) return null;

                        return (
                            <div key={item.name}>
                                <Link
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.path)
                                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border-l-4 border-blue-600'
                                        : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm hover:translate-x-1'
                                        }`}
                                >
                                    <Icon size={20} className={isActive(item.path) ? 'text-blue-600' : 'text-gray-500'} />
                                    <span className="font-medium text-sm">{item.name}</span>
                                </Link>
                                {item.subItems && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {item.subItems.map(subItem => {
                                            const hasSubRole = (!subItem.role && !subItem.roles) ||
                                                (subItem.role && user?.roles?.includes(subItem.role)) ||
                                                (subItem.roles && subItem.roles.some(r => user?.roles?.includes(r)));
                                            if (!hasSubRole) return null;
                                            return (
                                                <Link
                                                    key={subItem.path}
                                                    to={subItem.path}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className={`block px-4 py-2 text-sm rounded-lg transition-all duration-200 ${isActive(subItem.path)
                                                        ? 'text-blue-700 bg-blue-50 font-medium border-l-2 border-blue-500'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
                                                        }`}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 pt-16">
                <div className="p-6">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardLayout;
