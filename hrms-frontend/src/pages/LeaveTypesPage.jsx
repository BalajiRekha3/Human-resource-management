// src/pages/LeaveTypesPage.jsx
import React, { useState, useEffect } from 'react';
import { leaveTypeService } from '../services/leaveService';
import { toast } from 'react-toastify';

const LeaveTypesPage = () => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        totalDays: 0,
        isActive: true
    });

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    const fetchLeaveTypes = async () => {
        setLoading(true);
        try {
            const response = await leaveTypeService.getAllLeaveTypes();
            setLeaveTypes(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch leave types');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await leaveTypeService.createLeaveType(formData);
            if (response.success) {
                toast.success('Leave type created successfully!');
                setShowModal(false);
                setFormData({ name: '', description: '', totalDays: 0, isActive: true });
                fetchLeaveTypes();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to create leave type');
        }
    };

    const toggleStatus = async (type) => {
        try {
            const response = await leaveTypeService.updateLeaveType(type.id, {
                ...type,
                isActive: !type.isActive
            });
            if (response.success) {
                toast.success('Status updated!');
                fetchLeaveTypes();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Leave Types</h1>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
                        >
                            + Add Leave Type
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Loading leave types...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {leaveTypes.map(type => (
                                <div key={type.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition bg-white">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-bold text-gray-900">{type.name}</h2>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${type.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {type.isActive ? 'ACTIVE' : 'INACTIVE'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4 h-12 overflow-hidden text-sm">{type.description}</p>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Total Days: <span className="text-gray-900 font-bold">{type.totalDays}</span></span>
                                        <button
                                            onClick={() => toggleStatus(type)}
                                            className="text-blue-600 hover:text-blue-800 font-semibold"
                                        >
                                            {type.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
                        <h2 className="text-2xl font-bold mb-6">Add New Leave Type</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Sick Leave"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Leave for medical reasons"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Days (Per Year)</label>
                                <input
                                    type="number"
                                    name="totalDays"
                                    value={formData.totalDays}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                />
                                <label className="ml-2 text-sm text-gray-700">Set as Active</label>
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveTypesPage;
