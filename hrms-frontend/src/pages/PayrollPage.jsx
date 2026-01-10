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

    const [percentages, setPercentages] = useState({
        houseRentAllowance: '',
        dearnessAllowance: '',
        medicalAllowance: '',
        transportAllowance: '',
        specialAllowance: '',
        providentFund: '',
        professionalTax: '',
        incomeTax: ''
    });

    // Helper: Calculate Percentage from Amount
    const calcPercent = (amount, basic) => {
        if (!amount || !basic || parseFloat(basic) === 0) return '';
        const p = (parseFloat(amount) / parseFloat(basic)) * 100;
        return parseFloat(p.toFixed(2));
    };

    // Helper: Calculate Amount from Percentage
    const calcAmount = (percent, basic) => {
        if (!percent || !basic) return '';
        const a = (parseFloat(basic) * parseFloat(percent)) / 100;
        return Math.round(a);
    };

    const handleSelectEmployee = async (emp) => {
        setSelectedEmployee(emp);
        try {
            const res = await payrollService.getSalaryStructure(emp.id);
            if (res.success && res.data) {
                const s = res.data;
                setStructure(s);
                // Reverse calculate percentages (if applicable)
                if (s.basicSalary) {
                    setPercentages({
                        houseRentAllowance: calcPercent(s.houseRentAllowance, s.basicSalary),
                        dearnessAllowance: calcPercent(s.dearnessAllowance, s.basicSalary),
                        medicalAllowance: calcPercent(s.medicalAllowance, s.basicSalary),
                        transportAllowance: calcPercent(s.transportAllowance, s.basicSalary),
                        specialAllowance: calcPercent(s.specialAllowance, s.basicSalary),
                        providentFund: calcPercent(s.providentFund, s.basicSalary),
                        professionalTax: calcPercent(s.professionalTax, s.basicSalary),
                        incomeTax: calcPercent(s.incomeTax, s.basicSalary)
                    });
                }
            } else {
                resetForm();
            }
        } catch (error) {
            console.log("No structure found, creating new");
            resetForm();
        }
    };

    const resetForm = () => {
        const empty = {
            basicSalary: '',
            houseRentAllowance: '',
            dearnessAllowance: '',
            medicalAllowance: '',
            transportAllowance: '',
            specialAllowance: '',
            providentFund: '',
            professionalTax: '',
            incomeTax: ''
        };
        setStructure(empty);
        setPercentages({
            houseRentAllowance: '',
            dearnessAllowance: '',
            medicalAllowance: '',
            transportAllowance: '',
            specialAllowance: '',
            providentFund: '',
            professionalTax: '',
            incomeTax: ''
        });
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

    const handleBasicChange = (e) => {
        const newBasic = e.target.value;
        setStructure(prev => ({ ...prev, basicSalary: newBasic }));

        // Recalculate amounts based on existing percentages
        if (newBasic) {
            const newStruct = { ...structure, basicSalary: newBasic };
            Object.keys(percentages).forEach(key => {
                if (percentages[key] !== '' && percentages[key] !== null) {
                    newStruct[key] = calcAmount(percentages[key], newBasic);
                }
            });
            setStructure(newStruct);
        }
    };

    const handlePercentChange = (key, val) => {
        setPercentages(prev => ({ ...prev, [key]: val }));
        if (structure.basicSalary) {
            const amount = calcAmount(val, structure.basicSalary);
            setStructure(prev => ({ ...prev, [key]: amount }));
        }
    };

    const handleAmountChange = (key, val) => {
        setStructure(prev => ({ ...prev, [key]: val }));
        if (structure.basicSalary) {
            const p = calcPercent(val, structure.basicSalary);
            setPercentages(prev => ({ ...prev, [key]: p }));
        }
    };

    const renderInputRow = (label, key, required = false) => (
        <div className="flex items-center gap-4 mb-3">
            <div className="w-1/3">
                <label className="block text-xs text-gray-500 mb-1">{label}</label>
            </div>
            <div className="w-1/3 relative">
                <input
                    type="number"
                    placeholder="%"
                    value={percentages[key]}
                    onChange={(e) => handlePercentChange(key, e.target.value)}
                    className="w-full pl-3 pr-6 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    disabled={!structure.basicSalary}
                />
                <span className="absolute right-2 top-2 text-gray-400 text-xs">%</span>
            </div>
            <div className="w-1/3 relative">
                <span className="absolute left-2 top-2 text-gray-400 text-xs">₹</span>
                <input
                    type="number"
                    required={required}
                    value={structure[key]}
                    onChange={(e) => handleAmountChange(key, e.target.value)}
                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    disabled={!structure.basicSalary}
                />
            </div>
        </div>
    );

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
            <div className="md:col-span-2 p-6 md:p-8 overflow-y-auto max-h-[600px]">
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

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                BASIC SALARY
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-400 text-lg">₹</span>
                                <input
                                    type="number"
                                    required
                                    value={structure.basicSalary}
                                    onChange={handleBasicChange}
                                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-lg font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Enter Basic Salary"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                All percentage calculations are based on this amount.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Earnings */}
                            <div>
                                <h4 className="text-sm font-bold text-green-600 mb-3 border-b pb-2">Earnings</h4>
                                {renderInputRow("HRA", "houseRentAllowance", true)}
                                {renderInputRow("DA", "dearnessAllowance", true)}
                                {renderInputRow("Medical", "medicalAllowance", true)}
                                {renderInputRow("Transport", "transportAllowance", true)}
                                {renderInputRow("Special", "specialAllowance")}
                            </div>

                            {/* Deductions */}
                            <div>
                                <h4 className="text-sm font-bold text-red-600 mb-3 border-b pb-2">Deductions</h4>
                                {renderInputRow("Provident Fund", "providentFund", true)}
                                {renderInputRow("Professional Tax", "professionalTax", true)}
                                {renderInputRow("Income Tax", "incomeTax")}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
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
