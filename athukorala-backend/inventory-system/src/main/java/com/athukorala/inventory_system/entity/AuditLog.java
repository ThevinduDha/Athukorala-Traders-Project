package com.athukorala.inventory_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;      // e.g., "STOCK_ADJUSTMENT", "ORDER_STATUS_UPDATE"
    private String performedBy; // Username of the Admin/Staff
    private String details;     // e.g., "Added 50 units to Item #101"
    private LocalDateTime timestamp = LocalDateTime.now();
}