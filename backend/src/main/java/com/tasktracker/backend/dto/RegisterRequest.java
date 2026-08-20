package com.tasktracker.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Kullanıcı adı zorunludur.")
    @Size(min = 3, max = 50, message = "Kullanıcı adı 3-50 karakter olmalıdır.")
    private String username;

    @NotBlank(message = "E-posta zorunludur.")
    @Email(message = "Geçerli bir e-posta adresi giriniz.")
    private String email;

    /**
     * RSA ile şifrelenmiş (base64) şifre. Gerçek uzunluk kontrolü AuthController'da,
     * şifre çözüldükten sonra yapılır.
     */
    @NotBlank(message = "Şifre zorunludur.")
    private String password;

    public RegisterRequest() {
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}