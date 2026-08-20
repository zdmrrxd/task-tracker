package com.tasktracker.backend.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        return ResponseEntity.badRequest().body(errors);
    }

    /**
     * Wrong username/email or password on /api/auth/login.
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", ex.getMessage()));
    }

    /**
     * Login attempt for a deactivated (passive) account.
     */
    @ExceptionHandler(AccountDisabledException.class)
    public ResponseEntity<Map<String, String>> handleAccountDisabled(AccountDisabledException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", ex.getMessage()));
    }

    /**
     * Register attempt with a username/email that already exists.
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateResource(DuplicateResourceException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }

    /**
     * A USER trying to read/edit/delete a task that isn't theirs.
     */
    @ExceptionHandler(AccessForbiddenException.class)
    public ResponseEntity<Map<String, String>> handleAccessForbidden(AccessForbiddenException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", ex.getMessage()));
    }

    /**
     * Spring Security's own access-denied (e.g. @PreAuthorize failures) that reach the
     * dispatcher outside of the AccessDeniedHandler chain.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleSpringAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Bu işlemi gerçekleştirmek için yetkiniz yok."));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    /**
     * Kullanıcıya gösterilmesi güvenli olan, öngörülen istek hataları
     * (şifre çözme hatası, manuel doğrulama hataları vb.)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }

    /**
     * Bir kullanıcının izin verilen maksimum görev sayısını aşmaya çalışması.
     */
    @ExceptionHandler(TaskLimitExceededException.class)
    public ResponseEntity<Map<String, String>> handleTaskLimitExceeded(TaskLimitExceededException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", ex.getMessage()));
    }

    /**
     * Beklenmeyen tüm hatalar: istemciye asla iç sistem detayı (stack trace, SQL
     * mesajı, sınıf adı vb.) döndürülmez - sadece sunucu loglarına yazılır.
     * Aksi bir bilgi ifşası (information disclosure) güvenlik açığı olurdu.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception ex) {
        log.error("Beklenmeyen hata", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."));
    }
}