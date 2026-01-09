package com.example.hr.management.dto;

import com.example.hr.management.entity.LeaveStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveResponseDTO {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private String employeeEmail;
    private Long leaveTypeId;
    private String leaveTypeName;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Integer numberOfDays;
    private String reason;
    private LeaveStatus status;
    private Long approvedBy;
    private String approverName;
    private LocalDate approvalDate;
    private String rejectionReason;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}
