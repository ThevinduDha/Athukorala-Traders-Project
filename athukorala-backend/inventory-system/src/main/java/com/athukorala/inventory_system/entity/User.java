package com.athukorala.inventory_system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // Will be encrypted with BCrypt

    private String phone;
    private String address;

    @Enumerated(EnumType.STRING)
    private Role role; // ADMIN, STAFF, or CUSTOMER

    private LocalDateTime createdAt = LocalDateTime.now();
}