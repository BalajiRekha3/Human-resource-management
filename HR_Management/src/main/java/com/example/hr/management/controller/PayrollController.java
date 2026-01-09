package com.example.hr.management.controller;

import com.example.hr.management.dto.PayrollResponseDTO;
import com.example.hr.management.entity.Payroll;
import com.example.hr.management.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> generatePayroll(
            @RequestParam Long employeeId,
            @RequestParam String start,
            @RequestParam String end,
            @RequestParam(defaultValue = "0") BigDecimal bonus,
            @RequestParam(defaultValue = "0") BigDecimal deductions) {

        try {
            PayrollResponseDTO response = payrollService.generatePayroll(
                    employeeId,
                    LocalDate.parse(start),
                    LocalDate.parse(end),
                    bonus,
                    deductions);
            return ResponseEntity.ok(new ApiResponse<>(true, "Payroll generated successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<?> getEmployeePayrolls(@PathVariable Long employeeId) {
        try {
            List<PayrollResponseDTO> payrolls = payrollService.getEmployeePayrolls(employeeId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Payrolls retrieved successfully", payrolls));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<?> getPayrollById(@PathVariable Long id) {
        try {
            PayrollResponseDTO payroll = payrollService.getPayrollById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Payroll retrieved successfully", payroll));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam Payroll.PayrollStatus status) {
        try {
            PayrollResponseDTO response = payrollService.updateStatus(id, status);
            return ResponseEntity.ok(new ApiResponse<>(true, "Payroll status updated successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
