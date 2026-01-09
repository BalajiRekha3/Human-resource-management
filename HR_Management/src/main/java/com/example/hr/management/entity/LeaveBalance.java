// src/main/java/com/example/hr/management/entity/LeaveBalance.java
package com.example.hr.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "leave_balances", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id", "leave_type_id", "year"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveBalance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leave_type_id", nullable = false)
    private LeaveType leaveType;
    
    @Column(name = "year", nullable = false)
    private Integer year;
    
    @Column(name = "total_days", nullable = false)
    private Integer totalDays;
    
    @Column(name = "used_days", nullable = false)
    private Integer usedDays = 0;
    
    @Column(name = "remaining_days", nullable = false)
    private Integer remainingDays;
    
    @Column(name = "pending_days", nullable = false)
    private Integer pendingDays = 0;
}
