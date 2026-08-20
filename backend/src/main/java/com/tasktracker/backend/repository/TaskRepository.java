package com.tasktracker.backend.repository;

import com.tasktracker.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByOwner_Id(Long ownerId);

    long countByOwner_Id(Long ownerId);

}