import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { employeeAPI, userAPI } from '../services/api';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Briefcase, DollarSign } from 'lucide-react';

const AddEmployee = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        employeeCode: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: 'Male',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        department: 'IT',
        designation: '',
        joiningDate: '',
        employmentType: 'FULL_TIME',
        employmentStatus: 'ACTIVE',
        basicSalary: '',
        userId: '',
    });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (location.state?.linkedUser) {
            const u = location.state.linkedUser;
            const realId = u.id.replace('user-', '');
            const names = (u.fullName || '').split(' ');
            setFormData(prev => ({
                ...prev,
                userId: realId,
                email: u.email || '',
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                // Don't auto-set SYS code, let them choose a real EMP code
            }));
        }
    }, [location.state]);

    const fetchUsers = async () => {
        try {
            const response = await userAPI.getAll();
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            // Non-critical if users can't be fetched
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSend = {
                ...formData,
                basicSalary: parseFloat(formData.basicSalary),
            };

            const response = await employeeAPI.create(dataToSend);
            toast.success(`Employee ${response.data.fullName} created successfully!`);
            navigate('/dashboard/employees');
        } catch (error) {
            console.error('Error creating employee:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create employee';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/dashboard/employees')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {location.state?.linkedUser ? 'Complete Employee Profile' : 'Add New Employee'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {location.state?.linkedUser
                            ? `Update details for ${location.state.linkedUser.fullName}`
                            : 'Fill in the employee details below'}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm">
                {/* Personal Information */}
                <div className="p-8 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="text-blue-600" size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormInput
                            label="Employee Code"
                            name="employeeCode"
                            value={formData.employeeCode}
                            onChange={handleChange}
                            required
                            placeholder="EMP001"
                        />
                        <FormInput
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            placeholder="John"
                        />
                        <FormInput
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder="Doe"
                        />
                        <FormInput
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john.doe@company.com"
                            icon={<Mail size={18} />}
                        />
                        <FormInput
                            label="Phone Number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="+91-9876543210"
                            icon={<Phone size={18} />}
                        />
                        <FormInput
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                        />
                        <FormSelect
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            options={[
                                { value: 'Male', label: 'Male' },
                                { value: 'Female', label: 'Female' },
                                { value: 'Other', label: 'Other' },
                            ]}
                        />
                    </div>
                </div>

                {/* Address Information */}
                <div className="p-8 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <MapPin className="text-purple-600" size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Address Information</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormInput
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Main Street"
                            className="lg:col-span-2"
                        />
                        <FormInput
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Hyderabad"
                        />
                        <FormInput
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="Telangana"
                        />
                        <FormInput
                            label="Postal Code"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            placeholder="500001"
                        />
                        <FormInput
                            label="Country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="India"
                        />
                    </div>
                </div>

                {/* Employment Details */}
                <div className="p-8 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Briefcase className="text-green-600" size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Employment Details</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormSelect
                            label="Department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                            options={[
                                { value: 'IT', label: 'IT' },
                                { value: 'HR', label: 'HR' },
                                { value: 'Finance', label: 'Finance' },
                                { value: 'Marketing', label: 'Marketing' },
                                { value: 'Operations', label: 'Operations' },
                                { value: 'Sales', label: 'Sales' },
                            ]}
                        />
                        <FormInput
                            label="Designation"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            required
                            placeholder="Software Engineer"
                        />
                        <FormInput
                            label="Joining Date"
                            name="joiningDate"
                            type="date"
                            value={formData.joiningDate}
                            onChange={handleChange}
                            required
                        />
                        <FormSelect
                            label="Employment Type"
                            name="employmentType"
                            value={formData.employmentType}
                            onChange={handleChange}
                            options={[
                                { value: 'FULL_TIME', label: 'Full Time' },
                                { value: 'PART_TIME', label: 'Part Time' },
                                { value: 'CONTRACT', label: 'Contract' },
                                { value: 'INTERN', label: 'Intern' },
                            ]}
                        />
                        <FormSelect
                            label="Employment Status"
                            name="employmentStatus"
                            value={formData.employmentStatus}
                            onChange={handleChange}
                            options={[
                                { value: 'ACTIVE', label: 'Active' },
                                { value: 'INACTIVE', label: 'Inactive' },
                                { value: 'TERMINATED', label: 'Terminated' },
                            ]}
                        />
                        <FormInput
                            label="Basic Salary (₹)"
                            name="basicSalary"
                            type="number"
                            value={formData.basicSalary}
                            onChange={handleChange}
                            required
                            placeholder="50000"
                            icon={<DollarSign size={18} />}
                        />
                        <FormSelect
                            label="Linked User Account"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            options={[
                                { value: '', label: 'None' },
                                ...users.map(u => ({ value: u.id, label: `${u.username} (${u.email})` }))
                            ]}
                        />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="p-8 flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/employees')}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-300 disabled:cursor-not-allowed shadow-sm"
                    >
                        <Save size={20} />
                        {loading ? 'Creating...' : 'Create Employee'}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Helper Components
const FormInput = ({ label, name, type = 'text', value, onChange, required, placeholder, icon, className = '' }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {icon && <div className="absolute left-3 top-3 text-gray-400">{icon}</div>}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
            />
        </div>
    </div>
);

const FormSelect = ({ label, name, value, onChange, options, required }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

export default AddEmployee;
