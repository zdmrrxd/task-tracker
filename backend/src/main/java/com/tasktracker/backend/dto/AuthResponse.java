package com.tasktracker.backend.dto;

import com.tasktracker.backend.model.User;

/**
 * Returned after a successful login/register. Never carries the password.
 */
public class AuthResponse {

    private String token;
    private UserSummary user;

    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = new UserSummary(user);
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserSummary getUser() { return user; }
    public void setUser(UserSummary user) { this.user = user; }
}