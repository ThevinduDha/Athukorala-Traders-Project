package com.athukorala.inventory_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Double totalAmount;
    private String shippingAddress;
    private String contactNumber;
    private String status; // e.g., "PENDING", "CONFIRMED", "COMPLETED" [cite: 758-760]
    private LocalDateTime orderDate;

    // --- NEW: Link to specific items purchased in this order ---
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id")
    private List<OrderItem> orderItems;
}