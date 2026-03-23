package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.AuditLog;
import com.athukorala.inventory_system.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "http://localhost:5173")
public class AuditLogController {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping("/logs")
    public List<AuditLog> getLogs() {
        // Return latest logs first
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}