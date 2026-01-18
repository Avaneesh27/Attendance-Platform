package com.attendify.backend.controller;

import com.attendify.backend.entity.User;
import com.attendify.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/institute")
@CrossOrigin(origins = "*")
public class InstituteController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllInstitutes() {
        return ResponseEntity.ok(userService.getAllInstitutes());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateInstitute(@PathVariable Long id, @RequestBody User userDetails) {
        return ResponseEntity.ok(userService.updateInstitute(id, userDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInstitute(@PathVariable Long id) {
        userService.deleteInstitute(id);
        return ResponseEntity.ok().build();
    }
}
