package com.example.hr.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceResponseDTO {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private LocalDate attendanceDate;
    private LocalTime clockInTime;
    private LocalTime clockOutTime;
    private String status;
    private String remarks;
    private Double workingHours;
    private Boolean isLate;
    private Integer lateMinutes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
