package com.attendify.backend.controller;

import com.attendify.backend.entity.Batch;
import com.attendify.backend.entity.Subject;
import com.attendify.backend.service.BatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/batches")
@CrossOrigin(origins = "*")
public class BatchController {

    @Autowired
    private BatchService batchService;

    @GetMapping
    public ResponseEntity<List<Batch>> getAllBatches() {
        return ResponseEntity.ok(batchService.getAllBatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Batch> getBatchById(@PathVariable Long id) {
        return ResponseEntity.ok(batchService.getBatchById(id));
    }

    @PostMapping
    public ResponseEntity<Batch> createBatch(@RequestBody Batch batch) {
        return ResponseEntity.ok(batchService.createBatch(batch));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Batch> updateBatch(@PathVariable Long id, @RequestBody Batch batch) {
        return ResponseEntity.ok(batchService.updateBatch(id, batch));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBatch(@PathVariable Long id) {
        batchService.deleteBatch(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/subjects")
    public ResponseEntity<Set<Subject>> getSubjectsByBatch(@PathVariable Long id) {
        return ResponseEntity.ok(batchService.getSubjectsByBatch(id));
    }

    @PostMapping("/{id}/subjects")
    public ResponseEntity<Batch> addSubjectToBatch(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
        return ResponseEntity.ok(batchService.addSubjectToBatch(id, payload.get("subject_id")));
    }

    @DeleteMapping("/{id}/subjects/{subjectId}")
    public ResponseEntity<Batch> removeSubjectFromBatch(@PathVariable Long id, @PathVariable Long subjectId) {
        return ResponseEntity.ok(batchService.removeSubjectFromBatch(id, subjectId));
    }
}
