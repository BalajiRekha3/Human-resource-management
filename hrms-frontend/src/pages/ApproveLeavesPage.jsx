// src/pages/ApproveLeavesPage.jsx
import React, { useState, useEffect } from 'react';
import { leaveService } from '../services/leaveService';
import LeaveStatusBadge from '../components/LeaveStatusBadge';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ApproveLeavesPage = () => {
    const { user } = useAuth();
    const [pendingLeaves, setpendingLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState({});
    const [approverId] = useState(user?.employeeId); // Get from auth context

    useEffect(() => {
        fetchPendingLeaves();
    }, []);

    const fetchPendingLeaves = async () => {
        setLoading(true);
        try {
            const response = await leaveService.getPendingLeaves();
            setpendingLeaves(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch pending leaves');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (leaveId) => {
        try {
            const response = await leaveService.approveLeave(leaveId, approverId);
            if (response.success) {
                toast.success('Leave approved successfully!');
                fetchPendingLeaves();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to approve leave');
        }
    };

    const handleReject = async (leaveId) => {
        if (!rejectionReason[leaveId]) {
            toast.error('Please enter rejection reason');
            return;
        }

        try {
            const response = await leaveService.rejectLeave(leaveId, rejectionReason[leaveId]);
            if (response.success) {
                toast.success('Leave rejected successfully!');
                fetchPendingLeaves();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to reject leave');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Approve Leaves</h1>
                        <button
                            onClick={fetchPendingLeaves}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Loading pending leaves...</p>
                        </div>
                    ) : pendingLeaves.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 text-lg">No pending leaves</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingLeaves.map(leave => (
                                <div key={leave.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Employee</p>
                                            <p className="text-lg font-semibold text-gray-900">{leave.employeeName}</p>
                                            <p className="text-sm text-gray-600">{leave.employeeEmail}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Leave Type</p>
                                            <p className="text-lg font-semibold text-gray-900">{leave.leaveTypeName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Duration</p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {new Date(leave.fromDate).toLocaleDateString()} to {new Date(leave.toDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm text-gray-600">{leave.numberOfDays} days</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Reason</p>
                                            <p className="text-lg font-semibold text-gray-900">{leave.reason}</p>
                                        </div>
                                    </div>

                                    {/* Rejection Reason Input */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rejection Reason (if rejecting)
                                        </label>
                                        <input
                                            type="text"
                                            value={rejectionReason[leave.id] || ''}
                                            onChange={(e) => setRejectionReason(prev => ({
                                                ...prev,
                                                [leave.id]: e.target.value
                                            }))}
                                            placeholder="Enter reason if you want to reject..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleApprove(leave.id)}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(leave.id)}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Stats */}
                    {pendingLeaves.length > 0 && (
                        <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Pending Leaves Count</p>
                            <p className="text-3xl font-bold text-yellow-600">{pendingLeaves.length}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApproveLeavesPage;
