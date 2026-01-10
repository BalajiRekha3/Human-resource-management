package com.example.hr.management.repository;

import com.example.hr.management.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

        Optional<Attendance> findByEmployeeIdAndAttendanceDate(Long employeeId, LocalDate date);

        List<Attendance> findByEmployeeIdOrderByAttendanceDateDesc(Long employeeId);

        List<Attendance> findByAttendanceDate(LocalDate date);

        List<Attendance> findByEmployeeIdAndAttendanceDateBetween(Long employeeId, LocalDate startDate,
                        LocalDate endDate);

        List<Attendance> findByStatus(String status);

        @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId AND a.attendanceDate BETWEEN :startDate AND :endDate ORDER BY a.attendanceDate DESC")
        List<Attendance> getMonthlyAttendance(@Param("employeeId") Long employeeId,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("SELECT COUNT(a) FROM Attendance a WHERE a.employee.id = :employeeId AND a.status = 'PRESENT' AND a.attendanceDate BETWEEN :startDate AND :endDate")
        Long countPresentDays(@Param("employeeId") Long employeeId, @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("SELECT COUNT(a) FROM Attendance a WHERE a.employee.id = :employeeId AND a.status = 'ABSENT' AND a.attendanceDate BETWEEN :startDate AND :endDate")
        Long countAbsentDays(@Param("employeeId") Long employeeId, @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("SELECT COUNT(a) FROM Attendance a WHERE a.employee.id = :employeeId AND a.isLate = true AND a.attendanceDate BETWEEN :startDate AND :endDate")
        Long countLateDays(@Param("employeeId") Long employeeId, @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        void deleteByEmployeeId(Long employeeId);
}
