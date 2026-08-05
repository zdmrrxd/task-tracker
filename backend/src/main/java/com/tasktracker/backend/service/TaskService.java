package com.tasktracker.backend.service;

import com.tasktracker.backend.model.Task;
import com.tasktracker.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() { return taskRepository.findAll(); }

    public Optional<Task> getTaskById(Long id) { return taskRepository.findById(id); }

    public Task saveTask(Task task) { return taskRepository.save(task); }
    public Optional<Task> updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id)
                .map(existingTask -> {
                    existingTask.setTitle(updatedTask.getTitle());
                    existingTask.setDescription(updatedTask.getDescription());
                    existingTask.setStatus(updatedTask.getStatus());
                    existingTask.setPriority(updatedTask.getPriority());
                    existingTask.setDueDate(updatedTask.getDueDate());

                    return taskRepository.save(existingTask);
                });
    }

    public void deleteTask(Long id) { taskRepository.deleteById(id); }
}
