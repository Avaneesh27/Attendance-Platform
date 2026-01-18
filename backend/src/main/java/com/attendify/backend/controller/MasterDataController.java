package com.attendify.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MasterDataController {

    @GetMapping("/class-levels")
    public ResponseEntity<List<String>> getClassLevels() {
        return ResponseEntity.ok(Arrays.asList("Class 9", "Class 10", "Class 11", "Class 12", "Repeater"));
    }

    @GetMapping("/boards")
    public ResponseEntity<List<String>> getBoards() {
        return ResponseEntity.ok(Arrays.asList("CBSE", "ICSE", "State Board"));
    }

    @GetMapping("/streams")
    public ResponseEntity<List<String>> getStreams() {
        return ResponseEntity.ok(Arrays.asList("Science", "Commerce", "Arts"));
    }
}
