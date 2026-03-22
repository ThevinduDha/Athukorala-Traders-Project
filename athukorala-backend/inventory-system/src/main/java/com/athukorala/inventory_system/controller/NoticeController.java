package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Notice;
import com.athukorala.inventory_system.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/notices")
@CrossOrigin(origins = "http://localhost:5173")
public class NoticeController {

    @Autowired
    private NoticeRepository noticeRepository;

    @PostMapping("/staff")
    public Notice postStaffNotice(@RequestBody Notice notice) {
        notice.setTargetRole("STAFF"); // Ensures it's internal only [cite: 956]
        notice.setCreatedAt(LocalDateTime.now());
        return noticeRepository.save(notice);
    }
}