package com.example.hr.management.controller;

import com.example.hr.management.entity.SalaryStructure;
import com.example.hr.management.service.SalaryStructureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/salary-structures")
@RequiredArgsConstructor
public class SalaryStructureController {

    private final SalaryStructureService salaryStructureService;

    @PostMapping("/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> createOrUpdate(
            @PathVariable Long employeeId,
            @RequestBody SalaryStructure salaryStructure) {
        try {
            SalaryStructure savedStructure = salaryStructureService.createOrUpdateSalaryStructure(employeeId,
                    salaryStructure);
            return ResponseEntity.ok(new ApiResponse<>(true, "Salary structure updated successfully", savedStructure));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> get(@PathVariable Long employeeId) {
        try {
            SalaryStructure structure = salaryStructureService.getSalaryStructure(employeeId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Salary structure retrieved successfully", structure));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
