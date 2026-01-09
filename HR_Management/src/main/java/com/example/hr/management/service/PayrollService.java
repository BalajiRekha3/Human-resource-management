package com.example.hr.management.service;

import com.example.hr.management.dto.PayrollResponseDTO;
import com.example.hr.management.entity.Payroll;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface PayrollService {
    PayrollResponseDTO generatePayroll(Long employeeId, LocalDate start, LocalDate end, BigDecimal bonus,
            BigDecimal deductions);

    List<PayrollResponseDTO> getEmployeePayrolls(Long employeeId);

    PayrollResponseDTO getPayrollById(Long id);

    PayrollResponseDTO updateStatus(Long id, Payroll.PayrollStatus status);
}
