package com.example.hr.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestDTO {

    private Long employeeId;
    private Long leaveTypeId;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String reason;
}
