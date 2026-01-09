import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { employeeAPI } from '../services/api';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const { user, employeeId } = useAuth();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (employeeId) {
            fetchEmployeeDetails();
        } else {
            setLoading(false);
        }
    }, [employeeId]);

    const fetchEmployeeDetails = async () => {
        try {
            const response = await employeeAPI.getById(employeeId);
            setEmployee(response.data);
        } catch (error) {
            console.error('Error fetching employee details:', error);
            toast.error('Failed to load profile details');
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

    if (!employeeId) {
        return (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm">
                <div className="flex items-center">
                    <Shield className="text-yellow-400 mr-3" size={24} />
                    <p className="text-yellow-700 font-medium">
                        No employee profile linked to your user account.
                    </p>
                </div>
                <p className="text-yellow-600 mt-2 ml-9">
                    Please contact your HR administrator to link your account to an employee profile.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                <div className="px-8 pb-8 pt-0 -mt-12">
                    <div className="flex flex-col md:flex-row items-end gap-6">
                        <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-lg">
                            <div className="w-full h-full rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold">
                                {employee?.firstName?.charAt(0)}{employee?.lastName?.charAt(0)}
                            </div>
                        </div>
                        <div className="flex-1 pb-2">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {employee?.firstName} {employee?.lastName}
                            </h1>
                            <p className="text-gray-600 font-medium">{employee?.designation} • {employee?.department}</p>
                        </div>
                        <div className="pb-2">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${employee?.employmentStatus === 'ACTIVE'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                {employee?.employmentStatus}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Contact Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User size={20} className="text-blue-600" />
                            Contact Information
                        </h2>
                        <div className="space-y-4">
                            <InfoItem icon={Mail} label="Email" value={employee?.email} />
                            <InfoItem icon={Phone} label="Phone" value={employee?.phoneNumber} />
                            <InfoItem icon={MapPin} label="Location" value={`${employee?.city}, ${employee?.state}`} />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-blue-600" />
                            Account Details
                        </h2>
                        <div className="space-y-4">
                            <InfoItem icon={User} label="Username" value={user?.username} />
                            <InfoItem icon={Calendar} label="Member Since" value={new Date(employee?.createdAt).toLocaleDateString()} />
                        </div>
                    </div>
                </div>

                {/* Right Column - Employment Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Briefcase size={20} className="text-blue-600" />
                            Employment Details
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <DetailBlock label="Employee ID" value={employee?.employeeCode} />
                            <DetailBlock label="Department" value={employee?.department} />
                            <DetailBlock label="Designation" value={employee?.designation} />
                            <DetailBlock label="Join Date" value={employee?.joiningDate} />
                            <DetailBlock label="Employment Type" value={employee?.employmentType?.replace('_', ' ')} />
                            <DetailBlock
                                label="Salary"
                                value={`₹${employee?.basicSalary?.toLocaleString()}`}
                                icon={CreditCard}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin size={20} className="text-blue-600" />
                            Permanent Address
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {employee?.address}<br />
                            {employee?.city}, {employee?.state} - {employee?.postalCode}<br />
                            {employee?.country}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
            <Icon size={18} />
        </div>
        <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
            <p className="text-sm text-gray-900 break-all">{value || 'Not provided'}</p>
        </div>
    </div>
);

const DetailBlock = ({ label, value, icon: Icon }) => (
    <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-center gap-2">
            {Icon && <Icon size={16} className="text-blue-600" />}
            <p className="text-base font-semibold text-gray-900">{value || 'N/A'}</p>
        </div>
    </div>
);

export default ProfilePage;
