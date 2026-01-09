import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, User, Bell, Shield, Moon, Globe, HelpCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const SettingsPage = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        slack: true
    });

    const handleToggle = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
        toast.info(`${key.charAt(0).toUpperCase() + key.slice(1)} notification preference updated`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500">Manage your account preferences and system configuration</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Navigation Sidebar */}
                <div className="md:col-span-1 space-y-2">
                    <SettingNav icon={User} label="Account" active />
                    <SettingNav icon={Bell} label="Notifications" />
                    <SettingNav icon={Shield} label="Security" />
                    <SettingNav icon={Moon} label="Appearance" />
                    <SettingNav icon={Globe} label="Language" />
                    <SettingNav icon={HelpCircle} label="Help & Support" />
                </div>

                {/* Content Area */}
                <div className="md:col-span-2 space-y-6">
                    {/* Account Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Account Information</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Username</label>
                                    <input
                                        type="text"
                                        disabled
                                        value={user?.username}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Role</label>
                                    <div className="flex flex-wrap gap-2">
                                        {user?.roles?.map(role => (
                                            <span key={role} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 italic">
                                                {role.replace('ROLE_', '')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Notification Preferences</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <ToggleItem
                                title="Email Notifications"
                                description="Get updates about your task status via email"
                                active={notifications.email}
                                onToggle={() => handleToggle('email')}
                            />
                            <ToggleItem
                                title="Push Notifications"
                                description="Receive real-time alerts on your device"
                                active={notifications.push}
                                onToggle={() => handleToggle('push')}
                            />
                            <ToggleItem
                                title="Slack Integration"
                                description="Forward system alerts to your Slack workspace"
                                active={notifications.slack}
                                onToggle={() => handleToggle('slack')}
                            />
                        </div>
                    </div>

                    {/* System Prefs */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 text-red-600">
                            <h2 className="text-lg font-bold">Danger Zone</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                            <button className="px-6 py-2 border-2 border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition">
                                Deactivate Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingNav = ({ icon: Icon, label, active }) => (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
        <Icon size={20} />
        {label}
    </button>
);

const ToggleItem = ({ title, description, active, onToggle }) => (
    <div className="flex items-center justify-between py-2">
        <div>
            <p className="font-bold text-gray-900">{title}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <button
            onClick={onToggle}
            className={`w-12 h-6 rounded-full transition-colors relative ${active ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${active ? 'left-7' : 'left-1'}`}></div>
        </button>
    </div>
);

export default SettingsPage;
