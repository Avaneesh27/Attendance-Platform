package com.attendify.backend.dto;

import lombok.Data;

public class AuthDto {

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String mobile;
        private Long institute_id; // For manager registration
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String role;
        private String name;
        private Long id;

        public AuthResponse(String token, String role, String name, Long id) {
            this.token = token;
            this.role = role;
            this.name = name;
            this.id = id;
        }
    }
}
