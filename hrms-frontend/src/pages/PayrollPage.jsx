import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { payrollService } from '../services/payrollService';

import { employeeAPI } from '../services/api';
import { toast } from 'react-toastify';
import { DollarSign, Users, FileText, Settings, Calendar, Calculator } from 'lucide-react';

const PayrollPage = () => {
    const { user, isHR, isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState('structure'); // structure, generate, history
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Employees
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await employeeAPI.getAll();
            if (response.data) {
                setEmployees(response.data); // api.js returns data directly or wrapped, checking structure
            }
        } catch (error) {
            toast.error("Failed to load employees");
        } finally {
            setLoading(false);
        }
    };

    if (!isHR && !isAdmin) {
        return <div className="p-8 text-center text-red-500">Access Denied</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
                    <p className="text-gray-500 mt-1">Manage salary structures and process monthly payrolls</p>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('structure')}
                    className={`pb-3 px-4 flex items-center gap-2 font-medium transition-colors relative ${activeTab === 'structure' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Settings size={18} />
                    Salary Structures
                    {activeTab === 'structure' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                </button>
                <button
                    onClick={() => setActiveTab('generate')}
                    className={`pb-3 px-4 flex items-center gap-2 font-medium transition-colors relative ${activeTab === 'generate' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Calculator size={18} />
                    Run Payroll
                    {activeTab === 'generate' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px]">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading...</div>
                ) : (
                    <>
                        {activeTab === 'structure' && <SalaryStructureTab employees={employees} />}
                        {activeTab === 'generate' && <RunPayrollTab employees={employees} />}
                    </>
                )}
            </div>
        </div>
    );
};

// Sub-component: Salary Structure Tab
const SalaryStructureTab = ({ employees }) => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [structure, setStructure] = useState({
        basicSalary: '',
        houseRentAllowance: '',
        dearnessAllowance: '',
        medicalAllowance: '',
        transportAllowance: '',
        specialAllowance: '',
        providentFund: '',
        professionalTax: '',
        incomeTax: ''
    });

    const handleSelectEmployee = async (emp) => {
        setSelectedEmployee(emp);
        try {
            const res = await payrollService.getSalaryStructure(emp.id);
            if (res.success && res.data) {
                setStructure(res.data);
            } else {
                // Reset if no structure exists
                setStructure({
                    basicSalary: '',
                    houseRentAllowance: '',
                    dearnessAllowance: '',
                    medicalAllowance: '',
                    transportAllowance: '',
                    specialAllowance: '',
                    providentFund: '',
                    professionalTax: '',
                    incomeTax: ''
                });
            }
        } catch (error) {
            console.log("No structure found, creating new");
            setStructure({
                basicSalary: '',
                houseRentAllowance: '',
                dearnessAllowance: '',
                medicalAllowance: '',
                transportAllowance: '',
                specialAllowance: '',
                providentFund: '',
                professionalTax: '',
                incomeTax: ''
            });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await payrollService.saveSalaryStructure(selectedEmployee.id, structure);
            toast.success("Salary structure saved!");
        } catch (error) {
            toast.error("Failed to save structure");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-x divide-gray-200 h-full">
            {/* Employee List */}
            <div className="md:col-span-1 p-4 border-b md:border-b-0 overflow-y-auto max-h-[600px]">
                <h3 className="font-semibold text-gray-700 mb-4 px-2">Employees</h3>
                <div className="space-y-1">
                    {employees.map(emp => (
                        <button
                            key={emp.id}
                            onClick={() => handleSelectEmployee(emp)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedEmployee?.id === emp.id
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'hover:bg-gray-50 text-gray-600'
                                }`}
                        >
                            {emp.firstName} {emp.lastName}
                        </button>
                    ))}
                </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2 p-6 md:p-8">
                {selectedEmployee ? (
                    <form onSubmit={handleSave} className="max-w-xl space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">
                                Salary Structure for {selectedEmployee.firstName}
                            </h2>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                {selectedEmployee.employeeCode}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Basic Salary</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
                                    <input
                                        type="number"
                                        required
                                        value={structure.basicSalary}
                                        onChange={(e) => setStructure({ ...structure, basicSalary: e.target.value })}
                                        className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Allowances */}
                            <div className="col-span-2 mt-2"><h4 className="text-sm font-semibold text-green-600">Earnings</h4></div>

                            <div>
                                <label className="block text-xs text-gray-500 mb-1">HRA</label>
                                <input type="number" required value={structure.houseRentAllowance} onChange={(e) => setStructure({ ...structure, houseRentAllowance: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">DA</label>
                                <input type="number" required value={structure.dearnessAllowance} onChange={(e) => setStructure({ ...structure, dearnessAllowance: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Medical</label>
                                <input type="number" required value={structure.medicalAllowance} onChange={(e) => setStructure({ ...structure, medicalAllowance: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Transport</label>
                                <input type="number" required value={structure.transportAllowance} onChange={(e) => setStructure({ ...structure, transportAllowance: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Special</label>
                                <input type="number" value={structure.specialAllowance} onChange={(e) => setStructure({ ...structure, specialAllowance: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>

                            {/* Deductions */}
                            <div className="col-span-2 mt-2"><h4 className="text-sm font-semibold text-red-600">Deductions</h4></div>

                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Provident Fund</label>
                                <input type="number" required value={structure.providentFund} onChange={(e) => setStructure({ ...structure, providentFund: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Professional Tax</label>
                                <input type="number" required value={structure.professionalTax} onChange={(e) => setStructure({ ...structure, professionalTax: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Income Tax</label>
                                <input type="number" value={structure.incomeTax} onChange={(e) => setStructure({ ...structure, incomeTax: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                Save Structure
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <Users size={48} className="mb-4 opacity-50" />
                        <p>Select an employee to configure their salary</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Sub-component: Run Payroll Tab
const RunPayrollTab = ({ employees }) => {
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [processing, setProcessing] = useState(false);

    const handleRunPayroll = async (empId) => {
        if (!confirm("Are you sure you want to generate payroll for this employee?")) return;

        setProcessing(true);
        try {
            // Calculate start and end date of selected month
            const [y, m] = month.split('-');
            const startDate = `${y}-${m}-01`;
            const endDate = new Date(y, m, 0).toISOString().slice(0, 10);

            await payrollService.generatePayroll(empId, startDate, endDate);
            toast.success("Payroll generated successfully!");
        } catch (error) {
            toast.error(error.message || "Failed to generate payroll");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <Calendar className="text-gray-500" />
                <div>
                    <label className="block text-xs text-gray-500 font-semibold uppercase mb-1">Select Period</label>
                    <input
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1.5"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <th className="pb-3 pl-2">Employee</th>
                            <th className="pb-3">Designation</th>
                            <th className="pb-3 text-right pr-2">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {employees.map(emp => (
                            <tr key={emp.id} className="hover:bg-gray-50">
                                <td className="py-3 pl-2 font-medium text-gray-900">{emp.firstName} {emp.lastName}</td>
                                <td className="py-3 text-gray-500">{emp.designation}</td>
                                <td className="py-3 text-right pr-2">
                                    <button
                                        onClick={() => handleRunPayroll(emp.id)}
                                        disabled={processing}
                                        className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                                    >
                                        Process Pay
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PayrollPage;
