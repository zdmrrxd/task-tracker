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

    public List<Task> tumGorevleriGetir() {
        return taskRepository.findAll();
    }

    public Optional<Task> gorevGetir(Long id) {
        return taskRepository.findById(id);
    }

    public Task gorevKaydet(Task task) {
        return taskRepository.save(task);
    }

    public void gorevSil(Long id) {
        taskRepository.deleteById(id);
    }
}
