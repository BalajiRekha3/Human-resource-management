// src/pages/MyLeavesPage.jsx
import React, { useState, useEffect } from 'react';
import { leaveService } from '../services/leaveService';
import LeaveStatusBadge from '../components/LeaveStatusBadge';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const MyLeavesPage = () => {
    const { user, isAdmin, isHR } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('ALL'); // For My Leaves
    const employeeId = user?.employeeId;
    const [activeTab, setActiveTab] = useState('MY_LEAVES');

    // Management State
    const [allLeaves, setAllLeaves] = useState([]);
    const [manageFilter, setManageFilter] = useState('ALL'); // For HR View
    const [rejectionReason, setRejectionReason] = useState({});

    useEffect(() => {
        const isValidEmployeeId = employeeId && employeeId !== 'null' && employeeId !== 'undefined';

        if (activeTab === 'MY_LEAVES' && isValidEmployeeId) {
            fetchMyLeaves();
        } else if (activeTab === 'MANAGE_LEAVES' && (isAdmin || isHR)) {
            fetchAllLeaves();
        }
    }, [activeTab, employeeId, isAdmin, isHR, manageFilter]);

    const fetchMyLeaves = async () => {
        setLoading(true);
        try {
            const response = await leaveService.getEmployeeLeaves(employeeId);
            setLeaves(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch leaves');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllLeaves = async () => {
        setLoading(true);
        try {
            const response = await leaveService.getAllLeaves(manageFilter);
            setAllLeaves(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch all leaves');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (leaveId) => {
        if (!isAdmin && (!employeeId || employeeId === 'null' || employeeId === 'undefined')) {
            toast.error('Action failed: Your account is not linked to an Employee Profile.');
            return;
        }
        try {
            const approverId = (employeeId && employeeId !== 'null' && employeeId !== 'undefined') ? employeeId : null;
            const response = await leaveService.approveLeave(leaveId, approverId);
            if (response.success) {
                toast.success('Leave approved successfully!');
                fetchAllLeaves();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to approve leave');
        }
    };

    const handleReject = async (leaveId) => {
        if (!isAdmin && (!employeeId || employeeId === 'null' || employeeId === 'undefined')) {
            toast.error('Action failed: Your account is not linked to an Employee Profile.');
            return;
        }
        if (!rejectionReason[leaveId]) {
            toast.error('Please enter rejection reason');
            return;
        }
        try {
            const approverId = (employeeId && employeeId !== 'null' && employeeId !== 'undefined') ? employeeId : null;
            const response = await leaveService.rejectLeave(leaveId, rejectionReason[leaveId], approverId);
            if (response.success) {
                toast.success('Leave rejected successfully!');
                fetchAllLeaves();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to reject leave');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold';
            case 'REJECTED': return 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-semibold';
            case 'PENDING': return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs font-semibold';
            default: return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-semibold';
        }
    };

    const filteredMyLeaves = filterStatus === 'ALL'
        ? leaves
        : leaves.filter(leave => leave.status === filterStatus);

    return (
        <div className="min-h-screen bg-gray-50 py-0 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Tabs for HR/Admin */}
                {(isAdmin || isHR) && (
                    <div className="flex space-x-4 mb-8 bg-white p-2 rounded-lg shadow-sm w-fit mx-auto">
                        <button
                            onClick={() => setActiveTab('MY_LEAVES')}
                            className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'MY_LEAVES' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            My Leaves
                        </button>
                        <button
                            onClick={() => setActiveTab('MANAGE_LEAVES')}
                            className={`px-6 py-2 rounded-lg font-medium transition ${activeTab === 'MANAGE_LEAVES' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Manage All Leaves
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-8">
                    {activeTab === 'MY_LEAVES' ? (
                        <>
                            <div className="flex justify-between items-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-900">My Leave History</h1>
                                <button
                                    onClick={fetchMyLeaves}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Refresh
                                </button>
                            </div>

                            {/* My Leaves Filters */}
                            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => {
                                    const count = status === 'ALL'
                                        ? leaves.length
                                        : leaves.filter(l => l.status === status).length;
                                    return (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status)}
                                            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 whitespace-nowrap ${filterStatus === status
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                }`}
                                        >
                                            {status}
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filterStatus === status ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* My Leaves Content */}
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-600 mt-4">Loading leaves...</p>
                                </div>
                            ) : filteredMyLeaves.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <p className="text-gray-600 text-lg">No leave history found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                {['Type', 'From', 'To', 'Days', 'Status', 'Reason'].map(h => (
                                                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredMyLeaves.map(leave => (
                                                <tr key={leave.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 font-medium text-gray-900">{leave.leaveTypeName}</td>
                                                    <td className="px-6 py-4 text-gray-600">{new Date(leave.fromDate).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 text-gray-600">{new Date(leave.toDate).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 font-medium">{leave.numberOfDays}</td>
                                                    <td className="px-6 py-4"><span className={getStatusColor(leave.status)}>{leave.status}</span></td>
                                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{leave.reason}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Manage Leaves View (HR Only) */
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                                <h1 className="text-3xl font-bold text-gray-900">Manage Employee Leaves</h1>

                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setManageFilter(status)}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${manageFilter === status
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={fetchAllLeaves}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Refresh
                                </button>
                            </div>

                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-600 mt-4">Loading all leaves...</p>
                                </div>
                            ) : allLeaves.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <p className="text-gray-600 text-lg">No leave requests found</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {allLeaves.map(leave => (
                                        <div key={leave.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition bg-white">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                                                        {leave.employeeName?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-bold text-gray-900">{leave.employeeName}</p>
                                                        <p className="text-sm text-gray-500">{leave.employeeCode} • {leave.employeeEmail}</p>
                                                    </div>
                                                </div>
                                                <span className={getStatusColor(leave.status)}>{leave.status}</span>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
                                                <div><p className="text-xs text-gray-500 uppercase">Type</p><p className="font-semibold">{leave.leaveTypeName}</p></div>
                                                <div><p className="text-xs text-gray-500 uppercase">Dates</p><p className="font-semibold">{new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}</p></div>
                                                <div><p className="text-xs text-gray-500 uppercase">Days</p><p className="font-semibold">{leave.numberOfDays}</p></div>
                                                <div><p className="text-xs text-gray-500 uppercase">Reason</p><p className="font-semibold truncate" title={leave.reason}>{leave.reason}</p></div>
                                            </div>

                                            {leave.status === 'PENDING' && (isAdmin || isHR) && leave.employeeId !== employeeId && (
                                                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row gap-4">
                                                    <input
                                                        type="text"
                                                        value={rejectionReason[leave.id] || ''}
                                                        onChange={(e) => setRejectionReason(prev => ({ ...prev, [leave.id]: e.target.value }))}
                                                        placeholder="Reason for rejection..."
                                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleApprove(leave.id)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition">Approve</button>
                                                        <button onClick={() => handleReject(leave.id)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition">Reject</button>
                                                    </div>
                                                </div>
                                            )}
                                            {leave.status === 'REJECTED' && leave.rejectionReason && (
                                                <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded">
                                                    <span className="font-bold">Rejection Reason:</span> {leave.rejectionReason}
                                                </p>
                                            )}

                                            {/* Approver Details Footer */}
                                            {(leave.status === 'APPROVED' || leave.status === 'REJECTED') && leave.approverName && (
                                                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
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
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyLeavesPage;
