package com.tasktracker.backend.service;

import com.tasktracker.backend.model.Task;
import com.tasktracker.backend.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void shouldReturnAllTasks() {
        Task task = new Task();
        task.setTitle("Test Task");

        when(taskRepository.findAll()).thenReturn(List.of(task));

        List<Task> result = taskService.getAllTasks();

        assertEquals(1, result.size());
        assertEquals("Test Task", result.get(0).getTitle());
    }

    @Test
    void shouldSaveTask() {
        Task task = new Task();
        task.setTitle("New Task");

        when(taskRepository.save(task)).thenReturn(task);

        Task result = taskService.saveTask(task);

        assertEquals("New Task", result.getTitle());
    }

    @Test
    void shouldUpdateTask() {
        Task existingTask = new Task();
        existingTask.setId(1L);
        existingTask.setTitle("Old Title");
        existingTask.setDescription("Old Description");
        existingTask.setStatus("IN_PROGRESS");
        existingTask.setPriority("LOW");

        Task updatedTask = new Task();
        updatedTask.setTitle("New Title");
        updatedTask.setDescription("New Description");
        updatedTask.setStatus("COMPLETED");
        updatedTask.setPriority("HIGH");

        when(taskRepository.findById(1L)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(existingTask)).thenReturn(existingTask);

        Optional<Task> result = taskService.updateTask(1L, updatedTask);

        assertTrue(result.isPresent());
        assertEquals("New Title", result.get().getTitle());
        assertEquals("New Description", result.get().getDescription());
        assertEquals("COMPLETED", result.get().getStatus());
        assertEquals("HIGH", result.get().getPriority());
    }

    @Test
    void shouldReturnEmptyWhenTaskNotFoundOnUpdate() {
        Task updatedTask = new Task();
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Task> result = taskService.updateTask(99L, updatedTask);

        assertFalse(result.isPresent());
    }

    @Test
    void shouldDeleteTask() {
        taskService.deleteTask(1L);

        verify(taskRepository).deleteById(1L);
    }
}