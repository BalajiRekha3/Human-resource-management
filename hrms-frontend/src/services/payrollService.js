import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const payrollService = {
    // Salary Structure Endpoints
    saveSalaryStructure: async (employeeId, data) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/salary-structures/${employeeId}`,
                data,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getSalaryStructure: async (employeeId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/salary-structures/${employeeId}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Payroll Endpoints
    generatePayroll: async (employeeId, start, end, bonus = 0, deductions = 0) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/payroll/generate?employeeId=${employeeId}&start=${start}&end=${end}&bonus=${bonus}&deductions=${deductions}`,
                {},
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getEmployeePayrolls: async (employeeId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/payroll/employee/${employeeId}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getPayrollById: async (id) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/payroll/${id}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};
