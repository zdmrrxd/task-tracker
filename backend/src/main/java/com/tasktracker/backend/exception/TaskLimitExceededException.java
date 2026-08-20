package com.tasktracker.backend.exception;

public class TaskLimitExceededException extends RuntimeException {
    public TaskLimitExceededException(String message) {
        super(message);
    }
}