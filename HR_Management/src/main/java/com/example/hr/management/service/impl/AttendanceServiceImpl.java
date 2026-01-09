package com.example.hr.management.service.impl;

import com.example.hr.management.dto.AttendanceRequestDTO;
import com.example.hr.management.dto.AttendanceResponseDTO;
import com.example.hr.management.dto.AttendanceSummaryDTO;
import com.example.hr.management.entity.Attendance;
import com.example.hr.management.entity.Employee;
import com.example.hr.management.exception.BadRequestException;
import com.example.hr.management.exception.ResourceNotFoundException;
import com.example.hr.management.repository.AttendanceRepository;
import com.example.hr.management.repository.EmployeeRepository;
import com.example.hr.management.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    private static final LocalTime OFFICE_START_TIME = LocalTime.of(9, 0);
    private static final LocalTime OFFICE_END_TIME = LocalTime.of(18, 0);

    @Override
    @Transactional
    public AttendanceResponseDTO clockIn(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        LocalDate today = LocalDate.now();
        LocalTime clockInTime = LocalTime.now();

        // Check if already clocked in today
        Attendance existingAttendance = attendanceRepository.findByEmployeeIdAndAttendanceDate(employeeId, today)
                .orElse(null);

        if (existingAttendance != null && existingAttendance.getClockInTime() != null) {
            throw new BadRequestException("Employee already clocked in today");
        }

        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setAttendanceDate(today);
        attendance.setClockInTime(clockInTime);

        // Check if late
        boolean isLate = clockInTime.isAfter(OFFICE_START_TIME);
        attendance.setIsLate(isLate);

        if (isLate) {
            int lateMinutes = (int) java.time.temporal.ChronoUnit.MINUTES.between(OFFICE_START_TIME, clockInTime);
            attendance.setLateMinutes(lateMinutes);
        }

        attendance.setStatus("PRESENT");
        attendance.setCreatedAt(LocalDateTime.now());
        attendance.setUpdatedAt(LocalDateTime.now());

        try {
            Attendance saved = attendanceRepository.save(attendance);
            return mapToResponseDTO(saved);
        } catch (Exception e) {
            throw new BadRequestException("Error saving attendance record: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public AttendanceResponseDTO clockOut(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        LocalDate today = LocalDate.now();
        LocalTime clockOutTime = LocalTime.now();

        Attendance attendance = attendanceRepository.findByEmployeeIdAndAttendanceDate(employeeId, today)
                .orElseThrow(() -> new ResourceNotFoundException("No clock-in record found for today"));

        if (attendance.getClockOutTime() != null) {
            throw new BadRequestException("Employee already clocked out today");
        }

        attendance.setClockOutTime(clockOutTime);

        // Calculate working hours
        if (attendance.getClockInTime() != null) {
            double workingMinutes = (double) java.time.temporal.ChronoUnit.MINUTES.between(
                    attendance.getClockInTime(),
                    clockOutTime);
            double workingHours = workingMinutes / 60.0;
            attendance.setWorkingHours(Math.round(workingHours * 100.0) / 100.0);
        }

        attendance.setUpdatedAt(LocalDateTime.now());
        Attendance updated = attendanceRepository.save(attendance);
        return mapToResponseDTO(updated);
    }

    @Override
    @Transactional
    public AttendanceResponseDTO markAttendance(AttendanceRequestDTO requestDTO) {
        Employee employee = employeeRepository.findById(requestDTO.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with id: " + requestDTO.getEmployeeId()));

        // Check if attendance already exists for this date
        Attendance existing = attendanceRepository.findByEmployeeIdAndAttendanceDate(
                requestDTO.getEmployeeId(),
                requestDTO.getAttendanceDate()).orElse(null);

        if (existing != null) {
            throw new BadRequestException("Attendance already marked for this employee on this date");
        }

        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setAttendanceDate(requestDTO.getAttendanceDate());
        attendance.setClockInTime(requestDTO.getClockInTime());
        attendance.setClockOutTime(requestDTO.getClockOutTime());
        attendance.setStatus(requestDTO.getStatus());
        attendance.setRemarks(requestDTO.getRemarks());
        attendance.setWorkingHours(requestDTO.getWorkingHours());

        // Check if late
        if (requestDTO.getClockInTime() != null) {
            boolean isLate = requestDTO.getClockInTime().isAfter(OFFICE_START_TIME);
            attendance.setIsLate(isLate);

            if (isLate) {
                int lateMinutes = (int) java.time.temporal.ChronoUnit.MINUTES.between(OFFICE_START_TIME,
                        requestDTO.getClockInTime());
                attendance.setLateMinutes(lateMinutes);
            }
        }

        attendance.setCreatedAt(LocalDateTime.now());
        attendance.setUpdatedAt(LocalDateTime.now());

        Attendance saved = attendanceRepository.save(attendance);
        return mapToResponseDTO(saved);
    }

    @Override
    @Transactional
    public AttendanceResponseDTO updateAttendance(Long id, AttendanceRequestDTO requestDTO) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with id: " + id));

        attendance.setClockInTime(requestDTO.getClockInTime());
        attendance.setClockOutTime(requestDTO.getClockOutTime());
        attendance.setStatus(requestDTO.getStatus());
        attendance.setRemarks(requestDTO.getRemarks());
        attendance.setWorkingHours(requestDTO.getWorkingHours());

        // Check if late
        if (requestDTO.getClockInTime() != null) {
            boolean isLate = requestDTO.getClockInTime().isAfter(OFFICE_START_TIME);
            attendance.setIsLate(isLate);

            if (isLate) {
                int lateMinutes = (int) java.time.temporal.ChronoUnit.MINUTES.between(OFFICE_START_TIME,
                        requestDTO.getClockInTime());
                attendance.setLateMinutes(lateMinutes);
            }
        }

        attendance.setUpdatedAt(LocalDateTime.now());

        Attendance updated = attendanceRepository.save(attendance);
        return mapToResponseDTO(updated);
    }

    @Override
    public AttendanceResponseDTO getAttendanceById(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with id: " + id));
        return mapToResponseDTO(attendance);
    }

    @Override
    public AttendanceResponseDTO getTodayAttendance(Long employeeId) {
        Attendance attendance = attendanceRepository.findByEmployeeIdAndAttendanceDate(employeeId, LocalDate.now())
                .orElse(null);

        if (attendance == null) {
            return null;
        }

        return mapToResponseDTO(attendance);
    }

    @Override
    public List<AttendanceResponseDTO> getEmployeeAttendance(Long employeeId) {
        return attendanceRepository.findByEmployeeIdOrderByAttendanceDateDesc(employeeId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceResponseDTO> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByAttendanceDate(date)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceResponseDTO> getMonthlyAttendance(Long employeeId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.getMonthlyAttendance(employeeId, startDate, endDate)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AttendanceSummaryDTO getAttendanceSummary(Long employeeId, LocalDate startDate, LocalDate endDate) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        List<Attendance> attendanceList = attendanceRepository.getMonthlyAttendance(employeeId, startDate, endDate);

        Long presentDays = attendanceRepository.countPresentDays(employeeId, startDate, endDate);
        Long absentDays = attendanceRepository.countAbsentDays(employeeId, startDate, endDate);
        Long lateDays = attendanceRepository.countLateDays(employeeId, startDate, endDate);

        long halfDays = attendanceList.stream()
                .filter(a -> "HALF_DAY".equals(a.getStatus()))
                .count();

        long leaveDays = attendanceList.stream()
                .filter(a -> "LEAVE".equals(a.getStatus()))
                .count();

        // Calculate working days (excluding weekends and holidays)
        long totalWorkingDays = attendanceList.size();

        double totalWorkingHours = attendanceList.stream()
                .mapToDouble(a -> a.getWorkingHours() != null ? a.getWorkingHours() : 0)
                .sum();

        double attendancePercentage = totalWorkingDays > 0
                ? ((double) presentDays / totalWorkingDays) * 100
                : 0;

        return AttendanceSummaryDTO.builder()
                .employeeId(employeeId)
                .employeeName(employee.getFullName())
                .month(YearMonth.from(startDate).toString())
                .totalWorkingDays(totalWorkingDays)
                .presentDays(presentDays)
                .absentDays(absentDays)
                .halfDays(halfDays)
                .leaveDays(leaveDays)
                .lateDays(lateDays)
                .attendancePercentage(Math.round(attendancePercentage * 100.0) / 100.0)
                .totalWorkingHours(Math.round(totalWorkingHours * 100.0) / 100.0)
                .build();
    }

    @Override
    @Transactional
    public void deleteAttendance(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with id: " + id));
        attendanceRepository.delete(attendance);
    }

    // Helper method to map Attendance to DTO
    private AttendanceResponseDTO mapToResponseDTO(Attendance attendance) {
        return AttendanceResponseDTO.builder()
                .id(attendance.getId())
                .employeeId(attendance.getEmployee().getId())
                .employeeName(attendance.getEmployee().getFullName())
                .employeeCode(attendance.getEmployee().getEmployeeCode())
                .attendanceDate(attendance.getAttendanceDate())
                .clockInTime(attendance.getClockInTime())
                .clockOutTime(attendance.getClockOutTime())
                .status(attendance.getStatus())
                .remarks(attendance.getRemarks())
                .workingHours(attendance.getWorkingHours())
                .isLate(attendance.getIsLate())
                .lateMinutes(attendance.getLateMinutes())
                .createdAt(attendance.getCreatedAt())
                .updatedAt(attendance.getUpdatedAt())
                .build();
    }
}
