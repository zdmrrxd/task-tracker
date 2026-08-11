package com.tasktracker.backend.config;

import com.tasktracker.backend.model.Role;
import com.tasktracker.backend.model.User;
import com.tasktracker.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Ensures a default ADMIN account exists on startup so the admin panel is reachable
 * on a fresh database, without ever storing a plain-text password.
 * Credentials are configurable via environment variables / application.properties
 * and should be changed after first login in any real deployment.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin-username:admin}")
    private String adminUsername;

    @Value("${app.seed.admin-email:admin@tasktracker.local}")
    private String adminEmail;

    @Value("${app.seed.admin-password:Admin123!}")
    private String adminPassword;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByUsername(adminUsername)) {
            return;
        }

        User admin = new User(
                adminUsername,
                adminEmail,
                passwordEncoder.encode(adminPassword),
                Role.ADMIN
        );
        userRepository.save(admin);

        log.info("Seeded default ADMIN account -> username: '{}'. Please change the password after first login.", adminUsername);
    }
}