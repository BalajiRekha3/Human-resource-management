import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

// Employee APIs
export const employeeAPI = {
    getAll: () => api.get('/employees'),
    getById: (id) => api.get(`/employees/${id}`),
    getByCode: (code) => api.get(`/employees/code/${code}`),
    create: (data) => api.post('/employees', data),
    update: (id, data) => api.put(`/employees/${id}`, data),
    delete: (id) => api.delete(`/employees/${id}`),
    search: (keyword) => api.get(`/employees/search?keyword=${keyword}`),
    getByDepartment: (dept) => api.get(`/employees/department/${dept}`),
    getByStatus: (status) => api.get(`/employees/status/${status}`),
    getActiveCount: () => api.get('/employees/count/active'),
    getDeptCount: (dept) => api.get(`/employees/count/department/${dept}`),
};


// Attendance APIs
export const attendanceAPI = {
    clockIn: (employeeId) => {
        console.log('API: Clock in for employee:', employeeId);
        return api.post(`/attendance/clock-in/${employeeId}`);
    },
    clockOut: (employeeId) => {
        console.log('API: Clock out for employee:', employeeId);
        return api.post(`/attendance/clock-out/${employeeId}`);
    },
    markAttendance: (data) => api.post('/attendance/mark', data),
    updateAttendance: (id, data) => api.put(`/attendance/${id}`, data),
    getById: (id) => api.get(`/attendance/${id}`),
    getTodayAttendance: (employeeId) => api.get(`/attendance/today/${employeeId}`),
    getEmployeeAttendance: (employeeId) => {
        console.log('API: Getting employee attendance for:', employeeId);
        return api.get(`/attendance/employee/${employeeId}`);
    },
    getByDate: (date) => {
        console.log('API: Getting attendance by date:', date);
        return api.get(`/attendance/date/${date}`);
    },
    getMonthlyAttendance: (employeeId, startDate, endDate) => {
        console.log('API: Getting monthly attendance for:', employeeId);
        return api.get(`/attendance/employee/${employeeId}/monthly`, {
            params: { startDate, endDate }
        });
    },
    getAttendanceSummary: (employeeId, startDate, endDate) =>
        api.get(`/attendance/employee/${employeeId}/summary`, {
            params: { startDate, endDate }
        }),
    deleteAttendance: (id) => api.delete(`/attendance/${id}`),
};

// Leave Type APIs
export const leaveTypeAPI = {
    getAll: () => api.get('/leave-types'),
    getActive: () => api.get('/leave-types/active'),
    getById: (id) => api.get(`/leave-types/${id}`),
    create: (data) => api.post('/leave-types/createLeavType', data), // Note: typo in backend URL
    update: (id, data) => api.put(`/leave-types/${id}`, data),
    delete: (id) => api.delete(`/leave-types/${id}`),
};

// Leave APIs
export const leaveAPI = {
    apply: (data) => api.post('/leaves/apply', data),
    approve: (id, approverId) => api.put(`/leaves/${id}/approve?approverEmployeeId=${approverId}`),
    reject: (id, reason) => api.put(`/leaves/${id}/reject?rejectionReason=${reason}`),
    getEmployeeLeaves: (employeeId) => api.get(`/leaves/employee/${employeeId}`),
    getPendingLeaves: () => api.get('/leaves/pending'),
    getById: (id) => api.get(`/leaves/${id}`),
};

// Leave Balance APIs
export const leaveBalanceAPI = {
    get: (empId, typeId, year) => api.get(`/leave-balances/${empId}/${typeId}/${year}`),
    getAllForEmployee: (empId, year) => api.get(`/leave-balances/employee/${empId}/year/${year}`),
    initialize: (empId, year) => api.post(`/leave-balances/initialize/${empId}/${year}`),
};

// Payroll APIs
export const payrollAPI = {
    generate: (params) => api.post('/payroll/generate', null, { params }),
    getEmployeePayrolls: (employeeId) => api.get(`/payroll/employee/${employeeId}`),
    getById: (id) => api.get(`/payroll/${id}`),
    updateStatus: (id, status) => api.put(`/payroll/${id}/status`, null, { params: { status } }),
};


export const userAPI = {
    getAll: () => api.get('/users'),
};

export default api;
