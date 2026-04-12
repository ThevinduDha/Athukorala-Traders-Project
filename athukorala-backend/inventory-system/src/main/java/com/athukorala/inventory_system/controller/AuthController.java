package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.dto.LoginRequest;
import com.athukorala.inventory_system.dto.UserResponseDto;
import com.athukorala.inventory_system.entity.Role;
import com.athukorala.inventory_system.entity.User;
import com.athukorala.inventory_system.security.JwtUtil;
import com.athukorala.inventory_system.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;   // 🔥 NEW

    // 🔐 LOGIN WITH JWT
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = authService.login(loginRequest.getEmail(), loginRequest.getPassword());

            // 🔥 Generate JWT
            String token = jwtUtil.generateToken(user.getEmail());

            // 🔥 Response with token + user
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", UserResponseDto.fromEntity(user));

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(401).body(response);
        }
    }

    // 📝 REGISTER CUSTOMER
    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody User user) {
        try {
            User registeredUser = authService.registerCustomer(user);
            return ResponseEntity.ok(UserResponseDto.fromEntity(registeredUser));
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    // 👨‍💼 CREATE STAFF
    @PostMapping("/admin/create-staff")
    public ResponseEntity<?> createStaff(@RequestBody User user) {
        try {
            User staff = authService.createInternalUser(user, Role.STAFF);
            return ResponseEntity.ok(UserResponseDto.fromEntity(staff));
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    // 👑 CREATE ADMIN
    @PostMapping("/admin/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody User user) {
        try {
            User admin = authService.createInternalUser(user, Role.ADMIN);
            return ResponseEntity.ok(UserResponseDto.fromEntity(admin));
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }
}