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
    private BigDecimal allowances;
    private BigDecimal bonus;
    private BigDecimal deductions;
    private BigDecimal netSalary;
    private Payroll.PayrollStatus status;
    private String paymentMethod;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
