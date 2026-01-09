package com.example.hr.management.service;

import com.example.hr.management.dto.EmployeeRequestDTO;
import com.example.hr.management.dto.EmployeeResponseDTO;

import java.util.List;

public interface EmployeeService {

    EmployeeResponseDTO createEmployee(EmployeeRequestDTO employeeRequestDTO);

    EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO employeeRequestDTO);

    EmployeeResponseDTO getEmployeeById(Long id);

    EmployeeResponseDTO getEmployeeByCode(String employeeCode);

    List<EmployeeResponseDTO> getAllEmployees();

    List<EmployeeResponseDTO> getEmployeesByDepartment(String department);

    List<EmployeeResponseDTO> getEmployeesByStatus(String status);

    List<EmployeeResponseDTO> searchEmployees(String keyword);

    void deleteEmployee(Long id);

    Long getActiveEmployeeCount();

    Long getEmployeeCountByDepartment(String department);
}
