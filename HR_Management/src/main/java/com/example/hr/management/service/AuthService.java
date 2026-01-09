package com.example.hr.management.service;

import com.example.hr.management.dto.LoginRequestDTO;
import com.example.hr.management.dto.LoginResponseDTO;
import com.example.hr.management.entity.User;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO loginRequest);
    User register(User user);
    void initializeRoles();
}
