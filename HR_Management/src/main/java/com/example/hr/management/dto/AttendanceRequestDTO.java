package com.example.hr.management.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequestDTO {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Attendance date is required")
    private LocalDate attendanceDate;

    private LocalTime clockInTime;

    private LocalTime clockOutTime;

    @NotNull(message = "Status is required")
    private String status; // PRESENT, ABSENT, HALF_DAY, LEAVE, HOLIDAY

    private String remarks;

    private Double workingHours;

    // Setters with null safety
    public void setStatus(String status) {
        this.status = status != null ? status : "PRESENT";
    }
}
