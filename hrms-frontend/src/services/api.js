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


export default api;
