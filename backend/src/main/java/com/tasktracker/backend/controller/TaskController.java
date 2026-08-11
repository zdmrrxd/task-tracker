package com.tasktracker.backend.controller;

import com.tasktracker.backend.model.Task;
import com.tasktracker.backend.model.User;
import com.tasktracker.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * All endpoints here require an authenticated user (enforced by SecurityConfig).
 * A regular USER only ever sees/modifies their own tasks; an ADMIN sees everything.
 * Ownership checks are enforced in TaskService, not just hidden in the frontend.
 */
@RestController
<<<<<<< Updated upstream
@CrossOrigin(origins = "http://localhost:5174")
=======
>>>>>>> Stashed changes
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> getAllTasks(@AuthenticationPrincipal User currentUser) {
        return taskService.getVisibleTasks(currentUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return taskService.getAuthorizedTask(id, currentUser)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Task createTask(
            @Valid @RequestBody Task task,
            @AuthenticationPrincipal User currentUser) {
        return taskService.createTask(task, currentUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody Task updatedTask,
            @AuthenticationPrincipal User currentUser) {

        return taskService.updateTask(id, updatedTask, currentUser)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        if (taskService.getTaskById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        taskService.deleteTask(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}