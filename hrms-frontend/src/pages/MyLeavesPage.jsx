// src/pages/MyLeavesPage.jsx
import React, { useState, useEffect } from 'react';
import { leaveService } from '../services/leaveService';
import LeaveStatusBadge from '../components/LeaveStatusBadge';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const MyLeavesPage = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const employeeId = user?.employeeId; // Get from auth context

    useEffect(() => {
        fetchMyLeaves();
    }, []);

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

    const filteredLeaves = filterStatus === 'ALL'
        ? leaves
        : leaves.filter(leave => leave.status === filterStatus);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'text-yellow-600';
            case 'APPROVED':
                return 'text-green-600';
            case 'REJECTED':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Leaves</h1>
                        <button
                            onClick={fetchMyLeaves}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                            Refresh
                        </button>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2 mb-6">
                        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition ${filterStatus === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Leaves Table */}
                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Loading leaves...</p>
                        </div>
                    ) : filteredLeaves.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No leaves found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Leave Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            From Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            To Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Days
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Reason
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredLeaves.map(leave => (
                                        <tr key={leave.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {leave.leaveTypeName}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(leave.fromDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(leave.toDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {leave.numberOfDays}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <LeaveStatusBadge status={leave.status} />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {leave.reason}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Summary Stats */}
                    {filteredLeaves.length > 0 && (
                        <div className="mt-8 grid grid-cols-4 gap-4">
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {leaves.filter(l => l.status === 'PENDING').length}
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Approved</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {leaves.filter(l => l.status === 'APPROVED').length}
                                </p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Rejected</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {leaves.filter(l => l.status === 'REJECTED').length}
                                </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Total Days</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {leaves.reduce((sum, l) => sum + l.numberOfDays, 0)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyLeavesPage;
