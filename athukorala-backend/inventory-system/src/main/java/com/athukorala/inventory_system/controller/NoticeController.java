package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.Notice;
import com.athukorala.inventory_system.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notices")
@CrossOrigin(origins = "http://localhost:5173")
public class NoticeController {

    private final NoticeRepository noticeRepository;

    @Autowired
    public NoticeController(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    // --- ADMIN: FETCH ALL FOR ARCHIVE ---
    @GetMapping("/all")
    public List<Notice> getAllNotices() {
        return noticeRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    // --- STAFF ENDPOINTS ---
    @PostMapping("/staff")
    public Notice postStaffNotice(@RequestBody Notice notice) {
        notice.setTargetRole("STAFF");
        notice.setCreatedAt(LocalDateTime.now());
        notice.setActive(true);
        return noticeRepository.save(notice);
    }

    @GetMapping("/staff")
    public List<Notice> getStaffNotices() {
        return noticeRepository.findAll().stream()
                .filter(n -> "STAFF".equals(n.getTargetRole()))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    // --- CUSTOMER PROMOTION ENDPOINTS ---
    @PostMapping("/publish")
    public Notice publishPromotion(@RequestBody Notice notice) {
        notice.setTargetRole("CUSTOMER");
        notice.setCreatedAt(LocalDateTime.now());
        notice.setActive(true);
        return noticeRepository.save(notice);
    }

    @GetMapping("/customer")
    public List<Notice> getCustomerNotices() {
        return noticeRepository.findAll().stream()
                .filter(n -> "CUSTOMER".equals(n.getTargetRole()) && n.isActive())
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    // --- ADMIN AUTHORITY: DELETE ---
    @DeleteMapping("/{id}")
    public void deleteNotice(@PathVariable Long id) {
        noticeRepository.deleteById(id);
    }

    // --- ADMIN AUTHORITY: UPDATE ---
    @PutMapping("/{id}")
    public Notice updateNotice(@PathVariable Long id, @RequestBody Notice updatedNotice) {
        return noticeRepository.findById(id).map(notice -> {
            notice.setTitle(updatedNotice.getTitle());
            notice.setMessage(updatedNotice.getMessage());
            notice.setStartDate(updatedNotice.getStartDate());
            notice.setExpiryDate(updatedNotice.getExpiryDate());
            notice.setUrgent(updatedNotice.isUrgent());
            notice.setActive(updatedNotice.isActive());
            return noticeRepository.save(notice);
        }).orElseThrow(() -> new RuntimeException("Notice Registry Not Found"));
    }
}