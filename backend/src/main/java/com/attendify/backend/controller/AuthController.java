package com.attendify.backend.controller;

import com.attendify.backend.dto.AuthDto;
import com.attendify.backend.entity.User;
import com.attendify.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/institute/register")
    public ResponseEntity<?> registerInstitute(@RequestBody AuthDto.RegisterRequest request) {
        return ResponseEntity.ok(userService.registerInstitute(request));
    }

    @PostMapping("/institute/login")
    public ResponseEntity<?> loginInstitute(@RequestBody AuthDto.LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @PostMapping("/manager/register")
    public ResponseEntity<?> registerManager(@RequestBody AuthDto.RegisterRequest request) {
        return ResponseEntity.ok(userService.registerManager(request));
    }

    @PostMapping("/manager/login")
    public ResponseEntity<?> loginManager(@RequestBody AuthDto.LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping("/auth/verify")
    public ResponseEntity<?> verifyToken() {
        Map<String, Boolean> response = new HashMap<>();
        response.put("valid", true);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/auth/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserProfile(auth.getName());
        return ResponseEntity.ok(user);
    }
}
