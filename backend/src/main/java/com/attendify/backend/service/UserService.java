package com.attendify.backend.service;

import com.attendify.backend.dto.AuthDto;
import com.attendify.backend.entity.User;
import com.attendify.backend.repository.UserRepository;
import com.attendify.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthDto.AuthResponse registerInstitute(AuthDto.RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setRole(User.Role.INSTITUTE);
        // user.setMobile(request.getMobile());

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser);

        return new AuthDto.AuthResponse(token, savedUser.getRole().name(), savedUser.getName(), savedUser.getId());
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user);
        return new AuthDto.AuthResponse(token, user.getRole().name(), user.getName(), user.getId());
    }

    public AuthDto.AuthResponse registerManager(AuthDto.RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User institute = userRepository.findById(request.getInstitute_id())
                .orElseThrow(() -> new RuntimeException("Institute not found"));

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setMobile(request.getMobile());
        user.setRole(User.Role.MANAGER);
        user.setInstitute(institute);

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser);

        return new AuthDto.AuthResponse(token, savedUser.getRole().name(), savedUser.getName(), savedUser.getId());
    }

    public User getUserProfile(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }
    public java.util.List<User> getAllInstitutes() {
        return userRepository.findByRole(User.Role.INSTITUTE);
    }

    public User updateInstitute(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Institute not found"));
        
        if (userDetails.getName() != null) user.setName(userDetails.getName());
        if (userDetails.getEmail() != null) user.setEmail(userDetails.getEmail());
        if (userDetails.getMobile() != null) user.setMobile(userDetails.getMobile());
        // Add other fields as necessary

        return userRepository.save(user);
    }

    public void deleteInstitute(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Institute not found"));
        userRepository.delete(user);
    }
}
