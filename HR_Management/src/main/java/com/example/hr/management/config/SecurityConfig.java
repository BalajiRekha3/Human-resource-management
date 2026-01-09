package com.example.hr.management.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // ✅ Allow specific frontend origins
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",      // React dev server
            "http://localhost:5173",      // Vite dev server
            "http://localhost:8080",      // Frontend
            "http://localhost:9090",      // Backend (for testing)
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:8080",
            "http://127.0.0.1:9090"
        ));
        
        // ✅ Allow HTTP methods
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        
        // ✅ Allow headers (especially Authorization for JWT)
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept"
        ));
        
        // ✅ Expose Authorization header in response
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type"
        ));
        
        // ✅ Allow credentials (JWT tokens, cookies)
        configuration.setAllowCredentials(true);
        
        // ✅ Cache preflight requests for 1 hour
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // ✅ CORS Configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // ✅ CSRF Protection (disabled for API)
            .csrf(AbstractHttpConfigurer::disable)
            
            // ✅ Authorization Rules with Role-based Access
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - No authentication needed
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/api-docs/**", "/swagger-resources/**").permitAll()
                .requestMatchers("/v3/api-docs/**").permitAll()
                
                // ADMIN endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // HR endpoints - ADMIN and HR roles
                .requestMatchers("/api/hr/**").hasAnyRole("ADMIN", "HR")
                
                // Leave Management - All authenticated users
                .requestMatchers("/api/leaves/**").authenticated()
                .requestMatchers("/api/leave-types/**").hasAnyRole("ADMIN", "HR")
                .requestMatchers("/api/leave-balances/**").authenticated()
                
                // Employee endpoints - ADMIN, HR, EMPLOYEE
                .requestMatchers("/api/employee/**").hasAnyRole("ADMIN", "HR", "EMPLOYEE")
                .requestMatchers("/api/employees/**").hasAnyRole("ADMIN", "HR")
                
                // Attendance endpoints
                .requestMatchers("/api/attendance/**").authenticated()
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            
            // ✅ Session Management (Stateless for JWT)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // ✅ Authentication Provider
            .authenticationProvider(authenticationProvider())
            
            // ✅ JWT Filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}