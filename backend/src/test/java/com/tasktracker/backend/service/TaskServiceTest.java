package com.tasktracker.backend.service;

import com.tasktracker.backend.exception.AccessForbiddenException;
import com.tasktracker.backend.model.Role;
import com.tasktracker.backend.model.Task;
import com.tasktracker.backend.model.User;
import com.tasktracker.backend.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private User regularUser;
    private User adminUser;
    private User otherUser;

    @BeforeEach
    void setUp() {
        regularUser = new User();
        regularUser.setId(1L);
        regularUser.setRole(Role.USER);

        adminUser = new User();
        adminUser.setId(2L);
        adminUser.setRole(Role.ADMIN);

        otherUser = new User();
        otherUser.setId(3L);
        otherUser.setRole(Role.USER);
    }

    @Test
    void shouldReturnAllTasksForAdmin() {
        Task task = new Task();
        task.setTitle("Admin Task");

        when(taskRepository.findAll()).thenReturn(List.of(task));

        List<Task> result = taskService.getVisibleTasks(adminUser);

        assertEquals(1, result.size());
        assertEquals("Admin Task", result.get(0).getTitle());
        verify(taskRepository).findAll();
    }

    @Test
    void shouldReturnOnlyOwnedTasksForRegularUser() {
        Task task = new Task();
        task.setTitle("User Task");
        task.setOwner(regularUser);

        when(taskRepository.findByOwnerId(1L)).thenReturn(List.of(task));

        List<Task> result = taskService.getVisibleTasks(regularUser);

        assertEquals(1, result.size());
        assertEquals("User Task", result.get(0).getTitle());
        verify(taskRepository).findByOwnerId(1L);
    }

    @Test
    void shouldCreateTask() {
        Task task = new Task();
        task.setTitle("New Task");

        when(taskRepository.save(task)).thenReturn(task);

        Task result = taskService.createTask(task, regularUser);

        assertEquals("New Task", result.getTitle());
        assertEquals(regularUser, result.getOwner());
        verify(taskRepository).save(task);
    }

    @Test
    void shouldUpdateTaskWhenUserIsOwner() {
        Task existingTask = new Task();
        existingTask.setId(1L);
        existingTask.setTitle("Old Title");
        existingTask.setDescription("Old Description");
        existingTask.setStatus("IN_PROGRESS");
        existingTask.setPriority("LOW");
        existingTask.setOwner(regularUser);

        Task updatedTask = new Task();
        updatedTask.setTitle("New Title");
        updatedTask.setDescription("New Description");
        updatedTask.setStatus("COMPLETED");
        updatedTask.setPriority("HIGH");

        when(taskRepository.findById(1L)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(existingTask)).thenReturn(existingTask);

        Optional<Task> result = taskService.updateTask(1L, updatedTask, regularUser);

        assertTrue(result.isPresent());
        assertEquals("New Title", result.get().getTitle());
        assertEquals("New Description", result.get().getDescription());
        assertEquals("COMPLETED", result.get().getStatus());
        assertEquals("HIGH", result.get().getPriority());
    }

    @Test
    void shouldThrowExceptionWhenUserNotOwnerOrAdminOnUpdate() {
        Task existingTask = new Task();
        existingTask.setId(1L);
        existingTask.setOwner(regularUser);

        Task updatedTask = new Task();

        when(taskRepository.findById(1L)).thenReturn(Optional.of(existingTask));

        assertThrows(AccessForbiddenException.class, () ->
                taskService.updateTask(1L, updatedTask, otherUser)
        );
    }

    @Test
    void shouldReturnEmptyWhenTaskNotFoundOnUpdate() {
        Task updatedTask = new Task();
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Task> result = taskService.updateTask(99L, updatedTask, regularUser);

        assertFalse(result.isPresent());
    }

    @Test
    void shouldDeleteTaskWhenUserIsOwner() {
        Task task = new Task();
        task.setId(1L);
        task.setOwner(regularUser);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        taskService.deleteTask(1L, regularUser);

        verify(taskRepository).deleteById(1L);
    }

    @Test
    void shouldThrowExceptionWhenUserNotOwnerOrAdminOnDelete() {
        Task task = new Task();
        task.setId(1L);
        task.setOwner(regularUser);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        assertThrows(AccessForbiddenException.class, () ->
                taskService.deleteTask(1L, otherUser)
        );
    }
}