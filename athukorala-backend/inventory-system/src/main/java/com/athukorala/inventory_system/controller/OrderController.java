package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Order;
import com.athukorala.inventory_system.repository.OrderRepository;
import com.athukorala.inventory_system.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @Autowired
    public OrderController(OrderService orderService, OrderRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    @PostMapping("/checkout")
    public Order processCheckout(@RequestBody Map<String, Object> payload) {
        // Extracting data from the React frontend payload
        Long userId = Long.valueOf(payload.get("userId").toString());
        String address = payload.get("address").toString();
        String phone = payload.get("phone").toString();
        Double total = Double.valueOf(payload.get("total").toString());

        // This call will: 1. Reduce Stock, 2. Clear Cart, 3. Create Order
        return orderService.finalizeOrder(userId, address, phone, total);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUserId(@PathVariable Long userId) {
        return orderService.getOrdersByUserId(userId);
    }

    // --- ADMIN LOGISTICS METHODS ---

    @GetMapping("/all")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PatchMapping("/update-status/{id}")
    public Order updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order Protocol Not Found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}