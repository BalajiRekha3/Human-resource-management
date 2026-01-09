package com.example.hr.management.service.impl;

import com.example.hr.management.dto.LoginRequestDTO;
import com.example.hr.management.dto.LoginResponseDTO;
import com.example.hr.management.entity.Role;
import com.example.hr.management.entity.User;
import com.example.hr.management.exception.BadRequestException;
import com.example.hr.management.exception.ResourceNotFoundException;
import com.example.hr.management.repository.RoleRepository;
import com.example.hr.management.repository.UserRepository;
import com.example.hr.management.service.AuthService;
import com.example.hr.management.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()));

        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return LoginResponseDTO.builder()
                .token(token)
                .type("Bearer")
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .build();
    }

    @Override
    @Transactional
    public User register(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setEnabled(true);
        user.setAccountNonLocked(true);

        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Role employeeRole = roleRepository.findByName("ROLE_EMPLOYEE")
                    .orElseThrow(() -> new ResourceNotFoundException("Default role not found"));
            Set<Role> roles = new HashSet<>();
            roles.add(employeeRole);
            user.setRoles(roles);
        }

        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void initializeRoles() {
        if (!roleRepository.existsByName("ROLE_ADMIN")) {
            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            adminRole.setDescription("Administrator with full access");
            roleRepository.save(adminRole);
        }

        if (!roleRepository.existsByName("ROLE_HR")) {
            Role hrRole = new Role();
            hrRole.setName("ROLE_HR");
            hrRole.setDescription("HR Manager");
            roleRepository.save(hrRole);
        }

        if (!roleRepository.existsByName("ROLE_MANAGER")) {
            Role managerRole = new Role();
            managerRole.setName("ROLE_MANAGER");
            managerRole.setDescription("Department Manager");
            roleRepository.save(managerRole);
        }

        if (!roleRepository.existsByName("ROLE_EMPLOYEE")) {
            Role employeeRole = new Role();
            employeeRole.setName("ROLE_EMPLOYEE");
            employeeRole.setDescription("Regular Employee");
            roleRepository.save(employeeRole);
        }
    }
}
