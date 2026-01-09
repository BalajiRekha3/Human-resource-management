// src/main/java/com/example/hr/management/controller/LeaveTypeController.java
package com.example.hr.management.controller;

import com.example.hr.management.dto.LeaveTypeDTO;
import com.example.hr.management.entity.LeaveType;
import com.example.hr.management.repository.LeaveTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leave-types")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LeaveTypeController {

    private final LeaveTypeRepository leaveTypeRepository;

    // Create leave type
    @PostMapping("/createLeavType")
    public ResponseEntity<?> createLeaveType(@RequestBody LeaveTypeDTO leaveTypeDTO) {
        try {
            LeaveType leaveType = new LeaveType();
            leaveType.setName(leaveTypeDTO.getName());
            leaveType.setDescription(leaveTypeDTO.getDescription());
            leaveType.setTotalDays(leaveTypeDTO.getTotalDays());
            leaveType.setIsActive(true);

            LeaveType savedLeaveType = leaveTypeRepository.save(leaveType);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Leave type created successfully", mapToDTO(savedLeaveType)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, "Error creating leave type: " + e.getMessage(), null));
        }
    }

    // Get all leave types
    @GetMapping
    public ResponseEntity<?> getAllLeaveTypes() {
        try {
            List<LeaveTypeDTO> leaveTypes = leaveTypeRepository.findAll()
                    .stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new ApiResponse<>(true, "Leave types retrieved successfully", leaveTypes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving leave types: " + e.getMessage(), null));
        }
    }

    // Get active leave types
    @GetMapping("/active")
    public ResponseEntity<?> getActiveLeaveTypes() {
        try {
            List<LeaveTypeDTO> leaveTypes = leaveTypeRepository.findByIsActive(true)
                    .stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new ApiResponse<>(true, "Active leave types retrieved successfully", leaveTypes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving leave types: " + e.getMessage(), null));
        }
    }

    // Get leave type by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getLeaveTypeById(@PathVariable Long id) {
        try {
            LeaveType leaveType = leaveTypeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Leave type not found"));

            return ResponseEntity.ok(new ApiResponse<>(true, "Leave type retrieved successfully", mapToDTO(leaveType)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Leave type not found: " + e.getMessage(), null));
        }
    }

    // Update leave type
    @PutMapping("/{id}")
    public ResponseEntity<?> updateLeaveType(@PathVariable Long id, @RequestBody LeaveTypeDTO leaveTypeDTO) {
        try {
            LeaveType leaveType = leaveTypeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Leave type not found"));

            leaveType.setName(leaveTypeDTO.getName());
            leaveType.setDescription(leaveTypeDTO.getDescription());
            leaveType.setTotalDays(leaveTypeDTO.getTotalDays());
            leaveType.setIsActive(leaveTypeDTO.getIsActive());

            LeaveType updatedLeaveType = leaveTypeRepository.save(leaveType);
            return ResponseEntity
                    .ok(new ApiResponse<>(true, "Leave type updated successfully", mapToDTO(updatedLeaveType)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, "Error updating leave type: " + e.getMessage(), null));
        }
    }

    // Delete leave type
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLeaveType(@PathVariable Long id) {
        try {
            leaveTypeRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Leave type deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, "Error deleting leave type: " + e.getMessage(), null));
        }
    }

    private LeaveTypeDTO mapToDTO(LeaveType leaveType) {
        return new LeaveTypeDTO(
                leaveType.getId(),
                leaveType.getName(),
                leaveType.getDescription(),
                leaveType.getTotalDays(),
                leaveType.getIsActive());
    }
}
