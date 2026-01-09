// src/pages/ApplyLeave.jsx
import React, { useState, useEffect } from 'react';
import { leaveService, leaveTypeService, leaveBalanceService } from '../services/leaveService';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ApplyLeave = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        employeeId: user?.employeeId || null,
        leaveTypeId: '',
        fromDate: '',
        toDate: '',
        numberOfDays: 0,
        reason: ''
    });

    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveBalance, setLeaveBalance] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    const fetchLeaveTypes = async () => {
        try {
            const response = await leaveTypeService.getActiveLeaveTypes();
            setLeaveTypes(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch leave types');
        }
    };

    useEffect(() => {
        if (formData.fromDate && formData.toDate && formData.employeeId) {
            const from = new Date(formData.fromDate);
            const to = new Date(formData.toDate);
            const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
            setFormData(prev => ({ ...prev, numberOfDays: days }));

            if (formData.leaveTypeId) {
                fetchLeaveBalance();
            }
        }
    }, [formData.fromDate, formData.toDate, formData.leaveTypeId, formData.employeeId]);

    const fetchLeaveBalance = async () => {
        try {
            const year = new Date().getFullYear();
            const response = await leaveBalanceService.getLeaveBalance(
                formData.employeeId,
                formData.leaveTypeId,
                year
            );

            // Check if response indicates failure
            if (response && !response.success) {
                setLeaveBalance({
                    totalDays: 0,
                    usedDays: 0,
                    remainingDays: 0
                });
            } else {
                setLeaveBalance(response.data || {});
            }
        } catch (error) {
            // If balance doesn't exist (404) or any error, set to 0 instead of showing error
            setLeaveBalance({
                totalDays: 0,
                usedDays: 0,
                remainingDays: 0
            });
            console.log('Leave balance not found, showing 0 balance');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await leaveService.applyLeave(formData);
            if (response.success) {
                toast.success('Leave applied successfully!');
                setFormData({
                    employeeId: user?.employeeId,
                    leaveTypeId: '',
                    fromDate: '',
                    toDate: '',
                    numberOfDays: 0,
                    reason: ''
                });
            }
        } catch (error) {
            toast.error(error.message || 'Failed to apply leave');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Apply for Leave</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Employee Profile Warning */}
                    {!formData.employeeId && (
                        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-orange-700">
                                        Your user account is not linked to an employee profile.
                                        You won't be able to apply for leave. Please contact HR.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Leave Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Leave Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="leaveTypeId"
                            value={formData.leaveTypeId}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select Leave Type</option>
                            {leaveTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name} - {type.totalDays} days available
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Leave Balance Info */}
                    {leaveBalance.remainingDays !== undefined && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Total Days</p>
                                    <p className="text-xl font-bold text-blue-600">{leaveBalance.totalDays}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Used Days</p>
                                    <p className="text-xl font-bold text-orange-600">{leaveBalance.usedDays}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Remaining Days</p>
                                    <p className="text-xl font-bold text-green-600">{leaveBalance.remainingDays}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* From Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            From Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="fromDate"
                            value={formData.fromDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* To Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            To Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="toDate"
                            value={formData.toDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Number of Days */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Days
                        </label>
                        <input
                            type="number"
                            name="numberOfDays"
                            value={formData.numberOfDays}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed font-bold text-lg"
                        />
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Leave <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            required
                            rows="4"
                            placeholder="Enter reason for your leave..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>


                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading || !formData.employeeId}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                        >
                            {loading ? 'Applying...' : 'Apply Leave'}
                        </button>
                        <button
                            type="reset"
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-200"
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyLeave;
