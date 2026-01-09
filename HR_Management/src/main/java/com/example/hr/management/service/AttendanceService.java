package com.example.hr.management.service;

import com.example.hr.management.dto.AttendanceRequestDTO;
import com.example.hr.management.dto.AttendanceResponseDTO;
import com.example.hr.management.dto.AttendanceSummaryDTO;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    
    AttendanceResponseDTO clockIn(Long employeeId);
    
    AttendanceResponseDTO clockOut(Long employeeId);
    
    AttendanceResponseDTO markAttendance(AttendanceRequestDTO requestDTO);
    
    AttendanceResponseDTO updateAttendance(Long id, AttendanceRequestDTO requestDTO);
    
    AttendanceResponseDTO getAttendanceById(Long id);
    
    AttendanceResponseDTO getTodayAttendance(Long employeeId);
    
    List<AttendanceResponseDTO> getEmployeeAttendance(Long employeeId);
    
    List<AttendanceResponseDTO> getAttendanceByDate(LocalDate date);
    
    List<AttendanceResponseDTO> getMonthlyAttendance(Long employeeId, LocalDate startDate, LocalDate endDate);
    
    AttendanceSummaryDTO getAttendanceSummary(Long employeeId, LocalDate startDate, LocalDate endDate);
    
    void deleteAttendance(Long id);
}
