package com.athukorala.inventory_system.repository;

import com.athukorala.inventory_system.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    // This allows us to see the newest actions at the top of the list
    List<AuditLog> findAllByOrderByTimestampDesc();
}