package com.example.hr.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequestDTO {
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String gender;
    private String profileImage;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private String country;
}
