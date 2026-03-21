package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.User;
import com.athukorala.inventory_system.entity.Role;
import com.athukorala.inventory_system.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Allows your React app to talk to this backend
public class AuthController {

    @Autowired
    private AuthService authService;

    // Public Endpoint: Standard Customer Registration [cite: 65-67]
    @PostMapping("/register")
    public ResponseEntity<User> registerCustomer(@RequestBody User user) {
        return ResponseEntity.ok(authService.registerCustomer(user));
    }

    // Admin-Only Endpoint: Create Staff Members [cite: 78-80, 106]
    // In a real system, this would be protected by @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/create-staff")
    public ResponseEntity<User> createStaff(@RequestBody User user) {
        return ResponseEntity.ok(authService.createInternalUser(user, Role.STAFF));
    }

    // Admin-Only Endpoint: Create other Admins [cite: 78-80, 105]
    @PostMapping("/admin/create-admin")
    public ResponseEntity<User> createAdmin(@RequestBody User user) {
        return ResponseEntity.ok(authService.createInternalUser(user, Role.ADMIN));
    }
}