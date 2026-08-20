package com.tasktracker.backend.controller;

import com.tasktracker.backend.dto.AuthResponse;
import com.tasktracker.backend.dto.LoginRequest;
import com.tasktracker.backend.dto.RegisterRequest;
import com.tasktracker.backend.dto.UserSummary;
import com.tasktracker.backend.model.Role;
import com.tasktracker.backend.model.User;
import com.tasktracker.backend.repository.UserRepository;
import com.tasktracker.backend.security.JwtUtil;
import com.tasktracker.backend.security.RsaKeyService;
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

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RsaKeyService rsaKeyService;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            RsaKeyService rsaKeyService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.rsaKeyService = rsaKeyService;
    }

    /**
     * Frontend, formu göndermeden önce bu public key ile şifreyi RSA-OAEP kullanarak
     * şifreler. Böylece şifre tarayıcı Network/DevTools ekranında düz metin olarak görünmez.
     */
    @GetMapping("/public-key")
    public ResponseEntity<Map<String, String>> getPublicKey() {
        return ResponseEntity.ok(Map.of("publicKey", rsaKeyService.getPublicKeyBase64()));
    }

    /**
     * Login with username OR email, plus password. Returns a JWT + basic user info.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        String rawPassword = rsaKeyService.decrypt(request.getPassword());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsernameOrEmail(),
                            rawPassword
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

        String rawPassword = rsaKeyService.decrypt(request.getPassword());

        if (rawPassword.length() < 6) {
            throw new IllegalArgumentException("Şifre en az 6 karakter olmalıdır.");
        }

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(rawPassword),
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