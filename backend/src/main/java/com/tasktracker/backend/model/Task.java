package com.tasktracker.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The user this task belongs to. A USER can only see/manage tasks they own;
     * an ADMIN can see every task. Never serialized directly (contains the password
     * hash) - {@link #getOwnerUsername()} / {@link #getOwnerId()} expose the safe bits.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnore
    private User owner;

    @NotBlank(message = "Task title cannot be empty.")
    @Column(nullable = false)
    private String title;

    @Size(max = 500, message = "Description cannot exceed 500 characters.")
    @Column(length = 500)
    private String description;

    @NotBlank(message = "Status cannot be empty.")
    @Column(nullable = false)
    private String status;

    @NotBlank(message = "Priority cannot be empty.")
    @Column(nullable = false)
    private String priority;

    private LocalDate dueDate;

    public Task() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    /** Safe, serialized substitute for the owner relation (used by the frontend/admin panel). */
    public Long getOwnerId() { return owner != null ? owner.getId() : null; }

    /** Safe, serialized substitute for the owner relation (used by the frontend/admin panel). */
    public String getOwnerUsername() { return owner != null ? owner.getUsername() : null; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
}