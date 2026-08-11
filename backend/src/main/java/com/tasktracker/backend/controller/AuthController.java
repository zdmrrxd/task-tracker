package com.tasktracker.backend.controller;

import com.tasktracker.backend.dto.AuthResponse;
import com.tasktracker.backend.dto.LoginRequest;
import com.tasktracker.backend.dto.RegisterRequest;
import com.tasktracker.backend.dto.UserSummary;
import com.tasktracker.backend.model.Role;
import com.tasktracker.backend.model.User;
import com.tasktracker.backend.repository.UserRepository;
import com.tasktracker.backend.security.JwtUtil;
import com.tasktracker.backend.exception.AccountDisabledException;
import com.tasktracker.backend.exception.DuplicateResourceException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Login with username OR email, plus password. Returns a JWT + basic user info.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsernameOrEmail(),
                            request.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();
            String token = jwtUtil.generateToken(user);

            return ResponseEntity.ok(new AuthResponse(token, user));
        } catch (DisabledException ex) {
            throw new AccountDisabledException("Hesabınız pasif duruma alınmış. Lütfen sistem yöneticinizle iletişime geçin.");
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Kullanıcı adı/e-posta veya şifre hatalı.");
        }
    }

    /**
     * Public self-registration. New accounts always get the USER role -
     * ADMIN accounts are provisioned separately (see DataSeeder / another ADMIN).
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Bu kullanıcı adı zaten kullanılıyor.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Bu e-posta adresi zaten kayıtlı.");
        }

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                Role.USER
        );
        userRepository.save(user);

        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    /**
     * Stateless JWT logout: there is no server-side session to invalidate, so this
     * simply confirms the request was authenticated. The frontend discards the token.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserSummary> me(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(new UserSummary(currentUser));
    }
}