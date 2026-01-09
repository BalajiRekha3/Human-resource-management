// src/main/java/com/example/hr/management/dto/LeaveTypeDTO.java
package com.example.hr.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveTypeDTO {

    private Long id;
    private String name;
    private String description;
    private Integer totalDays;
    private Boolean isActive;
}
