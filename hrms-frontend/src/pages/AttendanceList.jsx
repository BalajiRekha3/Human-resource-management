import React, { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import { attendanceAPI, employeeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    Clock,
    LogOut,
    Plus,
    Edit,
    Trash2,
    Eye,
    Download,
    Filter,
    Calendar,
    User,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    X,
    ArrowLeft,
} from 'lucide-react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';

const AttendanceList = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [globalFilter, setGlobalFilter] = useState('');
    const [showClockModal, setShowClockModal] = useState(false);
    const [selectedEmployeeForClock, setSelectedEmployeeForClock] = useState(null);
    const [attendanceSummary, setAttendanceSummary] = useState(null);
    const [viewDetails, setViewDetails] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [clockingIn, setClockingin] = useState(false);

    const { user, isAdmin, isHR, isEmployee, employeeId: currentEmployeeId } = useAuth();

    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        if (isAdmin || isHR) {
            fetchEmployees();
            fetchTodayAttendance();
        } else if (isEmployee && currentEmployeeId) {
            setSelectedEmployee(currentEmployeeId);
            // fetchMonthlyAttendance will be triggered by the effect on selectedEmployee
        }
    }, [isAdmin, isHR, isEmployee, currentEmployeeId]);

    useEffect(() => {
        if (selectedEmployee) {
            console.log('📍 Fetching monthly attendance for employee:', selectedEmployee);
            fetchMonthlyAttendance();
        }
    }, [selectedEmployee, selectedMonth]);

    const fetchEmployees = async () => {
        try {
            console.log('🔄 Fetching employees...');
            const response = await employeeAPI.getAll();
            setEmployees(response.data || []);
            console.log('✅ Employees loaded:', response.data?.length);
        } catch (error) {
            console.error('❌ Error fetching employees:', error);
            toast.error('Failed to fetch employees');
            setEmployees([]);
        }
    };

    const fetchTodayAttendance = async () => {
        try {
            setLoading(true);
            const today = new Date().toISOString().split('T')[0];
            console.log('🔄 Fetching attendance for date:', today);

            const response = await attendanceAPI.getByDate(today);
            console.log('📦 API Response:', response.data);

            if (response && response.data) {
                const data = Array.isArray(response.data) ? response.data : [];
                setAttendanceRecords(data);
                console.log('✅ Attendance records loaded:', data.length);
            } else {
                console.warn('⚠️ No data in response');
                setAttendanceRecords([]);
            }
        } catch (error) {
            console.error('❌ Error fetching attendance:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
            } else {
                toast.error('Failed to fetch attendance records');
            }
            setAttendanceRecords([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchMonthlyAttendance = async () => {
        try {
            setLoading(true);
            const [year, month] = selectedMonth.split('-');
            const startDate = `${year}-${month}-01`;
            const endDate = new Date(year, parseInt(month), 0).toISOString().split('T')[0];

            console.log('🔄 Fetching monthly attendance:', { startDate, endDate });

            const response = await attendanceAPI.getMonthlyAttendance(
                selectedEmployee,
                startDate,
                endDate
            );

            if (response && response.data) {
                setAttendanceRecords(Array.isArray(response.data) ? response.data : []);
                console.log('✅ Monthly records loaded:', response.data?.length);
            }

            // Fetch summary
            const summaryResponse = await attendanceAPI.getAttendanceSummary(
                selectedEmployee,
                startDate,
                endDate
            );

            if (summaryResponse && summaryResponse.data) {
                setAttendanceSummary(summaryResponse.data);
                console.log('✅ Summary loaded:', summaryResponse.data);
            }
        } catch (error) {
            console.error('❌ Error fetching monthly attendance:', error);
            toast.error('Failed to fetch attendance records');
            setAttendanceRecords([]);
        } finally {
            setLoading(false);
        }
    };

    const formatLateTime = (minutes) => {
        if (!minutes) return '0 min';
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hrs > 0) {
            return `${hrs} hr${hrs > 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
        }
        return `${mins} min${mins !== 1 ? 's' : ''}`;
    };

    const handleClockIn = async (employeeId) => {
        try {
            if (!employeeId) {
                toast.error('❌ Please select an employee');
                return;
            }

            setClockingin(true);
            console.log('🕐 Clocking in for employee:', employeeId);

            const response = await attendanceAPI.clockIn(employeeId);
            console.log('✅ Clock in response:', response.data);

            if (response && response.data) {
                const clockInTime = response.data.clockInTime;
                toast.success(`✅ Clock In successful at ${clockInTime}`);

                if (response.data.isLate) {
                    toast.warning(`⚠️ Clocked in ${formatLateTime(response.data.lateMinutes)} late`);
                } else {
                    toast.info('✓ You are on time!');
                }

                // Close modal immediately
                setShowClockModal(false);
                setSelectedEmployeeForClock(null);

                // Refresh attendance data after delay
                console.log('⏳ Scheduling attendance refresh...');
                await new Promise(resolve => setTimeout(resolve, 800));

                console.log('🔄 Refreshing attendance data...');
                await fetchTodayAttendance();
                console.log('✅ Attendance data refreshed');
            }
        } catch (error) {
            console.error('❌ Clock in error:', error);
            const errorMsg =
                error.response?.data?.message ||
                error.message ||
                'Failed to clock in. Please try again.';
            toast.error(`❌ ${errorMsg}`);
        } finally {
            setClockingin(false);
        }
    };

    const handleClockOut = async (employeeId) => {
        try {
            if (!employeeId) {
                toast.error('❌ Please select an employee');
                return;
            }

            setClockingin(true);
            console.log('🕐 Clocking out for employee:', employeeId);

            const response = await attendanceAPI.clockOut(employeeId);
            console.log('✅ Clock out response:', response.data);

            if (response && response.data) {
                const clockOutTime = response.data.clockOutTime;
                toast.success(`✅ Clock Out successful at ${clockOutTime}`);

                if (response.data.workingHours) {
                    toast.info(`📊 Total working hours: ${response.data.workingHours} hrs`);
                }

                // Close modal immediately
                setShowClockModal(false);
                setSelectedEmployeeForClock(null);

                // Refresh attendance data after delay
                console.log('⏳ Scheduling attendance refresh...');
                await new Promise(resolve => setTimeout(resolve, 800));

                console.log('🔄 Refreshing attendance data...');
                await fetchTodayAttendance();
                console.log('✅ Attendance data refreshed');
            }
        } catch (error) {
            console.error('❌ Clock out error:', error);
            const errorMsg =
                error.response?.data?.message ||
                error.message ||
                'Failed to clock out. Please try again.';
            toast.error(`❌ ${errorMsg}`);
        } finally {
            setClockingin(false);
        }
    };

    const handleDelete = async () => {
        try {
            console.log('🗑️ Deleting attendance record:', recordToDelete.id);
            await attendanceAPI.deleteAttendance(recordToDelete.id);
            toast.success('✅ Attendance record deleted successfully!');
            setShowDeleteModal(false);
            setRecordToDelete(null);
            await fetchTodayAttendance();
        } catch (error) {
            console.error('❌ Error deleting record:', error);
            toast.error('Failed to delete attendance record');
        }
    };

    const handleExport = () => {
        try {
            const csv = [
                ['Date', 'Employee Name', 'Code', 'Clock In', 'Clock Out', 'Working Hours', 'Status', 'Late'],
                ...attendanceRecords.map((record) => [
                    record.attendanceDate,
                    record.employeeName,
                    record.employeeCode,
                    record.clockInTime || 'N/A',
                    record.clockOutTime || 'N/A',
                    record.workingHours || 'N/A',
                    record.status,
                    record.isLate ? `${record.lateMinutes} mins` : 'No',
                ]),
            ]
                .map((row) => row.join(','))
                .join('\n');

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `attendance_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('✅ Attendance data exported successfully!');
        } catch (error) {
            console.error('❌ Export error:', error);
            toast.error('Failed to export data');
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'attendanceDate',
                header: 'Date',
                cell: (info) => {
                    const date = new Date(info.getValue());
                    return date.toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                    });
                },
            },
            {
                accessorKey: 'employeeName',
                header: 'Employee',
                cell: (info) => (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-xs">
                                {info.getValue().charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span className="font-medium">{info.getValue()}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'employeeCode',
                header: 'Code',
                cell: (info) => <span className="font-mono text-sm text-gray-600">{info.getValue()}</span>,
            },
            {
                accessorKey: 'clockInTime',
                header: 'Clock In',
                cell: (info) => {
                    const time = info.getValue();
                    return time ? (
                        <span className="text-green-600 font-medium">{time}</span>
                    ) : (
                        <span className="text-gray-400">-</span>
                    );
                },
            },
            {
                accessorKey: 'clockOutTime',
                header: 'Clock Out',
                cell: (info) => {
                    const time = info.getValue();
                    return time ? (
                        <span className="text-red-600 font-medium">{time}</span>
                    ) : (
                        <span className="text-gray-400">-</span>
                    );
                },
            },
            {
                accessorKey: 'workingHours',
                header: 'Hours',
                cell: (info) => {
                    const hours = info.getValue();
                    return hours ? (
                        <span className="font-semibold">{hours} hrs</span>
                    ) : (
                        <span className="text-gray-400">-</span>
                    );
                },
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: (info) => {
                    const status = info.getValue();
                    const statusConfig = {
                        PRESENT: { bg: 'bg-green-100', text: 'text-green-700' },
                        ABSENT: { bg: 'bg-red-100', text: 'text-red-700' },
                        HALF_DAY: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
                        LEAVE: { bg: 'bg-blue-100', text: 'text-blue-700' },
                        HOLIDAY: { bg: 'bg-gray-100', text: 'text-gray-700' },
                    };
                    const config = statusConfig[status] || statusConfig.ABSENT;
                    return (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                            {status}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'isLate',
                header: 'Late',
                cell: (info) => {
                    const isLate = info.getValue();
                    const row = info.row.original;
                    return isLate ? (
                        <span className="text-red-600 font-medium flex items-center gap-1">
                            <AlertCircle size={16} />
                            {row.lateMinutes} min
                        </span>
                    ) : (
                        <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle size={16} />
                            On Time
                        </span>
                    );
                },
            },
        ].filter(col => {
            if (col.id === 'actions') {
                return isAdmin || isHR;
            }
            return true;
        }),
        [isAdmin, isHR]
    );

    const table = useReactTable({
        data: attendanceRecords,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
                    <p className="text-gray-600 mt-1">Track employee attendance and working hours</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
                    >
                        <Download size={20} />
                        Export
                    </button>
                    <button
                        onClick={() => {
                            if (isEmployee && currentEmployeeId) {
                                setSelectedEmployeeForClock(currentEmployeeId);
                            }
                            setShowClockModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        <Clock size={20} />
                        Clock In/Out
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Employee Filter */}
                    {(isAdmin || isHR) && (
                        <select
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Today's Attendance</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.fullName} ({emp.employeeCode})
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Month Filter */}
                    {selectedEmployee && (
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    )}

                    {/* Search */}
                    {(isAdmin || isHR) && (
                        <input
                            type="text"
                            placeholder="Search attendance..."
                            value={globalFilter ?? ''}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                </div>
            </div>

            {/* Attendance Summary */}
            {attendanceSummary && selectedEmployee && (
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    <SummaryCard
                        title="Present"
                        value={attendanceSummary.presentDays}
                        icon={<CheckCircle className="text-green-600" size={24} />}
                        bgColor="bg-green-50"
                    />
                    <SummaryCard
                        title="Absent"
                        value={attendanceSummary.absentDays}
                        icon={<XCircle className="text-red-600" size={24} />}
                        bgColor="bg-red-50"
                    />
                    <SummaryCard
                        title="Half Day"
                        value={attendanceSummary.halfDays}
                        icon={<AlertCircle className="text-yellow-600" size={24} />}
                        bgColor="bg-yellow-50"
                    />
                    <SummaryCard
                        title="Leave"
                        value={attendanceSummary.leaveDays}
                        icon={<Calendar className="text-blue-600" size={24} />}
                        bgColor="bg-blue-50"
                    />
                    <SummaryCard
                        title="Late Days"
                        value={attendanceSummary.lateDays}
                        icon={<Clock className="text-orange-600" size={24} />}
                        bgColor="bg-orange-50"
                    />
                    <SummaryCard
                        title="Attendance %"
                        value={`${attendanceSummary.attendancePercentage}%`}
                        icon={<CheckCircle className="text-purple-600" size={24} />}
                        bgColor="bg-purple-50"
                    />
                    <SummaryCard
                        title="Total Hours"
                        value={`${attendanceSummary.totalWorkingHours} hrs`}
                        icon={<Clock className="text-indigo-600" size={24} />}
                        bgColor="bg-indigo-50"
                    />
                    <SummaryCard
                        title="Working Days"
                        value={attendanceSummary.totalWorkingDays}
                        icon={<Calendar className="text-pink-600" size={24} />}
                        bgColor="bg-pink-50"
                    />
                </div>
            )}

            {/* Attendance Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={
                                                        header.column.getCanSort()
                                                            ? 'cursor-pointer select-none flex items-center gap-2'
                                                            : ''
                                                    }
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-8 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50 transition">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-8 text-center">
                                        <p className="text-gray-500 font-medium">No attendance records found</p>
                                        <p className="text-gray-400 text-sm mt-1">Clock in/out to record attendance</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {attendanceRecords.length > 0 && (
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="text-sm text-gray-700">
                                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                                {Math.min(
                                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                    attendanceRecords.length
                                )}{' '}
                                of {attendanceRecords.length} records
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronsLeft size={20} />
                                </button>
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                </span>

                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={20} />
                                </button>
                                <button
                                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                    disabled={!table.getCanNextPage()}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronsRight size={20} />
                                </button>

                                <select
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                                    className="ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    {[10, 20, 30, 50].map((pageSize) => (
                                        <option key={pageSize} value={pageSize}>
                                            Show {pageSize}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Clock In/Out Modal */}
            {showClockModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Clock className="text-blue-600" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Clock In / Out</h2>
                            <p className="text-gray-600">Select an employee to record attendance</p>
                        </div>

                        <div className="space-y-4">
                            {(isAdmin || isHR) ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Employee *
                                    </label>
                                    <select
                                        value={selectedEmployeeForClock || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setSelectedEmployeeForClock(value ? parseInt(value) : null);
                                        }}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Choose an employee...</option>
                                        {employees.map((emp) => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.fullName} ({emp.employeeCode})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                                    <p className="text-sm text-blue-700 font-medium">Employee:</p>
                                    <p className="text-lg font-bold text-blue-900">{user?.username}</p>
                                    <p className="text-xs text-blue-600 mt-1">Ready to clock in/out for today.</p>
                                </div>
                            )}

                            {selectedEmployeeForClock && (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <p className="text-sm text-blue-700 font-medium">Current Time:</p>
                                    <p className="text-2xl font-bold text-blue-600 mt-1">
                                        {new Date().toLocaleTimeString('en-IN')}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    onClick={() => {
                                        setShowClockModal(false);
                                        setSelectedEmployeeForClock(null);
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
                                    disabled={clockingIn}
                                >
                                    Cancel
                                </button>
                                {selectedEmployeeForClock && (
                                    <>
                                        <button
                                            onClick={() => handleClockIn(selectedEmployeeForClock)}
                                            disabled={clockingIn}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:bg-green-300 disabled:cursor-not-allowed"
                                        >
                                            <Clock size={20} />
                                            {clockingIn ? 'Clocking...' : 'Clock In'}
                                        </button>
                                        <button
                                            onClick={() => handleClockOut(selectedEmployeeForClock)}
                                            disabled={clockingIn}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:bg-red-300 disabled:cursor-not-allowed"
                                        >
                                            <LogOut size={20} />
                                            {clockingIn ? 'Processing...' : 'Clock Out'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {viewDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Attendance Details</h2>
                            <button
                                onClick={() => setViewDetails(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem label="Date" value={viewDetails.attendanceDate} />
                                <DetailItem label="Employee" value={viewDetails.employeeName} />
                                <DetailItem label="Employee Code" value={viewDetails.employeeCode} />
                                <DetailItem label="Status" value={viewDetails.status} />
                                <DetailItem label="Clock In" value={viewDetails.clockInTime || 'N/A'} />
                                <DetailItem label="Clock Out" value={viewDetails.clockOutTime || 'N/A'} />
                                <DetailItem label="Working Hours" value={viewDetails.workingHours ? `${viewDetails.workingHours} hrs` : 'N/A'} />
                                <DetailItem label="Late" value={viewDetails.isLate ? `${viewDetails.lateMinutes} mins` : 'On Time'} />
                            </div>

                            {viewDetails.remarks && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-2 font-medium">Remarks</p>
                                    <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">{viewDetails.remarks}</p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <button
                                    onClick={() => setViewDetails(null)}
                                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && recordToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="text-red-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Attendance Record</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete the attendance record for{' '}
                                <span className="font-semibold">{recordToDelete?.employeeName}</span> on{' '}
                                <span className="font-semibold">{recordToDelete?.attendanceDate}</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setRecordToDelete(null);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================
// HELPER COMPONENTS
// ============================================

const SummaryCard = ({ title, value, icon, bgColor }) => (
    <div className={`${bgColor} rounded-lg p-4 text-center border border-gray-200 hover:shadow-md transition-shadow`}>
        <div className="flex justify-center mb-2">{icon}</div>
        <p className="text-sm text-gray-600 mb-1 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
);

const DetailItem = ({ label, value, className = '' }) => (
    <div className={className}>
        <p className="text-sm text-gray-500 mb-1 font-medium">{label}</p>
        <p className="text-base font-semibold text-gray-900">{value || 'N/A'}</p>
    </div>
);

export default AttendanceList;
