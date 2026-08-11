package com.tasktracker.backend.repository;

import com.tasktracker.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE t.owner.id = :ownerId")
    List<Task> findByOwnerId(@Param("ownerId") Long ownerId);
}