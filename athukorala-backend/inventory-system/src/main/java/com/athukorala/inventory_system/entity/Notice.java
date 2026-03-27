package com.athukorala.inventory_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Data
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String message;

    private String targetRole; // "STAFF" or "CUSTOMER"

    private LocalDateTime createdAt;

    private LocalDate startDate;  // THE DAY THE PROMO ACTIVATES
    private LocalDate expiryDate; // THE DAY THE PROMO EXPIRES
    private boolean urgent;
    private boolean active;
}