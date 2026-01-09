import React, { forwardRef } from 'react';

const PayslipDocument = forwardRef(({ payroll, employee }, ref) => {
    if (!payroll || !employee) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return (amount || 0).toLocaleString('en-IN', {
            style: 'currency', currency: 'INR'
        });
    };

    const getMonthYear = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-GB', {
            month: 'short', year: 'numeric'
        }).toUpperCase();
    };

    // Calculate Totals
    const totalEarnings = (payroll.basicSalary || 0) +
        (payroll.houseRentAllowance || 0) +
        (payroll.dearnessAllowance || 0) +
        (payroll.medicalAllowance || 0) +
        (payroll.transportAllowance || 0) +
        (payroll.specialAllowance || 0) +
        (payroll.bonus || 0);

    const totalDeductions = (payroll.providentFund || 0) +
        (payroll.professionalTax || 0) +
        (payroll.incomeTax || 0) +
        (payroll.deductions || 0);

    return (
        <div ref={ref} className="bg-white p-8 max-w-[210mm] mx-auto text-sm text-gray-800 font-sans border border-gray-200 shadow-sm" style={{ minHeight: '297mm' }}>
            {/* Header */}
            <div className="border-b-2 border-blue-900 pb-4 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-900 uppercase tracking-wider">PriyanshTech</h1>
                        <p className="text-xs text-gray-500 font-semibold mt-1">Private Limited</p>
                    </div>
                    <div className="text-right text-xs text-gray-600">
                        <p>Jain Sadguru Garden, VIP Hills, Jaihind Enclave</p>
                        <p>Madhapur, Hyderabad, Telangana - 500081</p>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <h2 className="text-lg font-bold text-gray-700 bg-gray-50 py-1 border-y border-gray-200">
                        PAY SLIP FOR THE MONTH OF {getMonthYear(payroll.payPeriodStart)}
                    </h2>
                </div>
            </div>

            {/* Employee Details Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 text-xs">
                <div className="grid grid-cols-3">
                    <span className="font-bold text-gray-600">EMP CODE</span>
                    <span className="col-span-2">: {employee.employeeCode}</span>
                </div>
                <div className="grid grid-cols-3">
                    <span className="font-bold text-gray-600">UAN NO</span>
                    <span className="col-span-2">: N/A</span>
                </div>

                <div className="grid grid-cols-3">
                    <span className="font-bold text-gray-600">EMP NAME</span>
                    <span className="col-span-2 uppercase">: {employee.firstName} {employee.lastName}</span>
                </div>
                <div className="grid grid-cols-3">
                    <span className="font-bold text-gray-600">PF NO</span>
                    <span className="col-span-2">: N/A</span>
                </div>

                <div className="grid grid-cols-3">
                    <span className="font-bold text-gray-600">DESIGNATION</span>
                    <span className="col-span-2">: {employee.designation || '-'}</span>
                </div>
                <div className="grid grid-cols-3">
                    <span className="font-bold text-gray-600">ESI NO</span>
                    <span className="col-span-2">: N/A</span>
                </div>

                <div className="grid grid-cols-3">
                    <span className="font-bold text-gray-600">DOJ</span>
                    <span className="col-span-2">: {formatDate(employee.joiningDate)}</span>
                </div>
                <div className="grid grid-cols-3">
                    <span className="font-bold text-gray-600">BANK NAME</span>
                    <span className="col-span-2">: HDFC BANK</span>
                </div>

                <div className="grid grid-cols-3">
                    <span className="font-bold text-gray-600">DEPARTMENT</span>
                    <span className="col-span-2">: {employee.department || '-'}</span>
                </div>
                <div className="grid grid-cols-3">
                    <span className="font-bold text-gray-600">ACCOUNT NO</span>
                    <span className="col-span-2">: XXXXXX1234</span>
                </div>

                <div className="grid grid-cols-3">
                    <span className="font-bold text-gray-600">LOCATION</span>
                    <span className="col-span-2">: {employee.city || 'Bangalore'}</span>
                </div>
                <div className="grid grid-cols-3">
                    <span className="font-bold text-gray-600">PAN NO</span>
                    <span className="col-span-2">: XXXXX0000X</span>
                </div>
            </div>

            {/* Salary Components Table */}
            <div className="border border-gray-300 mb-6">
                <div className="grid grid-cols-2 bg-gray-100 border-b border-gray-300 font-bold text-xs uppercase text-gray-700">
                    <div className="p-2 border-r border-gray-300 flex justify-between">
                        <span>Earnings</span>
                        <span>Amount</span>
                    </div>
                    <div className="p-2 flex justify-between">
                        <span>Deductions</span>
                        <span>Amount</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 text-xs">
                    {/* Earnings Column */}
                    <div className="border-r border-gray-300">
                        <div className="p-2 flex justify-between border-b border-gray-100">
                            <span>Basic Salary</span>
                            <span>{formatCurrency(payroll.basicSalary)}</span>
                        </div>
                        <div className="p-2 flex justify-between border-b border-gray-100">
                            <span>HRA</span>
                            <span>{formatCurrency(payroll.houseRentAllowance)}</span>
                        </div>
                        <div className="p-2 flex justify-between border-b border-gray-100">
                            <span>Dearness Allowance</span>
                            <span>{formatCurrency(payroll.dearnessAllowance)}</span>
                        </div>
                        <div className="p-2 flex justify-between border-b border-gray-100">
                            <span>Medical Allowance</span>
                            <span>{formatCurrency(payroll.medicalAllowance)}</span>
                        </div>
                        <div className="p-2 flex justify-between border-b border-gray-100">
                            <span>Transport Allowance</span>
                            <span>{formatCurrency(payroll.transportAllowance)}</span>
                        </div>
                        <div className="p-2 flex justify-between border-b border-gray-100">
                            <span>Special Allowance</span>
                            <span>{formatCurrency(payroll.specialAllowance)}</span>
                        </div>
                        <div className="p-2 flex justify-between border-b border-gray-100">
                            <span>Bonus</span>
                            <span>{formatCurrency(payroll.bonus)}</span>
                        </div>
                    </div>

                    {/* Deductions Column */}
                    <div>
                        <div className="p-2 flex justify-between border-b border-gray-100">
                            <span>Provident Fund</span>
                            <span>{formatCurrency(payroll.providentFund)}</span>
                        </div>
                        <div className="p-2 flex justify-between border-b border-gray-100">
                            <span>Professional Tax</span>
                            <span>{formatCurrency(payroll.professionalTax)}</span>
                        </div>
                        <div className="p-2 flex justify-between border-b border-gray-100">
                            <span>Income Tax</span>
                            <span>{formatCurrency(payroll.incomeTax)}</span>
                        </div>
                        <div className="p-2 flex justify-between border-b border-gray-100">
                            <span>Other Deductions</span>
                            <span>{formatCurrency(payroll.deductions)}</span>
                        </div>
                    </div>
                </div>

                {/* Totals Row */}
                <div className="grid grid-cols-2 border-t-2 border-gray-300 font-bold text-xs bg-gray-50">
                    <div className="p-2 border-r border-gray-300 flex justify-between">
                        <span>GROSS EARNINGS</span>
                        <span>{formatCurrency(totalEarnings)}</span>
                    </div>
                    <div className="p-2 flex justify-between">
                        <span>GROSS DEDUCTIONS</span>
                        <span>{formatCurrency(totalDeductions)}</span>
                    </div>
                </div>
            </div>

            {/* Net Pay Section */}
            <div className="border border-blue-100 bg-blue-50 p-4 mb-8">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-blue-900 uppercase">Net Pay</span>
                    <span className="text-xl font-bold text-blue-900">{formatCurrency(payroll.netSalary)}</span>
                </div>
                <div className="mt-2 text-xs text-blue-800 border-t border-blue-200 pt-2">
                    <span className="font-semibold">In Words: </span>
                    <span className="italic">Please refer to numerical value</span>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] text-gray-400 mt-12">
                <p>This is a computer-generated document and does not require a signature.</p>
                <p>Generated by HRMSPro on {new Date().toLocaleString()}</p>
            </div>
        </div>
    );
});

PayslipDocument.displayName = "PayslipDocument";

export default PayslipDocument;
