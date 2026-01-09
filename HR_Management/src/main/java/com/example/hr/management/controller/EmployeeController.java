package com.example.hr.management.controller;

import com.example.hr.management.dto.EmployeeRequestDTO;
import com.example.hr.management.dto.EmployeeResponseDTO;
import com.example.hr.management.dto.ProfileUpdateRequestDTO;
import com.example.hr.management.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<EmployeeResponseDTO> createEmployee(
            @Valid @RequestBody EmployeeRequestDTO employeeRequestDTO) {
        EmployeeResponseDTO response = employeeService.createEmployee(employeeRequestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<EmployeeResponseDTO> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequestDTO employeeRequestDTO) {
        EmployeeResponseDTO response = employeeService.updateEmployee(id, employeeRequestDTO);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<EmployeeResponseDTO> updateProfile(
            @PathVariable Long id,
            @RequestBody ProfileUpdateRequestDTO profileUpdateRequestDTO) {
        EmployeeResponseDTO response = employeeService.updateProfile(id, profileUpdateRequestDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/profile-image")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<EmployeeResponseDTO> uploadProfileImage(
            @PathVariable Long id,
            @RequestBody Map<String, String> imageData) {
        String base64Image = imageData.get("profileImage");
        EmployeeResponseDTO response = employeeService.updateProfileImage(id, base64Image);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<EmployeeResponseDTO> getEmployeeById(@PathVariable Long id) {
        EmployeeResponseDTO response = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<EmployeeResponseDTO> getEmployeeByUserId(@PathVariable Long userId) {
        EmployeeResponseDTO response = employeeService.getEmployeeByUserId(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/code/{employeeCode}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<EmployeeResponseDTO> getEmployeeByCode(@PathVariable String employeeCode) {
        EmployeeResponseDTO response = employeeService.getEmployeeByCode(employeeCode);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<List<EmployeeResponseDTO>> getAllEmployees() {
        List<EmployeeResponseDTO> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/department/{department}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<List<EmployeeResponseDTO>> getEmployeesByDepartment(@PathVariable String department) {
        List<EmployeeResponseDTO> employees = employeeService.getEmployeesByDepartment(department);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<List<EmployeeResponseDTO>> getEmployeesByStatus(@PathVariable String status) {
        List<EmployeeResponseDTO> employees = employeeService.getEmployeesByStatus(status);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<List<EmployeeResponseDTO>> searchEmployees(@RequestParam String keyword) {
        List<EmployeeResponseDTO> employees = employeeService.searchEmployees(keyword);
        return ResponseEntity.ok(employees);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<Map<String, String>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Employee deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<Map<String, Long>> getActiveEmployeeCount() {
        Long count = employeeService.getActiveEmployeeCount();
        Map<String, Long> response = new HashMap<>();
        response.put("activeEmployees", count);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count/department/{department}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<Map<String, Long>> getEmployeeCountByDepartment(@PathVariable String department) {
        Long count = employeeService.getEmployeeCountByDepartment(department);
        Map<String, Long> response = new HashMap<>();
        response.put("departmentEmployeeCount", count);
        return ResponseEntity.ok(response);
    }
}
