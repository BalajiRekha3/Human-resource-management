package com.example.hr.management.repository;

import com.example.hr.management.entity.Leave;
import com.example.hr.management.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Long> {

    List<Leave> findByEmployeeIdAndStatus(Long employeeId, LeaveStatus status);

    List<Leave> findByEmployeeId(Long employeeId);

    List<Leave> findByStatus(LeaveStatus status);

    @Query("SELECT l FROM Leave l WHERE l.employee.id = :employeeId " +
            "AND YEAR(l.fromDate) = :year ORDER BY l.fromDate DESC")
    List<Leave> findLeavesByEmployeeAndYear(@Param("employeeId") Long employeeId,
            @Param("year") Integer year);

    @Query("SELECT l FROM Leave l WHERE l.fromDate <= :endDate AND l.toDate >= :startDate " +
            "AND l.employee.id = :employeeId AND l.status = 'APPROVED'")
    List<Leave> findOverlappingLeaves(@Param("employeeId") Long employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    void deleteByEmployeeId(Long employeeId);
}
