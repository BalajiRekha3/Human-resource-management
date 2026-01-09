import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { employeeAPI, userAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Download,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ArrowUpDown,
    X,
} from 'lucide-react';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [viewEmployee, setViewEmployee] = useState(null);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    // Prevent double fetch
    const fetchedRef = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Only fetch once
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const [empResponse, userResponse] = await Promise.all([
                employeeAPI.getAll(),
                userAPI.getAll()
            ]);

            const employees = empResponse.data;
            const users = userResponse.data;

            // Set of User IDs that are already linked to an employee profile
            const linkedUserIds = new Set(employees.map(e => e.userId).filter(Boolean));

            // Filter users who are NOT linked
            const unlinkedUsers = users.filter(u => !linkedUserIds.has(u.id));

            // Create pseudo-employee objects for these users
            const systemUsers = unlinkedUsers.map(u => ({
                id: `user-${u.id}`, // String ID to avoid collision
                isSystemUser: true,
                employeeCode: `SYS-${u.id}`,
                fullName: u.username || 'System User',
                email: u.email,
                department: 'System/HR', // Indicate they are system users
                designation: u.roles ? u.roles.join(', ') : 'User',
                employmentStatus: 'ACTIVE',
                basicSalary: 0,
                phoneNumber: 'N/A',
                joiningDate: null
            }));

            // Merge
            setEmployees([...employees, ...systemUsers]);

        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch employees and users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            if (employeeToDelete.isSystemUser) {
                const userId = employeeToDelete.id.split('-')[1];
                await userAPI.delete(userId);
            } else {
                await employeeAPI.delete(employeeToDelete.id);
            }
            setShowDeleteModal(false);
            toast.success(`${employeeToDelete.fullName} deleted successfully!`);
            setEmployeeToDelete(null);
            fetchEmployees(); // Refresh list silently
        } catch (error) {
            console.error('Error deleting employee/user:', error);
            toast.error('Failed to delete record');
        }
    };

    const handleExport = () => {
        const csv = [
            ['Employee Code', 'Name', 'Email', 'Phone', 'Department', 'Designation', 'Status', 'Salary'],
            ...filteredData.map((emp) => [
                emp.employeeCode,
                emp.fullName,
                emp.email,
                emp.phoneNumber || 'N/A',
                emp.department,
                emp.designation,
                emp.employmentStatus,
                emp.basicSalary,
            ]),
        ]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success('Employee data exported successfully!');
    };

    // Filter data based on department and status
    const filteredData = useMemo(() => {
        let filtered = employees;

        if (departmentFilter !== 'ALL') {
            filtered = filtered.filter((emp) => emp.department === departmentFilter);
        }

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter((emp) => emp.employmentStatus === statusFilter);
        }

        return filtered;
    }, [employees, departmentFilter, statusFilter]);

    // Table columns definition
    const columns = useMemo(
        () => [
            {
                accessorKey: 'employeeCode',
                header: 'Code',
                cell: (info) => (
                    <span className="font-mono font-semibold text-blue-600">{info.getValue()}</span>
                ),
            },
            {
                accessorKey: 'fullName',
                header: 'Full Name',
                cell: (info) => (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                                {info.getValue().charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span className="font-medium text-gray-900">{info.getValue()}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
            },
            {
                accessorKey: 'phoneNumber',
                header: 'Phone',
                cell: (info) => <span className="text-gray-600">{info.getValue() || 'N/A'}</span>,
            },
            {
                accessorKey: 'department',
                header: 'Department',
                cell: (info) => (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {info.getValue()}
                    </span>
                ),
            },
            {
                accessorKey: 'designation',
                header: 'Designation',
                cell: (info) => <span className="text-gray-700">{info.getValue()}</span>,
            },
            {
                accessorKey: 'employmentStatus',
                header: 'Status',
                cell: (info) => (
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${info.getValue() === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        {info.getValue()}
                    </span>
                ),
            },
            {
                accessorKey: 'basicSalary',
                header: 'Salary',
                cell: (info) => (
                    <span className="font-semibold text-gray-900">
                        ₹{info.getValue()?.toLocaleString('en-IN')}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                if (row.original.isSystemUser) {
                                    navigate('/dashboard/employees/add', {
                                        state: { linkedUser: row.original }
                                    });
                                } else {
                                    setViewEmployee(row.original);
                                }
                            }}
                            className={`p-2 rounded-lg transition ${!row.original.isSystemUser ? 'text-blue-600 hover:bg-blue-50' : 'text-blue-600 hover:bg-blue-50'}`}
                            title={row.original.isSystemUser ? "Complete Profile" : "View Details"}
                        >
                            <Eye size={18} />
                        </button>

                        <button
                            onClick={() => {
                                if (row.original.isSystemUser) {
                                    navigate('/dashboard/employees/add', {
                                        state: { linkedUser: row.original }
                                    });
                                } else {
                                    navigate(`/dashboard/employees/edit/${row.original.id}`);
                                }
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title={row.original.isSystemUser ? "Complete Profile" : "Edit Employee"}
                        >
                            <Edit size={18} />
                        </button>

                        <button
                            onClick={() => {
                                setEmployeeToDelete(row.original);
                                setShowDeleteModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ),
            },
        ],
        [navigate]
    );

    const table = useReactTable({
        data: filteredData,
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
                    <p className="text-gray-600 mt-1">Manage your workforce - {filteredData.length} employees</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
                    >
                        <Download size={20} />
                        Export CSV
                    </button>
                    <Link
                        to="/dashboard/employees/add"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        <Plus size={20} />
                        Add Employee
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={globalFilter ?? ''}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Department Filter */}
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ALL">All Departments</option>
                        <option value="IT">IT</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                        <option value="Sales">Sales</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="TERMINATED">Terminated</option>
                    </select>
                </div>
            </div>

            {/* Table */}
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
                                                        header.column.getCanSort() ? 'cursor-pointer select-none flex items-center gap-2' : ''
                                                    }
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {header.column.getCanSort() && <ArrowUpDown size={14} />}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="text-sm text-gray-700">
                            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                            {Math.min(
                                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                filteredData.length
                            )}{' '}
                            of {filteredData.length} employees
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
            </div>

            {/* View Employee Modal */}
            {viewEmployee && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">{viewEmployee.fullName}</h2>
                                <p className="text-blue-100 mt-1">{viewEmployee.employeeCode}</p>
                            </div>
                            <button
                                onClick={() => setViewEmployee(null)}
                                className="p-2 hover:bg-blue-500 rounded-lg transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Personal Information */}
                            <Section title="Personal Information">
                                <InfoGrid>
                                    <InfoItem label="Full Name" value={viewEmployee.fullName} />
                                    <InfoItem label="Employee Code" value={viewEmployee.employeeCode} />
                                    <InfoItem label="Email" value={viewEmployee.email} />
                                    <InfoItem label="Phone" value={viewEmployee.phoneNumber} />
                                    <InfoItem label="Date of Birth" value={viewEmployee.dateOfBirth} />
                                    <InfoItem label="Age" value={`${viewEmployee.age} years`} />
                                    <InfoItem label="Gender" value={viewEmployee.gender} />
                                </InfoGrid>
                            </Section>

                            {/* Address */}
                            <Section title="Address Information">
                                <InfoGrid>
                                    <InfoItem label="Address" value={viewEmployee.address} className="col-span-2" />
                                    <InfoItem label="City" value={viewEmployee.city} />
                                    <InfoItem label="State" value={viewEmployee.state} />
                                    <InfoItem label="Postal Code" value={viewEmployee.postalCode} />
                                    <InfoItem label="Country" value={viewEmployee.country} />
                                </InfoGrid>
                            </Section>

                            {/* Employment Details */}
                            <Section title="Employment Details">
                                <InfoGrid>
                                    <InfoItem label="Department" value={viewEmployee.department} />
                                    <InfoItem label="Designation" value={viewEmployee.designation} />
                                    <InfoItem label="Joining Date" value={viewEmployee.joiningDate} />
                                    <InfoItem label="Employment Type" value={viewEmployee.employmentType} />
                                    <InfoItem label="Status" value={viewEmployee.employmentStatus} />
                                    <InfoItem
                                        label="Basic Salary"
                                        value={`₹${viewEmployee.basicSalary?.toLocaleString('en-IN')}`}
                                    />
                                </InfoGrid>
                            </Section>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="text-red-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Employee</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete{' '}
                                <span className="font-semibold">{employeeToDelete?.fullName}</span>? This action cannot
                                be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setEmployeeToDelete(null);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
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

// Helper Components
const Section = ({ title, children }) => (
    <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            {title}
        </h3>
        {children}
    </div>
);

const InfoGrid = ({ children }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const InfoItem = ({ label, value, className = '' }) => (
    <div className={className}>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-base font-medium text-gray-900">{value || 'N/A'}</p>
    </div>
);

export default EmployeeList;
