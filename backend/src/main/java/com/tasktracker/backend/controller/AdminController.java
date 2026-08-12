package com.tasktracker.backend.controller;

import com.tasktracker.backend.dto.UpdateUserStatusRequest;
import com.tasktracker.backend.dto.UserSummary;
import com.tasktracker.backend.exception.ResourceNotFoundException;
import com.tasktracker.backend.model.Task;
import com.tasktracker.backend.model.User;
import com.tasktracker.backend.repository.UserRepository;
import com.tasktracker.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ADMIN-only endpoints. Access is additionally locked down at the
 * SecurityConfig level ("/api/admin/**" requires ROLE_ADMIN), so this
 * controller enforces authorization in two independent layers (defense in depth).
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final TaskService taskService;

    public AdminController(UserRepository userRepository, TaskService taskService) {
        this.userRepository = userRepository;
        this.taskService = taskService;
    }

    /** List every user in the system, with their role and active/passive status. */
    @GetMapping("/users")
    public List<UserSummary> listUsers() {
        return userRepository.findAll().stream()
                .map(UserSummary::new)
                .toList();
    }

    /** Activate or deactivate a user account. A deactivated user can no longer log in. */
    @PatchMapping("/users/{id}/status")
    public ResponseEntity<UserSummary> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserStatusRequest request,
            @AuthenticationPrincipal User currentAdmin
    ) {
        User target = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı."));

        if (target.getId().equals(currentAdmin.getId()) && !request.getActive()) {
            return ResponseEntity.badRequest().build();
        }

        target.setActive(request.getActive());
        userRepository.save(target);

        return ResponseEntity.ok(new UserSummary(target));
    }

    /** Every task in the system, across all users. */
    @GetMapping("/tasks")
    public List<Task> listAllTasks(@AuthenticationPrincipal User currentAdmin) {
        return taskService.getVisibleTasks(currentAdmin);
    }
}