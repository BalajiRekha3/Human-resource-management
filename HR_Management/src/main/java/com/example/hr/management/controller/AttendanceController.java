package com.example.hr.management.controller;

import com.example.hr.management.dto.AttendanceRequestDTO;
import com.example.hr.management.dto.AttendanceResponseDTO;
import com.example.hr.management.dto.AttendanceSummaryDTO;
import com.example.hr.management.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/clock-in/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<AttendanceResponseDTO> clockIn(@PathVariable Long employeeId) {
        AttendanceResponseDTO response = attendanceService.clockIn(employeeId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/clock-out/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<AttendanceResponseDTO> clockOut(@PathVariable Long employeeId) {
        AttendanceResponseDTO response = attendanceService.clockOut(employeeId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<AttendanceResponseDTO> markAttendance(@Valid @RequestBody AttendanceRequestDTO request) {
        AttendanceResponseDTO response = attendanceService.markAttendance(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<AttendanceResponseDTO> updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceRequestDTO request) {
        AttendanceResponseDTO response = attendanceService.updateAttendance(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<AttendanceResponseDTO> getAttendanceById(@PathVariable Long id) {
        AttendanceResponseDTO response = attendanceService.getAttendanceById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/today/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'EMPLOYEE')")
    public ResponseEntity<Map<String, Object>> getTodayAttendance(@PathVariable Long employeeId) {
        AttendanceResponseDTO attendance = attendanceService.getTodayAttendance(employeeId);

        Map<String, Object> response = new HashMap<>();
        if (attendance != null) {
            response.put("data", attendance);
            response.put("message", "Today's attendance record found");
        } else {
            response.put("data", null);
            response.put("message", "No attendance record for today");
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<AttendanceResponseDTO>> getEmployeeAttendance(@PathVariable Long employeeId) {
        List<AttendanceResponseDTO> response = attendanceService.getEmployeeAttendance(employeeId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<?> getAttendanceByDate(@PathVariable LocalDate date) {
        try {
            List<AttendanceResponseDTO> attendanceList = attendanceService.getAttendanceByDate(date);
            return ResponseEntity
                    .ok(new ApiResponse<>(true, "Attendance records retrieved successfully", attendanceList));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving attendance: " + e.getMessage(), null));
        }
    }

    @GetMapping("/employee/{employeeId}/monthly")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<AttendanceResponseDTO>> getMonthlyAttendance(
            @PathVariable Long employeeId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {

        // Default to current month if not provided
        if (startDate == null || endDate == null) {
            YearMonth currentMonth = YearMonth.now();
            startDate = currentMonth.atDay(1);
            endDate = currentMonth.atEndOfMonth();
        }

        List<AttendanceResponseDTO> response = attendanceService.getMonthlyAttendance(employeeId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<AttendanceSummaryDTO> getAttendanceSummary(
            @PathVariable Long employeeId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {

        // Default to current month if not provided
        if (startDate == null || endDate == null) {
            YearMonth currentMonth = YearMonth.now();
            startDate = currentMonth.atDay(1);
            endDate = currentMonth.atEndOfMonth();
        }

        AttendanceSummaryDTO response = attendanceService.getAttendanceSummary(employeeId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<Map<String, String>> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Attendance record deleted successfully");
        return ResponseEntity.ok(response);
    }
}
