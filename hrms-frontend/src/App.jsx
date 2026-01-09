import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import AttendanceList from './pages/AttendanceList';
import LeaveApply from './pages/ApplyLeave';
import ApproveLeavesPage from './pages/ApproveLeavesPage';
import MyLeavesPage from './pages/MyLeavesPage';
import LeaveTypesPage from './pages/LeaveTypesPage';
import ProfilePage from './pages/ProfilePage';
import MyPaySlips from './pages/MyPaySlips';
import PayrollPage from './pages/PayrollPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import HolidayPage from './pages/HolidayPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';

const EmployeeRoute = () => {
  const { isAdmin, isHR } = useAuth();
  return isAdmin || isHR ? <EmployeeList /> : <ProfilePage />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            {/* Employee Routes */}
            <Route
              path="employees"
              element={
                <EmployeeRoute />
              }
            />
            <Route path="employees/add" element={<AddEmployee />} />
            <Route path="employees/edit/:id" element={<EditEmployee />} />

            {/* Attendance Routes */}
            <Route path="attendance" element={<AttendanceList />} />

            {/* Leave Routes */}
            <Route path="leave" element={<MyLeavesPage />} />
            <Route path="leave/apply" element={<LeaveApply />} />
            <Route path="leave/approve" element={<ApproveLeavesPage />} />
            <Route path="leave/types" element={<LeaveTypesPage />} />

            {/* Payroll & Profile */}
            <Route path="payroll" element={<PayrollPage />} />
            <Route path="payslips" element={<MyPaySlips />} />
            <Route path="holidays" element={<HolidayPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
