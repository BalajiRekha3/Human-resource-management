// src/main/java/com/example/hr/management/dto/LeaveBalanceDTO.java
package com.example.hr.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveBalanceDTO {
    
    private Long id;
    private Long employeeId;
    private String employeeName;
    private Long leaveTypeId;
    private String leaveTypeName;
    private Integer year;
    private Integer totalDays;
    private Integer usedDays;
    private Integer remainingDays;
    private Integer pendingDays;
}
