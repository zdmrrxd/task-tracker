package com.tasktracker.backend.service;

import com.tasktracker.backend.exception.AccessForbiddenException;
import com.tasktracker.backend.exception.TaskLimitExceededException;
import com.tasktracker.backend.model.Role;
import com.tasktracker.backend.model.Task;
import com.tasktracker.backend.model.User;
import com.tasktracker.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Value("${app.tasks.max-per-user:300}")
    private int maxTasksPerUser = 300;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    /**
     * ADMIN sees every task in the system;
     * regular USER only sees their own tasks.
     */
    public List<Task> getVisibleTasks(User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return taskRepository.findAll();
        }

        return taskRepository.findByOwner_Id(currentUser.getId());
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    /**
     * Fetches a task and verifies that the current user
     * is either its owner or an ADMIN.
     */
    public Optional<Task> getAuthorizedTask(
            Long id,
            User currentUser
    ) {
        return taskRepository.findById(id)
                .map(task -> {
                    assertOwnerOrAdmin(task, currentUser);
                    return task;
                });
    }

    public Task createTask(
            Task task,
            User owner
    ) {
        long existingCount =
                taskRepository.countByOwner_Id(owner.getId());

        if (existingCount >= maxTasksPerUser) {
            throw new TaskLimitExceededException(
                    "Görev limitine ulaştınız (maksimum "
                            + maxTasksPerUser
                            + "). Yeni görev ekleyebilmek için önce bazı görevleri tamamlayın veya silin."
            );
        }

        task.setOwner(owner);

        return taskRepository.save(task);
    }

    public Optional<Task> updateTask(
            Long id,
            Task updatedTask,
            User currentUser
    ) {
        return taskRepository.findById(id)
                .map(existingTask -> {

                    assertOwnerOrAdmin(
                            existingTask,
                            currentUser
                    );

                    existingTask.setTitle(
                            updatedTask.getTitle()
                    );

                    existingTask.setDescription(
                            updatedTask.getDescription()
                    );

                    existingTask.setStatus(
                            updatedTask.getStatus()
                    );

                    existingTask.setPriority(
                            updatedTask.getPriority()
                    );

                    existingTask.setDueDate(
                            updatedTask.getDueDate()
                    );

                    return taskRepository.save(
                            existingTask
                    );
                });
    }

    public boolean deleteTask(
            Long id,
            User currentUser
    ) {
        return taskRepository.findById(id)
                .map(task -> {

                    assertOwnerOrAdmin(
                            task,
                            currentUser
                    );

                    taskRepository.delete(task);

                    return true;
                })
                .orElse(false);
    }

    private void assertOwnerOrAdmin(
            Task task,
            User currentUser
    ) {
        boolean isOwner =
                task.getOwner() != null
                        && task.getOwner()
                        .getId()
                        .equals(currentUser.getId());

        boolean isAdmin =
                currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessForbiddenException(
                    "Bu göreve erişim yetkiniz yok."
            );
        }
    }
}