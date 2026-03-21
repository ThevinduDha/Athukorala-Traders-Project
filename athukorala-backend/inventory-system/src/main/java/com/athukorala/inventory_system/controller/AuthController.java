package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.User;
import com.athukorala.inventory_system.entity.Role;
import com.athukorala.inventory_system.service.AuthService;
import com.athukorala.inventory_system.dto.LoginRequest; // Added import
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

    // --- NEW LOGIN ENDPOINT ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(401).body(response);
        }
    }

    // Public Endpoint: Standard Customer Registration
    @PostMapping("/register")
    public ResponseEntity<User> registerCustomer(@RequestBody User user) {
        return ResponseEntity.ok(authService.registerCustomer(user));
    }

    // Admin-Only Endpoint: Create Staff Members
    @PostMapping("/admin/create-staff")
    public ResponseEntity<User> createStaff(@RequestBody User user) {
        return ResponseEntity.ok(authService.createInternalUser(user, Role.STAFF));
    }

    // Admin-Only Endpoint: Create other Admins
    @PostMapping("/admin/create-admin")
    public ResponseEntity<User> createAdmin(@RequestBody User user) {
        return ResponseEntity.ok(authService.createInternalUser(user, Role.ADMIN));
    }
}