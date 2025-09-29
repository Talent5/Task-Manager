package com.taskmanager.controller;

import com.taskmanager.dto.ApiResponse;
import com.taskmanager.dto.JwtResponse;
import com.taskmanager.dto.LoginRequest;
import com.taskmanager.dto.RegisterRequest;
import com.taskmanager.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Login attempt for username: {}", loginRequest.getUsername());
        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
            log.info("Login successful for username: {}", loginRequest.getUsername());
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            log.error("Login failed for username: {}. Error: {}", loginRequest.getUsername(), e.getMessage());
            throw e;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        log.info("Registration attempt for username: {}", signUpRequest.getUsername());
        try {
            authService.registerUser(signUpRequest);
            log.info("User registration successful for username: {}", signUpRequest.getUsername());
            return ResponseEntity.ok(ApiResponse.success("User registered successfully!"));
        } catch (Exception e) {
            log.error("Registration failed for username: {}. Error: {}", signUpRequest.getUsername(), e.getMessage());
            throw e;
        }
    }
}