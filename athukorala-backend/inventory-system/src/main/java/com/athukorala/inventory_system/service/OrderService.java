package com.athukorala.inventory_system.service;

import com.athukorala.inventory_system.entity.*;
import com.athukorala.inventory_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    /**
     * Finalizes the purchase by deducting stock, creating an order,
     * and clearing the user's cart in a single atomic transaction.
     */
    @Transactional
    public Order finalizeOrder(Long userId, String address, String phone, Double total) {
        // 1. Fetch the user's current manifest from the cart
        List<CartItem> items = cartRepository.findByUserId(userId);
        if (items.isEmpty()) {
            throw new RuntimeException("Manifest is empty. Protocol aborted.");
        }

        // 2. Deduct Stock from Inventory
        for (CartItem item : items) {
            Product product = item.getProduct();

            // Check if hardware asset is still available
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }

            // Update stock level
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);
        }

        // 3. Create the Industrial Order Record
        Order order = new Order();
        order.setUserId(userId);
        order.setTotalAmount(total);
        order.setShippingAddress(address);
        order.setContactNumber(phone);
        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        // 4. Purge the Cart Registry after successful transaction
        cartRepository.deleteAll(items);

        return savedOrder;
    }

    /**
     * Retrieves all past transaction logs for a specific user.
     */
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}