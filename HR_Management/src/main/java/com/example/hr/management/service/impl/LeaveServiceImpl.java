package com.example.hr.management.service.impl;

import com.example.hr.management.dto.LeaveRequestDTO;
import com.example.hr.management.dto.LeaveResponseDTO;
import com.example.hr.management.dto.LeaveBalanceDTO;
import com.example.hr.management.entity.Leave;
import com.example.hr.management.entity.LeaveBalance;
import com.example.hr.management.entity.LeaveType;
import com.example.hr.management.entity.Employee;
import com.example.hr.management.entity.LeaveStatus;
import com.example.hr.management.exception.ResourceNotFoundException;
import com.example.hr.management.exception.BadRequestException;
import com.example.hr.management.repository.LeaveRepository;
import com.example.hr.management.repository.LeaveTypeRepository;
import com.example.hr.management.repository.LeaveBalanceRepository;
import com.example.hr.management.repository.EmployeeRepository;
import com.example.hr.management.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRepository leaveRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public LeaveResponseDTO applyLeave(LeaveRequestDTO leaveRequestDTO) {
        // Get employee
        Employee employee = employeeRepository.findById(leaveRequestDTO.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        // Get leave type
        LeaveType leaveType = leaveTypeRepository.findById(leaveRequestDTO.getLeaveTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Leave type not found"));

        // Validate dates
        if (leaveRequestDTO.getFromDate().isAfter(leaveRequestDTO.getToDate())) {
            throw new BadRequestException("From date cannot be after to date");
        }

        // Calculate number of days
        int numberOfDays = (int) ChronoUnit.DAYS.between(
                leaveRequestDTO.getFromDate(),
                leaveRequestDTO.getToDate()) + 1;

        // Check for overlapping approved leaves
        List<Leave> overlappingLeaves = leaveRepository.findOverlappingLeaves(
                employee.getId(),
                leaveRequestDTO.getFromDate(),
                leaveRequestDTO.getToDate());

        if (!overlappingLeaves.isEmpty()) {
            throw new BadRequestException("Leave already approved for these dates");
        }

        // Check leave balance - auto-create if doesn't exist
        int year = leaveRequestDTO.getFromDate().getYear();
        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeIdAndYear(employee.getId(), leaveType.getId(), year)
                .orElseGet(() -> {
                    // Auto-create balance if not found
                    LeaveBalance newBalance = new LeaveBalance();
                    newBalance.setEmployee(employee);
                    newBalance.setLeaveType(leaveType);
                    newBalance.setYear(year);
                    newBalance.setTotalDays(leaveType.getTotalDays());
                    newBalance.setUsedDays(0);
                    newBalance.setPendingDays(0);
                    newBalance.setRemainingDays(leaveType.getTotalDays());
                    return leaveBalanceRepository.save(newBalance);
                });

        if (balance.getRemainingDays() < numberOfDays) {
            throw new BadRequestException("Insufficient leave balance. Available: " +
                    balance.getRemainingDays() + " days");
        }

        // Create leave
        Leave leave = new Leave();
        leave.setEmployee(employee);
        leave.setLeaveType(leaveType);
        leave.setFromDate(leaveRequestDTO.getFromDate());
        leave.setToDate(leaveRequestDTO.getToDate());
        leave.setNumberOfDays(numberOfDays);
        leave.setReason(leaveRequestDTO.getReason());
        leave.setStatus(LeaveStatus.PENDING);

        Leave savedLeave = leaveRepository.save(leave);

        // Update balance - add to pending days
        balance.setPendingDays(balance.getPendingDays() + numberOfDays);
        leaveBalanceRepository.save(balance);

        return mapToResponseDTO(savedLeave);
    }

    @Override
    public LeaveResponseDTO approveLeave(Long leaveId, Long approverEmployeeId) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave not found"));

        if (!leave.getStatus().equals(LeaveStatus.PENDING)) {
            throw new BadRequestException("Only pending leaves can be approved");
        }

        leave.setStatus(LeaveStatus.APPROVED);
        leave.setApprovedBy(approverEmployeeId);
        leave.setApprovalDate(LocalDate.now());

        Leave updatedLeave = leaveRepository.save(leave);

        // Update balance - move from pending to used
        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeIdAndYear(
                        leave.getEmployee().getId(),
                        leave.getLeaveType().getId(),
                        leave.getFromDate().getYear())
                .orElseThrow(() -> new ResourceNotFoundException("Leave balance not found"));

        balance.setPendingDays(Math.max(0, balance.getPendingDays() - leave.getNumberOfDays()));
        balance.setUsedDays(balance.getUsedDays() + leave.getNumberOfDays());
        balance.setRemainingDays(balance.getTotalDays() - balance.getUsedDays() - balance.getPendingDays());
        leaveBalanceRepository.save(balance);

        return mapToResponseDTO(updatedLeave);
    }

    @Override
    public LeaveResponseDTO rejectLeave(Long leaveId, String rejectionReason, Long approverEmployeeId) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave not found"));

        if (!leave.getStatus().equals(LeaveStatus.PENDING)) {
            throw new BadRequestException("Only pending leaves can be rejected");
        }

        leave.setStatus(LeaveStatus.REJECTED);
        leave.setRejectionReason(rejectionReason);
        leave.setApprovedBy(approverEmployeeId);
        leave.setApprovalDate(LocalDate.now());

        Leave updatedLeave = leaveRepository.save(leave);

        // Update balance - remove pending days
        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeIdAndYear(
                        leave.getEmployee().getId(),
                        leave.getLeaveType().getId(),
                        leave.getFromDate().getYear())
                .orElseThrow(() -> new ResourceNotFoundException("Leave balance not found"));

        balance.setPendingDays(Math.max(0, balance.getPendingDays() - leave.getNumberOfDays()));
        balance.setRemainingDays(balance.getTotalDays() - balance.getUsedDays() - balance.getPendingDays());
        leaveBalanceRepository.save(balance);

        return mapToResponseDTO(updatedLeave);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponseDTO> getEmployeeLeaves(Long employeeId) {
        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        return leaveRepository.findByEmployeeId(employeeId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponseDTO> getEmployeeLeavesbyYear(Long employeeId, Integer year) {
        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        return leaveRepository.findLeavesByEmployeeAndYear(employeeId, year)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponseDTO> getPendingLeaves() {
        return leaveRepository.findByStatus(LeaveStatus.PENDING)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public LeaveResponseDTO getLeaveById(Long leaveId) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave not found"));

        return mapToResponseDTO(leave);
    }

    @Override
    public LeaveBalanceDTO getLeaveBalance(Long employeeId, Long leaveTypeId, Integer year) {
        // Try to find existing balance
        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeIdAndYear(employeeId, leaveTypeId, year)
                .orElseGet(() -> {
                    // If not found, auto-create it
                    Employee employee = employeeRepository.findById(employeeId)
                            .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

                    LeaveType leaveType = leaveTypeRepository.findById(leaveTypeId)
                            .orElseThrow(() -> new ResourceNotFoundException("Leave type not found"));

                    LeaveBalance newBalance = new LeaveBalance();
                    newBalance.setEmployee(employee);
                    newBalance.setLeaveType(leaveType);
                    newBalance.setYear(year);
                    newBalance.setTotalDays(leaveType.getTotalDays());
                    newBalance.setUsedDays(0);
                    newBalance.setPendingDays(0);
                    newBalance.setRemainingDays(leaveType.getTotalDays());

                    return leaveBalanceRepository.save(newBalance);
                });

        return mapBalanceToDTO(balance);
    }

    @Override
    public List<LeaveBalanceDTO> getEmployeeLeaveBalances(Long employeeId, Integer year) {
        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        return leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, year)
                .stream()
                .map(this::mapBalanceToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void initializeLeaveBalance(Long employeeId, Integer year) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        List<LeaveType> leaveTypes = leaveTypeRepository.findByIsActive(true);

        for (LeaveType leaveType : leaveTypes) {
            LeaveBalance existingBalance = leaveBalanceRepository
                    .findByEmployeeIdAndLeaveTypeIdAndYear(employeeId, leaveType.getId(), year)
                    .orElse(null);

            if (existingBalance == null) {
                LeaveBalance balance = new LeaveBalance();
                balance.setEmployee(employee);
                balance.setLeaveType(leaveType);
                balance.setYear(year);
                balance.setTotalDays(leaveType.getTotalDays());
                balance.setUsedDays(0);
                balance.setRemainingDays(leaveType.getTotalDays());
                balance.setPendingDays(0);

                leaveBalanceRepository.save(balance);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponseDTO> getAllLeaves(LeaveStatus status) {
        List<Leave> leaves;
        if (status != null) {
            leaves = leaveRepository.findByStatus(status);
        } else {
            leaves = leaveRepository.findAll();
        }

        return leaves.stream()
                // Sort by ID desc (newest first) with null safety
                .sorted((l1, l2) -> {
                    if (l1.getId() == null)
                        return 1;
                    if (l2.getId() == null)
                        return -1;
                    return l2.getId().compareTo(l1.getId());
                })
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Map Leave to Response DTO with Robust Null Safety
    private LeaveResponseDTO mapToResponseDTO(Leave leave) {
        if (leave == null)
            return null;

        LeaveResponseDTO dto = new LeaveResponseDTO();
        dto.setId(leave.getId());

        // Safe Employee Mapping
        if (leave.getEmployee() != null) {
            dto.setEmployeeId(leave.getEmployee().getId());
            dto.setEmployeeName(leave.getEmployee().getFirstName() + " " + leave.getEmployee().getLastName());
            dto.setEmployeeEmail(leave.getEmployee().getEmail());
            dto.setEmployeeCode(leave.getEmployee().getEmployeeCode());
            dto.setEmployeeProfileImage(leave.getEmployee().getProfileImage());
        } else {
            dto.setEmployeeName("Unknown Employee");
        }

        // Safe Leave Type Mapping
        if (leave.getLeaveType() != null) {
            dto.setLeaveTypeId(leave.getLeaveType().getId());
            dto.setLeaveTypeName(leave.getLeaveType().getName());
        } else {
            dto.setLeaveTypeName("Unknown Type");
        }

        dto.setFromDate(leave.getFromDate());
        dto.setToDate(leave.getToDate());
        dto.setNumberOfDays(leave.getNumberOfDays());
        dto.setReason(leave.getReason());
        dto.setStatus(leave.getStatus());
        dto.setApprovedBy(leave.getApprovedBy());
        dto.setApprovalDate(leave.getApprovalDate());
        dto.setRejectionReason(leave.getRejectionReason());
        dto.setCreatedAt(leave.getCreatedAt());
        dto.setUpdatedAt(leave.getUpdatedAt());

        if (leave.getApprovedBy() != null) {
            Employee approver = employeeRepository.findById(leave.getApprovedBy()).orElse(null);
            if (approver != null) {
                dto.setApproverName(approver.getFirstName() + " " + approver.getLastName());
                dto.setApproverDesignation(approver.getDesignation());
            }
        }

        return dto;
    }

    // Map LeaveBalance to DTO
    private LeaveBalanceDTO mapBalanceToDTO(LeaveBalance balance) {
        LeaveBalanceDTO dto = new LeaveBalanceDTO();
        dto.setId(balance.getId());
        dto.setEmployeeId(balance.getEmployee().getId());
        dto.setEmployeeName(balance.getEmployee().getFirstName() + " " + balance.getEmployee().getLastName());
        dto.setLeaveTypeId(balance.getLeaveType().getId());
        dto.setLeaveTypeName(balance.getLeaveType().getName());
        dto.setYear(balance.getYear());
        dto.setTotalDays(balance.getTotalDays());
        dto.setUsedDays(balance.getUsedDays());
        dto.setRemainingDays(balance.getRemainingDays());
        dto.setPendingDays(balance.getPendingDays());

        return dto;
    }
}
