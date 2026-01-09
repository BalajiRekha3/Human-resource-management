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
        private final com.example.hr.management.repository.SalaryStructureRepository salaryStructureRepository;

        @Override
        @Transactional
        public PayrollResponseDTO generatePayroll(Long employeeId, LocalDate start, LocalDate end, BigDecimal bonus,
                        BigDecimal deductions) {
                Employee employee = employeeRepository.findById(employeeId)
                                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

                com.example.hr.management.entity.SalaryStructure struct = salaryStructureRepository
                                .findByEmployeeId(employeeId)
                                .orElse(com.example.hr.management.entity.SalaryStructure.builder()
                                                .basicSalary(BigDecimal.ZERO)
                                                .houseRentAllowance(BigDecimal.ZERO)
                                                .dearnessAllowance(BigDecimal.ZERO)
                                                .medicalAllowance(BigDecimal.ZERO)
                                                .transportAllowance(BigDecimal.ZERO)
                                                .specialAllowance(BigDecimal.ZERO)
                                                .providentFund(BigDecimal.ZERO)
                                                .professionalTax(BigDecimal.ZERO)
                                                .incomeTax(BigDecimal.ZERO)
                                                .build());

                BigDecimal totalEarnings = struct.getBasicSalary()
                                .add(struct.getHouseRentAllowance())
                                .add(struct.getDearnessAllowance())
                                .add(struct.getMedicalAllowance())
                                .add(struct.getTransportAllowance())
                                .add(struct.getSpecialAllowance() != null ? struct.getSpecialAllowance()
                                                : BigDecimal.ZERO)
                                .add(bonus);

                BigDecimal totalDeductions = struct.getProvidentFund()
                                .add(struct.getProfessionalTax())
                                .add(struct.getIncomeTax() != null ? struct.getIncomeTax() : BigDecimal.ZERO)
                                .add(deductions);

                BigDecimal netSalary = totalEarnings.subtract(totalDeductions);

                Payroll payroll = Payroll.builder()
                                .employee(employee)
                                .payPeriodStart(start)
                                .payPeriodEnd(end)
                                .payDate(LocalDate.now())
                                .basicSalary(struct.getBasicSalary())
                                .houseRentAllowance(struct.getHouseRentAllowance())
                                .dearnessAllowance(struct.getDearnessAllowance())
                                .medicalAllowance(struct.getMedicalAllowance())
                                .transportAllowance(struct.getTransportAllowance())
                                .specialAllowance(struct.getSpecialAllowance())
                                .providentFund(struct.getProvidentFund())
                                .professionalTax(struct.getProfessionalTax())
                                .incomeTax(struct.getIncomeTax())
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
        @Transactional(readOnly = true)
        public List<PayrollResponseDTO> getEmployeePayrolls(Long employeeId) {
                return payrollRepository.findByEmployeeId(employeeId).stream()
                                .map(this::mapToDTO)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional(readOnly = true)
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
                                .employeeName(payroll.getEmployee().getFirstName() + " "
                                                + payroll.getEmployee().getLastName())
                                .payPeriodStart(payroll.getPayPeriodStart())
                                .payPeriodEnd(payroll.getPayPeriodEnd())
                                .payDate(payroll.getPayDate())
                                .basicSalary(payroll.getBasicSalary() != null ? payroll.getBasicSalary()
                                                : BigDecimal.ZERO)
                                .houseRentAllowance(payroll.getHouseRentAllowance() != null
                                                ? payroll.getHouseRentAllowance()
                                                : BigDecimal.ZERO)
                                .dearnessAllowance(
                                                payroll.getDearnessAllowance() != null ? payroll.getDearnessAllowance()
                                                                : BigDecimal.ZERO)
                                .medicalAllowance(payroll.getMedicalAllowance() != null ? payroll.getMedicalAllowance()
                                                : BigDecimal.ZERO)
                                .transportAllowance(payroll.getTransportAllowance() != null
                                                ? payroll.getTransportAllowance()
                                                : BigDecimal.ZERO)
                                .specialAllowance(payroll.getSpecialAllowance() != null ? payroll.getSpecialAllowance()
                                                : BigDecimal.ZERO)
                                .providentFund(payroll.getProvidentFund() != null ? payroll.getProvidentFund()
                                                : BigDecimal.ZERO)
                                .professionalTax(payroll.getProfessionalTax() != null ? payroll.getProfessionalTax()
                                                : BigDecimal.ZERO)
                                .incomeTax(payroll.getIncomeTax() != null ? payroll.getIncomeTax() : BigDecimal.ZERO)
                                .bonus(payroll.getBonus() != null ? payroll.getBonus() : BigDecimal.ZERO)
                                .deductions(payroll.getDeductions() != null ? payroll.getDeductions() : BigDecimal.ZERO)
                                .netSalary(payroll.getNetSalary() != null ? payroll.getNetSalary() : BigDecimal.ZERO)
                                .status(payroll.getStatus())
                                .paymentMethod(payroll.getPaymentMethod())
                                .remarks(payroll.getRemarks())
                                .createdAt(payroll.getCreatedAt())
                                .updatedAt(payroll.getUpdatedAt())
                                .build();
        }
}
