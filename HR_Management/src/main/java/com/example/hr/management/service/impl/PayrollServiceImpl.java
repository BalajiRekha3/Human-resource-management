package com.example.hr.management.service.impl;

import com.example.hr.management.dto.PayrollResponseDTO;
import com.example.hr.management.entity.Employee;
import com.example.hr.management.entity.Payroll;
import com.example.hr.management.exception.ResourceNotFoundException;
import com.example.hr.management.repository.EmployeeRepository;
import com.example.hr.management.repository.PayrollRepository;
import com.example.hr.management.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PayrollServiceImpl implements PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public PayrollResponseDTO generatePayroll(Long employeeId, LocalDate start, LocalDate end, BigDecimal bonus,
            BigDecimal deductions) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        BigDecimal basicSalary = employee.getBasicSalary() != null ? employee.getBasicSalary() : BigDecimal.ZERO;
        BigDecimal allowances = basicSalary.multiply(new BigDecimal("0.1")); // 10% allowance
        BigDecimal netSalary = basicSalary.add(allowances).add(bonus).subtract(deductions);

        Payroll payroll = Payroll.builder()
                .employee(employee)
                .payPeriodStart(start)
                .payPeriodEnd(end)
                .payDate(LocalDate.now())
                .basicSalary(basicSalary)
                .allowances(allowances)
                .bonus(bonus)
                .deductions(deductions)
                .netSalary(netSalary)
                .status(Payroll.PayrollStatus.PAID)
                .paymentMethod("BANK_TRANSFER")
                .build();

        Payroll savedPayroll = payrollRepository.save(payroll);
        return mapToDTO(savedPayroll);
    }

    @Override
    public List<PayrollResponseDTO> getEmployeePayrolls(Long employeeId) {
        return payrollRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PayrollResponseDTO getPayrollById(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll not found"));
        return mapToDTO(payroll);
    }

    @Override
    @Transactional
    public PayrollResponseDTO updateStatus(Long id, Payroll.PayrollStatus status) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll not found"));
        payroll.setStatus(status);
        return mapToDTO(payrollRepository.save(payroll));
    }

    private PayrollResponseDTO mapToDTO(Payroll payroll) {
        return PayrollResponseDTO.builder()
                .id(payroll.getId())
                .employeeId(payroll.getEmployee().getId())
                .employeeName(payroll.getEmployee().getFirstName() + " " + payroll.getEmployee().getLastName())
                .payPeriodStart(payroll.getPayPeriodStart())
                .payPeriodEnd(payroll.getPayPeriodEnd())
                .payDate(payroll.getPayDate())
                .basicSalary(payroll.getBasicSalary())
                .allowances(payroll.getAllowances())
                .bonus(payroll.getBonus())
                .deductions(payroll.getDeductions())
                .netSalary(payroll.getNetSalary())
                .status(payroll.getStatus())
                .paymentMethod(payroll.getPaymentMethod())
                .remarks(payroll.getRemarks())
                .createdAt(payroll.getCreatedAt())
                .updatedAt(payroll.getUpdatedAt())
                .build();
    }
}
