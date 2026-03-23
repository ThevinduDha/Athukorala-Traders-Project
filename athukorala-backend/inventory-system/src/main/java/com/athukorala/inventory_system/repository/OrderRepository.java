package com.athukorala.inventory_system.repository;

import com.athukorala.inventory_system.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Required to retrieve specific customer transaction archives
    List<Order> findByUserId(Long userId);
}