package com.tasktracker.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Kullanıcı adı veya e-posta zorunludur.")
    private String usernameOrEmail;

    @NotBlank(message = "Şifre zorunludur.")
    private String password;

    public LoginRequest() {
    }

    public String getUsernameOrEmail() { return usernameOrEmail; }
    public void setUsernameOrEmail(String usernameOrEmail) { this.usernameOrEmail = usernameOrEmail; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}