import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { UserPlus, User, Mail, Lock, Shield } from 'lucide-react';

const CreateUserPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '', // Note: Backend might not use this for User entity directly, but common in reg forms
        role: 'mole_employee' // Default selection, though backend might default to ROLE_USER/EMPLOYEE
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // map role selection to backend expected format if necessary
            // Assuming backend accepts these fields as per user request example:
            // { "username": "...", "email": "...", "password": "...", "fullName": "..." }

            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                // If backend supports role assignment on register:
                // roles: [formData.role] 
            };

            await authAPI.register(payload);
            toast.success('User account created successfully!');
            // clear form or navigate? User requested "like whenever we add employee first we will cretate employee credentilas"
            // So staying here or navigating to Add Employee might be good. 
            // Let's offer a choice or just clear for next user.
            setFormData({
                username: '',
                email: '',
                password: '',
                fullName: '',
                role: 'mole_employee'
            });

            // Optional: Ask user if they want to create employee profile now?
            // For now, just success message is fine. user can navigate to Add Employee.

        } catch (error) {
            console.error('Registration failed:', error);
            const msg = error.response?.data?.message || 'Failed to create user account';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Create User Account</h1>
                <p className="text-gray-600 mt-1">Create login credentials for a new employee</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <UserPlus className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Account Details</h2>
                        <p className="text-sm text-gray-500">Enter the credentials for the new user</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-gray-400">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="jdoe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Users' Full Name</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-gray-400">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="john.doe@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? 'Creating...' : (
                                <>
                                    <UserPlus size={18} />
                                    Create Account
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserPage;
