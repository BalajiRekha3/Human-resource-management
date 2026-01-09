// src/main/java/com/example/hr/management/entity/LeaveType.java
package com.example.hr.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "leave_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, unique = true)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "total_days", nullable = false)
    private Integer totalDays;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
