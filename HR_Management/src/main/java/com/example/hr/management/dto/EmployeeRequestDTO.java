package com.example.hr.management.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequestDTO {

    @NotBlank(message = "Employee code is required")
    private String employeeCode;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    private String phoneNumber;

    private LocalDate dateOfBirth;

    private String gender;

    private String address;

    private String city;

    private String state;

    private String postalCode;

    private String country;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Designation is required")
    private String designation;

    private String uanNo;
    private String pfNo;
    private String esiNo;
    private String panNo;
    private String bankName;
    private String bankAccountNo;
    private String ifscCode;

    @NotNull(message = "Joining date is required")
    private LocalDate joiningDate;

    private String employmentType;

    private String employmentStatus;

    @NotNull(message = "Basic salary is required")
    private Double basicSalary;

    private Long managerId;

    private Long userId;
}
