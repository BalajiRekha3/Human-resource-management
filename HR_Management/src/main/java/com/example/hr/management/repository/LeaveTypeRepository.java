// src/main/java/com/example/hr/management/repository/LeaveTypeRepository.java
package com.example.hr.management.repository;

import com.example.hr.management.entity.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveTypeRepository extends JpaRepository<LeaveType, Long> {

    Optional<LeaveType> findByName(String name);

    List<LeaveType> findByIsActive(Boolean isActive);
}
