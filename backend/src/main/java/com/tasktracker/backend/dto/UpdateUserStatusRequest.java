package com.tasktracker.backend.dto;

import jakarta.validation.constraints.NotNull;

public class UpdateUserStatusRequest {

    @NotNull(message = "active alanı zorunludur.")
    private Boolean active;

    public UpdateUserStatusRequest() {
    }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}