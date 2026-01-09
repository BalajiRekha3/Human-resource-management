package com.example.hr.management.config;

import com.example.hr.management.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final AuthService authService;
    
    @Override
    public void run(String... args) throws Exception {
        authService.initializeRoles();
        System.out.println("✅ Roles initialized successfully!");
    }
}
