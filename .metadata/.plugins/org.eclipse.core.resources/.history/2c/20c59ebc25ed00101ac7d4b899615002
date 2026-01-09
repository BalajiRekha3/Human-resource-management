// src/main/java/com/example/hr/management/controller/LeaveBalanceController.java
package com.example.hr.management.controller;

import com.example.hr.management.dto.LeaveBalanceDTO;
import com.example.hr.management.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-balances")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LeaveBalanceController {

    private final LeaveService leaveService;

    // Get leave balance
    @GetMapping("/{employeeId}/{leaveTypeId}/{year}")
    public ResponseEntity<?> getLeaveBalance(
            @PathVariable Long employeeId,
            @PathVariable Long leaveTypeId,
            @PathVariable Integer year) {
        try {
            LeaveBalanceDTO balance = leaveService.getLeaveBalance(employeeId, leaveTypeId, year);
            return ResponseEntity.ok(new ApiResponse<>(true, "Leave balance retrieved successfully", balance));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving leave balance: " + e.getMessage(), null));
        }
    }

    // Get all leave balances for employee
    @GetMapping("/employee/{employeeId}/year/{year}")
    public ResponseEntity<?> getEmployeeLeaveBalances(
            @PathVariable Long employeeId,
            @PathVariable Integer year) {
        try {
            List<LeaveBalanceDTO> balances = leaveService.getEmployeeLeaveBalances(employeeId, year);
            return ResponseEntity.ok(new ApiResponse<>(true, "Leave balances retrieved successfully", balances));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving leave balances: " + e.getMessage(), null));
        }
    }

    // Initialize leave balance for employee
    @PostMapping("/initialize/{employeeId}/{year}")
    public ResponseEntity<?> initializeLeaveBalance(
            @PathVariable Long employeeId,
            @PathVariable Integer year) {
        try {
            leaveService.initializeLeaveBalance(employeeId, year);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Leave balance initialized successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error initializing leave balance: " + e.getMessage(), null));
        }
    }
}
