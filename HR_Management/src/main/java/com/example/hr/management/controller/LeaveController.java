// src/main/java/com/example/hr/management/controller/LeaveController.java
package com.example.hr.management.controller;

import com.example.hr.management.dto.LeaveDTO;
import com.example.hr.management.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LeaveController {

    private final LeaveService leaveService;

    // Apply for leave
    @PostMapping("/apply")
    public ResponseEntity<?> applyLeave(@RequestBody LeaveDTO leaveDTO) {
        try {
            LeaveDTO savedLeave = leaveService.applyLeave(leaveDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Leave applied successfully", savedLeave));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error applying leave: " + e.getMessage(), null));
        }
    }

    // Approve leave
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveLeave(@PathVariable Long id, @RequestParam Long approverEmployeeId) {
        try {
            LeaveDTO approvedLeave = leaveService.approveLeave(id, approverEmployeeId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Leave approved successfully", approvedLeave));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error approving leave: " + e.getMessage(), null));
        }
    }

    // Reject leave
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectLeave(@PathVariable Long id, @RequestParam String rejectionReason) {
        try {
            LeaveDTO rejectedLeave = leaveService.rejectLeave(id, rejectionReason);
            return ResponseEntity.ok(new ApiResponse<>(true, "Leave rejected successfully", rejectedLeave));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error rejecting leave: " + e.getMessage(), null));
        }
    }

    // Get employee's leaves
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<?> getEmployeeLeaves(@PathVariable Long employeeId) {
        try {
            List<LeaveDTO> leaves = leaveService.getEmployeeLeaves(employeeId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Leaves retrieved successfully", leaves));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving leaves: " + e.getMessage(), null));
        }
    }

    // Get employee's leaves by year
    @GetMapping("/employee/{employeeId}/year/{year}")
    public ResponseEntity<?> getEmployeeLeavesbyYear(@PathVariable Long employeeId, @PathVariable Integer year) {
        try {
            List<LeaveDTO> leaves = leaveService.getEmployeeLeavesbyYear(employeeId, year);
            return ResponseEntity.ok(new ApiResponse<>(true, "Leaves retrieved successfully", leaves));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving leaves: " + e.getMessage(), null));
        }
    }

    // Get pending leaves
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingLeaves() {
        try {
            List<LeaveDTO> pendingLeaves = leaveService.getPendingLeaves();
            return ResponseEntity.ok(new ApiResponse<>(true, "Pending leaves retrieved successfully", pendingLeaves));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving pending leaves: " + e.getMessage(), null));
        }
    }
}
