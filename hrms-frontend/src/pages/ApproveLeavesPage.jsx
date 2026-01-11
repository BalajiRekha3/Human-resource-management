// src/pages/ApproveLeavesPage.jsx
import React, { useState, useEffect } from 'react';
import { leaveService } from '../services/leaveService';
import LeaveStatusBadge from '../components/LeaveStatusBadge';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ApproveLeavesPage = () => {
    const { user, isHR, isAdmin } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [rejectionReason, setRejectionReason] = useState({});
    const [approverId] = useState(user?.employeeId);

    useEffect(() => {
        if (approverId) {
            fetchLeaves();
        }
    }, [approverId, statusFilter]);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const response = await leaveService.getAllLeaves(statusFilter);
            setLeaves(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch leaves');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (leaveId) => {
        if (!isAdmin && (!approverId || approverId === 'null' || approverId === 'undefined')) {
            toast.error('Action failed: Your account is not linked to an Employee Profile.');
            return;
        }
        try {
            const validApproverId = (approverId && approverId !== 'null' && approverId !== 'undefined') ? approverId : null;
            const response = await leaveService.approveLeave(leaveId, validApproverId);
            if (response.success) {
                toast.success('Leave approved successfully!');
                fetchLeaves();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to approve leave');
        }
    };

    const handleReject = async (leaveId) => {
        if (!isAdmin && (!approverId || approverId === 'null' || approverId === 'undefined')) {
            toast.error('Action failed: Your account is not linked to an Employee Profile.');
            return;
        }
        if (!rejectionReason[leaveId]) {
            toast.error('Please enter rejection reason');
            return;
        }

        try {
            const validApproverId = (approverId && approverId !== 'null' && approverId !== 'undefined') ? approverId : null;
            const response = await leaveService.rejectLeave(leaveId, rejectionReason[leaveId], validApproverId);
            if (response.success) {
                toast.success('Leave rejected successfully!');
                fetchLeaves();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to reject leave');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const tabs = [
        { id: 'ALL', label: 'All Leaves' },
        { id: 'PENDING', label: 'Pending' },
        { id: 'APPROVED', label: 'Approved' },
        { id: 'REJECTED', label: 'Rejected' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-0 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>

                        {/* Status Filter Tabs */}
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setStatusFilter(tab.id)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === tab.id
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={fetchLeaves}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Loading leaves...</p>
                        </div>
                    ) : leaves.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 text-lg">No leaves found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {leaves.map(leave => (
                                <div key={leave.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            {leave.employeeProfileImage ? (
                                                <img
                                                    src={leave.employeeProfileImage}
                                                    alt={leave.employeeName}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                    {leave.employeeName?.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-lg font-semibold text-gray-900">{leave.employeeName}</p>
                                                <p className="text-sm text-gray-500">{leave.employeeCode}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(leave.status)}`}>
                                            {leave.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Type</p>
                                            <p className="font-medium text-gray-900">{leave.leaveTypeName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Duration</p>
                                            <p className="font-medium text-gray-900">{leave.numberOfDays} days</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">From</p>
                                            <p className="font-medium text-gray-900">{new Date(leave.fromDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">To</p>
                                            <p className="font-medium text-gray-900">{new Date(leave.toDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600"><span className="font-medium">Reason:</span> {leave.reason}</p>
                                        {leave.rejectionReason && (
                                            <p className="text-sm text-red-600 mt-1"><span className="font-medium">Rejection Reason:</span> {leave.rejectionReason}</p>
                                        )}

                                        {/* Approver Details */}
                                        {(leave.status === 'APPROVED' || leave.status === 'REJECTED') && leave.approverName && (
                                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    {leave.status === 'APPROVED' ? 'Accepted by' : 'Rejected by'}:
                                                </span>
                                                <div className="text-right">
                                                    <span className="text-sm font-medium text-gray-900 block">
                                                        {leave.approverName}
                                                    </span>
                                                    {leave.approverDesignation && (
                                                        <span className="text-xs text-gray-500 block">
                                                            {leave.approverDesignation}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons - Only for Pending Leaves - Hidden for non-Admin/HR and Self */}
                                    {leave.status === 'PENDING' && (isAdmin || isHR) && leave.employeeId !== user?.employeeId && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <input
                                                    type="text"
                                                    value={rejectionReason[leave.id] || ''}
                                                    onChange={(e) => setRejectionReason(prev => ({
                                                        ...prev,
                                                        [leave.id]: e.target.value
                                                    }))}
                                                    placeholder="Reason for rejection (required to reject)"
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApprove(leave.id)}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(leave.id)}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApproveLeavesPage;
