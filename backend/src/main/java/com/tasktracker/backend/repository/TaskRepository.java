package com.tasktracker.backend.repository;

import com.tasktracker.backend.model.Task;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Fetch owner together with tasks to avoid unnecessary
     * additional queries while serializing owner information.
     */
    @EntityGraph(attributePaths = "owner")
    List<Task> findByOwner_Id(Long ownerId);

    /**
     * Admin task lists also need owner information.
     * Fetch it together with the task list.
     */
    @Override
    @EntityGraph(attributePaths = "owner")
    List<Task> findAll();

    long countByOwner_Id(Long ownerId);
}