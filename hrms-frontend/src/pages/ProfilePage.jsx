import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { employeeAPI } from '../services/api';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, CreditCard, Edit3, Save, Camera } from 'lucide-react';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const { user, employeeId } = useAuth();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    });

    useEffect(() => {
        if (employeeId) {
            fetchEmployeeDetails(employeeId);
        } else {
            setLoading(false);
        }
    }, [employeeId]);

    const initializeForm = (data) => {
        setFormData({
            phoneNumber: data.phoneNumber || '',
            dateOfBirth: data.dateOfBirth || '',
            gender: data.gender || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            postalCode: data.postalCode || '',
            country: data.country || 'India'
        });
    };

    const fetchEmployeeDetails = async (id) => {
        try {
            setLoading(true);
            console.log('Fetching details for employeeId:', id);
            const response = await employeeAPI.getById(id);
            console.log('Profile response:', response.data);

            // Handle both direct response and ApiResponse wrapper
            const data = response.data?.data || response.data;

            if (!data || !data.firstName) {
                console.warn('Received empty or invalid employee data:', data);
            }

            setEmployee(data);
            initializeForm(data);
        } catch (error) {
            console.error('Error fetching employee details:', error);
            const message = error.response?.data?.message || 'Failed to load profile details';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        const currentId = employee?.id || employeeId;
        if (!currentId) return;

        setSaving(true);
        try {
            await employeeAPI.updateProfile(currentId, formData);
            toast.success('Profile updated successfully');
            await fetchEmployeeDetails(currentId);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size should be less than 2MB');
            return;
        }

        const currentId = employee?.id || employeeId;
        if (!currentId) {
            toast.error('Employee ID not found');
            return;
        }

        setUploading(true);
        try {
            // Convert to base64 using Promise
            const base64String = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            console.log('Uploading image for employee:', currentId);
            const response = await employeeAPI.uploadProfileImage(currentId, base64String);
            console.log('Upload response:', response.data);

            toast.success('Profile image updated successfully');
            await fetchEmployeeDetails(currentId);
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
            // Reset file input
            event.target.value = '';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Helper for rendering unlinked user profile
    if (!employeeId && !employee) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-gray-700 to-gray-900"></div>
                    <div className="px-8 pb-8 pt-0 -mt-12">
                        <div className="flex flex-col md:flex-row items-end gap-6">
                            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-3xl font-bold">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="flex-1 pb-2">
                                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                    {user?.username}
                                </h1>
                                <p className="text-gray-600 font-medium flex items-center gap-2">
                                    <Shield size={16} /> {user?.roles?.[0]?.replace('ROLE_', '')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <User size={20} className="text-blue-600" />
                            Account Details
                        </h2>
                        <div className="space-y-4">
                            <InfoItem icon={User} label="Username" value={user?.username} />
                            <InfoItem icon={Shield} label="Role" value={user?.roles?.join(', ')} />
                            <InfoItem icon={Mail} label="Email" value={user?.email || 'Not provided'} />
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-blue-900 mb-2">Complete Your Profile</h2>
                        <p className="text-blue-700 mb-6">
                            You currently don't have an employee profile linked to this account.
                            Create one to access features like Leave, Attendance, and Payroll.
                        </p>
                        {/* Only Admin/HR can create profiles, usually. But for self, maybe contact admin? 
                            Since this is likely the Admin viewing their own profile, give them a hint. */}
                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100">
                            <Shield className="text-blue-600" size={24} />
                            <div>
                                <p className="font-semibold text-gray-900">Admin Action Required</p>
                                <p className="text-sm text-gray-600">Go to Employees &gt; Add Employee, and select this user account to link.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                <div className="px-8 pb-8 pt-0 -mt-16">
                    <div className="flex flex-col md:flex-row items-end gap-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-lg border-4 border-white">
                                {employee?.profileImage ? (
                                    <img
                                        src={employee.profileImage}
                                        alt={`${employee.firstName} ${employee.lastName}`}
                                        className="w-full h-full rounded-xl object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold">
                                        {employee?.firstName?.charAt(0)}{employee?.lastName?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                id="profile-image-upload"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <label
                                htmlFor="profile-image-upload"
                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-xl cursor-pointer hover:bg-blue-700 transition shadow-lg group-hover:scale-110"
                            >
                                {uploading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                ) : (
                                    <Camera size={20} />
                                )}
                            </label>
                        </div>
                        <div className="flex-1 pb-2">
                            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                {employee?.firstName} {employee?.lastName}
                            </h1>
                            <p className="text-gray-600 font-medium flex items-center gap-2">
                                <Briefcase size={16} /> {employee?.designation} • {employee?.department}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-3 pb-2">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${employee?.employmentStatus === 'ACTIVE'
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-red-100 text-red-700 border border-red-200'
                                }`}>
                                {employee?.employmentStatus}
                            </span>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-6 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-bold hover:bg-blue-50 transition shadow-sm"
                                >
                                    <Edit3 size={18} />
                                    Edit Profile
                                </button>
                            )}
                            {isEditing && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Contact Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <User size={20} className="text-blue-600" />
                            Contact Information
                        </h2>
                        <div className="space-y-6">
                            <InfoItem icon={Mail} label="Email" value={employee?.email} />

                            {isEditing ? (
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            ) : (
                                <InfoItem icon={Phone} label="Phone" value={employee?.phoneNumber} />
                            )}

                            {isEditing ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Gender</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        >
                                            <option value="">Select</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">D.O.B</label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <InfoItem icon={User} label="Gender" value={employee?.gender} />
                                    <InfoItem icon={Calendar} label="Date of Birth" value={employee?.dateOfBirth} />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border-t-4 border-blue-600">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-blue-600" />
                            Account Details
                        </h2>
                        <div className="space-y-4">
                            <InfoItem icon={User} label="Username" value={user?.username} />
                            <InfoItem
                                icon={Calendar}
                                label="Member Since"
                                value={employee?.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Employment & Address */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Briefcase size={20} className="text-blue-600" />
                                Employment Details
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <DetailBlock label="Employee ID" value={employee?.employeeCode} />
                            <DetailBlock label="Department" value={employee?.department} />
                            <DetailBlock label="Designation" value={employee?.designation} />
                            <DetailBlock label="Join Date" value={employee?.joiningDate} />
                            <DetailBlock label="Employment Type" value={employee?.employmentType?.replace('_', ' ')} />
                            <DetailBlock
                                label="Basic Salary"
                                value={`₹${employee?.basicSalary?.toLocaleString()}`}
                                icon={CreditCard}
                            />
                        </div>
                    </div>

                    {/* Financial Information Section */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden border-t-4 border-green-500">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <CreditCard size={20} className="text-green-600" />
                                Financial Information
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <DetailBlock label="Bank Name" value={employee?.bankName} />
                            <DetailBlock label="Account Number" value={employee?.bankAccountNo} />
                            <DetailBlock label="IFSC Code" value={employee?.ifscCode} />
                            <DetailBlock label="PAN Number" value={employee?.panNo} />
                            <DetailBlock label="PF Number" value={employee?.pfNo} />
                            <DetailBlock label="UAN Number" value={employee?.uanNo} />
                            <DetailBlock label="ESI Number" value={employee?.esiNo} />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <MapPin size={20} className="text-blue-600" />
                            Address Information
                        </h2>

                        {isEditing ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Street Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="2"
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        placeholder="Full address"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-700 leading-relaxed font-medium">
                                {employee?.address}<br />
                                {employee?.city}, {employee?.state} - {employee?.postalCode}<br />
                                {employee?.country}
                            </p>
                        )}
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
