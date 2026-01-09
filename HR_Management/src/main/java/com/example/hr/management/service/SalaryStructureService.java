package com.example.hr.management.service;

import com.example.hr.management.entity.SalaryStructure;

public interface SalaryStructureService {
    SalaryStructure createOrUpdateSalaryStructure(Long employeeId, SalaryStructure salaryStructure);

    SalaryStructure getSalaryStructure(Long employeeId);
}
