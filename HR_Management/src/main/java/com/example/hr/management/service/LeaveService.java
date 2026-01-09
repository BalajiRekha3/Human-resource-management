package com.example.hr.management.service;

import com.example.hr.management.dto.LeaveRequestDTO;
import com.example.hr.management.dto.LeaveResponseDTO;
import com.example.hr.management.dto.LeaveBalanceDTO;
import com.example.hr.management.entity.LeaveStatus;

import java.util.List;

public interface LeaveService {

    // Leave operations
    LeaveResponseDTO applyLeave(LeaveRequestDTO leaveRequestDTO);

    LeaveResponseDTO approveLeave(Long leaveId, Long approverEmployeeId);

    LeaveResponseDTO rejectLeave(Long leaveId, String rejectionReason, Long approverEmployeeId);

    List<LeaveResponseDTO> getEmployeeLeaves(Long employeeId);

    List<LeaveResponseDTO> getEmployeeLeavesbyYear(Long employeeId, Integer year);

    List<LeaveResponseDTO> getPendingLeaves();

    List<LeaveResponseDTO> getAllLeaves(LeaveStatus status);

    LeaveResponseDTO getLeaveById(Long leaveId);

    // Leave balance operations
    LeaveBalanceDTO getLeaveBalance(Long employeeId, Long leaveTypeId, Integer year);

    List<LeaveBalanceDTO> getEmployeeLeaveBalances(Long employeeId, Integer year);

    void initializeLeaveBalance(Long employeeId, Integer year);
}
