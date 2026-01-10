package com.example.hr.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeResponseDTO {

    private Long id;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private Integer age;
    private String gender;
    private String profileImage;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private String department;
    private String designation;
    private String uanNo;
    private String pfNo;
    private String esiNo;
    private String panNo;
    private String bankName;
    private String bankAccountNo;
    private String ifscCode;
    private LocalDate joiningDate;
    private String employmentType;
    private String employmentStatus;
    private Double basicSalary;
    private Long managerId;
    private String managerName;
    private Long userId;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
