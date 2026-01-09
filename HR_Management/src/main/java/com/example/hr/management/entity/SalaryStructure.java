package com.example.hr.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "salary_structures")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false, unique = true)
    private Employee employee;

    // Earnings
    @Column(nullable = false)
    private BigDecimal basicSalary;

    @Column(nullable = false)
    private BigDecimal houseRentAllowance; // HRA

    @Column(nullable = false)
    private BigDecimal dearnessAllowance; // DA

    @Column(nullable = false)
    private BigDecimal medicalAllowance;

    @Column(nullable = false)
    private BigDecimal transportAllowance;

    private BigDecimal specialAllowance;

    // Deductions
    @Column(nullable = false)
    private BigDecimal providentFund; // PF

    @Column(nullable = false)
    private BigDecimal professionalTax;

    private BigDecimal incomeTax;

    // Totals (Auto-calculated typically, but good for caching)
    private BigDecimal grossSalary;
    private BigDecimal netSalary;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
