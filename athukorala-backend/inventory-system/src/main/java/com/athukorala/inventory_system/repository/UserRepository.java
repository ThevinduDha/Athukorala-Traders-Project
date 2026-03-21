package com.athukorala.inventory_system.repository;

import com.athukorala.inventory_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // This allows the Login logic to find users by email
    Optional<User> findByEmail(String email);
}