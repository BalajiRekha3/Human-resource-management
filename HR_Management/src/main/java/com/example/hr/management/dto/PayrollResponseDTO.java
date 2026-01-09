package com.example.hr.management.dto;

import com.example.hr.management.entity.Payroll;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollResponseDTO {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private LocalDate payPeriodStart;
    private LocalDate payPeriodEnd;
    private LocalDate payDate;
    private BigDecimal basicSalary;

    // Allowances
    private BigDecimal houseRentAllowance;
    private BigDecimal dearnessAllowance;
    private BigDecimal medicalAllowance;
    private BigDecimal transportAllowance;
    private BigDecimal specialAllowance;

    // Deductions
    private BigDecimal providentFund;
    private BigDecimal professionalTax;
    private BigDecimal incomeTax;

    private BigDecimal bonus;
    private BigDecimal deductions; // Ad-hoc
    private BigDecimal netSalary;
    private Payroll.PayrollStatus status;
    private String paymentMethod;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
