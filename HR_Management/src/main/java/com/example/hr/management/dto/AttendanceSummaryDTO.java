package com.example.hr.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceSummaryDTO {
    
    private Long employeeId;
    private String employeeName;
    private String month;
    private Long totalWorkingDays;
    private Long presentDays;
    private Long absentDays;
    private Long halfDays;
    private Long leaveDays;
    private Long lateDays;
    private Double attendancePercentage;
    private Double totalWorkingHours;
}
