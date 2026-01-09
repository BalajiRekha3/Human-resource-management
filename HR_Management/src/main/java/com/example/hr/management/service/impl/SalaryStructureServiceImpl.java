package com.example.hr.management.service.impl;

import com.example.hr.management.entity.Employee;
import com.example.hr.management.entity.SalaryStructure;
import com.example.hr.management.exception.ResourceNotFoundException;
import com.example.hr.management.repository.EmployeeRepository;
import com.example.hr.management.repository.SalaryStructureRepository;
import com.example.hr.management.service.SalaryStructureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SalaryStructureServiceImpl implements SalaryStructureService {

    private final SalaryStructureRepository salaryStructureRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public SalaryStructure createOrUpdateSalaryStructure(Long employeeId, SalaryStructure salaryStructure) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        SalaryStructure existingStructure = salaryStructureRepository.findByEmployeeId(employeeId)
                .orElse(new SalaryStructure());

        existingStructure.setEmployee(employee);
        existingStructure.setBasicSalary(salaryStructure.getBasicSalary());
        existingStructure.setHouseRentAllowance(salaryStructure.getHouseRentAllowance());
        existingStructure.setDearnessAllowance(salaryStructure.getDearnessAllowance());
        existingStructure.setMedicalAllowance(salaryStructure.getMedicalAllowance());
        existingStructure.setTransportAllowance(salaryStructure.getTransportAllowance());
        existingStructure.setSpecialAllowance(salaryStructure.getSpecialAllowance());
        existingStructure.setProvidentFund(salaryStructure.getProvidentFund());
        existingStructure.setProfessionalTax(salaryStructure.getProfessionalTax());
        existingStructure.setIncomeTax(salaryStructure.getIncomeTax());

        // Calculate totals
        // Gross = Basic + HRA + DA + Medical + Transport + Special
        // Net = Gross - (PF + ProfTax + IncomeTax)
        existingStructure.setGrossSalary(
                existingStructure.getBasicSalary()
                        .add(existingStructure.getHouseRentAllowance())
                        .add(existingStructure.getDearnessAllowance())
                        .add(existingStructure.getMedicalAllowance())
                        .add(existingStructure.getTransportAllowance())
                        .add(existingStructure.getSpecialAllowance()));

        existingStructure.setNetSalary(
                existingStructure.getGrossSalary()
                        .subtract(existingStructure.getProvidentFund())
                        .subtract(existingStructure.getProfessionalTax())
                        .subtract(existingStructure.getIncomeTax()));

        return salaryStructureRepository.save(existingStructure);
    }

    @Override
    public SalaryStructure getSalaryStructure(Long employeeId) {
        return salaryStructureRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Salary structure not found for employee"));
    }
}
