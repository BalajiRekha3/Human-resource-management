// src/services/leaveService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

// Leave Type APIs
export const leaveTypeService = {
    // Create Leave Type
    createLeaveType: async (leaveTypeData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/leave-types/createLeavType`,
                leaveTypeData,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get All Leave Types
    getAllLeaveTypes: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/leave-types`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get Active Leave Types
    getActiveLeaveTypes: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/leave-types/active`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get Leave Type by ID
    getLeaveTypeById: async (id) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/leave-types/${id}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update Leave Type
    updateLeaveType: async (id, leaveTypeData) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/leave-types/${id}`,
                leaveTypeData,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete Leave Type
    deleteLeaveType: async (id) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/leave-types/${id}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

// Leave APIs
export const leaveService = {
    // Apply for Leave
    applyLeave: async (leaveData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/leaves/apply`,
                leaveData,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Approve Leave
    approveLeave: async (leaveId, approverEmployeeId) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/leaves/${leaveId}/approve?approverEmployeeId=${approverEmployeeId}`,
                {},
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Reject Leave
    rejectLeave: async (leaveId, rejectionReason) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/leaves/${leaveId}/reject?rejectionReason=${encodeURIComponent(rejectionReason)}`,
                {},
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get Leave by ID
    getLeaveById: async (leaveId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/leaves/${leaveId}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get Employee's Leaves
    getEmployeeLeaves: async (employeeId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/leaves/employee/${employeeId}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get Employee's Leaves by Year
    getEmployeeLeavesbyYear: async (employeeId, year) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/leaves/employee/${employeeId}/year/${year}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get Pending Leaves (for approval)
    getPendingLeaves: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/leaves/pending`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

// Leave Balance APIs
export const leaveBalanceService = {
    // Initialize Leave Balance
    initializeLeaveBalance: async (employeeId, year) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/leave-balances/initialize/${employeeId}/${year}`,
                {},
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get Leave Balance
    getLeaveBalance: async (employeeId, leaveTypeId, year) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/leave-balances/${employeeId}/${leaveTypeId}/${year}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get All Leave Balances for Employee
    getEmployeeLeaveBalances: async (employeeId, year) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/leave-balances/employee/${employeeId}/year/${year}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};
