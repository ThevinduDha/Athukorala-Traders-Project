package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.User;
import com.athukorala.inventory_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/customers")
    public List<User> getAllCustomers() {
        // Filter to only return users with the CUSTOMER role
        return userRepository.findAll().stream()
                .filter(user -> "CUSTOMER".equals(user.getRole()))
                .collect(Collectors.toList());
    }
}