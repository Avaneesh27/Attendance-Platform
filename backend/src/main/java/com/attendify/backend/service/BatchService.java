package com.attendify.backend.service;

import com.attendify.backend.entity.Batch;
import com.attendify.backend.entity.Subject;
import com.attendify.backend.entity.User;
import com.attendify.backend.repository.BatchRepository;
import com.attendify.backend.repository.SubjectRepository;
import com.attendify.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class BatchService {

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    private User getCurrentInstitute() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        if (user.getRole() == User.Role.INSTITUTE) {
            return user;
        } else {
            return user.getInstitute();
        }
    }

    public List<Batch> getAllBatches() {
        return batchRepository.findByInstituteId(getCurrentInstitute().getId());
    }

    public Batch getBatchById(Long id) {
        return batchRepository.findById(id).orElseThrow(() -> new RuntimeException("Batch not found"));
    }

    public Batch createBatch(Batch batch) {
        batch.setInstitute(getCurrentInstitute());
        return batchRepository.save(batch);
    }

    public void deleteBatch(Long id) {
        batchRepository.deleteById(id);
    }

    public Batch updateBatch(Long id, Batch batchDetails) {
        Batch batch = getBatchById(id);
        batch.setName(batchDetails.getName());
        batch.setDescription(batchDetails.getDescription());
        // Simple property updates
        return batchRepository.save(batch);
    }

    public Batch addSubjectToBatch(Long batchId, Long subjectId) {
        Batch batch = getBatchById(batchId);
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        batch.getSubjects().add(subject);
        return batchRepository.save(batch);
    }

    public Batch removeSubjectFromBatch(Long batchId, Long subjectId) {
        Batch batch = getBatchById(batchId);
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        batch.getSubjects().remove(subject);
        return batchRepository.save(batch);
    }

    public Set<Subject> getSubjectsByBatch(Long batchId) {
        return getBatchById(batchId).getSubjects();
    }
}
