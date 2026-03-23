package com.athukorala.inventory_system.service;

import com.athukorala.inventory_system.entity.*;
import com.athukorala.inventory_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private CartItemRepository cartRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private AuditLogRepository auditLogRepository; // Added for tracking [cite: 631, 665]

    @Transactional
    public Order finalizeOrder(Long userId, String address, String phone, Double total) {
        // 1. Fetch current cart items
        List<CartItem> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Purchase Protocol Failed: Cart Registry is empty");
        }

        // 2. Map CartItems to OrderItems and Sync Inventory
        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            Product product = cartItem.getProduct();

            // Deduct stock and prevent negative inventory [cite: 739, 768, 1085]
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Inventory Shortage: Insufficient stock for " + product.getName());
            }

            int newQuantity = product.getStockQuantity() - cartItem.getQuantity();
            product.setStockQuantity(newQuantity);
            productRepository.save(product);

            // Create immutable record of the purchased item [cite: 815]
            OrderItem orderItem = new OrderItem();
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());
            return orderItem;
        }).collect(Collectors.toList());

        // 3. Create the Master Order record [cite: 812-821]
        Order order = new Order();
        order.setUserId(userId);
        order.setShippingAddress(address);
        order.setContactNumber(phone);
        order.setTotalAmount(total);
        order.setStatus("PENDING"); // Initial status upon creation [cite: 761]
        order.setOrderDate(LocalDateTime.now());
        order.setOrderItems(orderItems);

        // 4. Record the transaction in the Audit Log [cite: 563, 631]
        AuditLog log = new AuditLog();
        log.setAction("ORDER_CREATION");
        log.setPerformedBy("USER_ID_" + userId);
        log.setDetails("Transaction initialized for total valuation: LKR " + total);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);

        // 5. Clear the cart registry [cite: 744, 839]
        cartRepository.deleteAll(cartItems);

        return orderRepository.save(order);
    }

    // New: Admin capability to manage order lifecycle [cite: 803-806]
    @Transactional
    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order Protocol Not Found"));

        order.setStatus(newStatus.toUpperCase());
        return orderRepository.save(order);
    }

    // Support for Customer Order History [cite: 786-788]
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}