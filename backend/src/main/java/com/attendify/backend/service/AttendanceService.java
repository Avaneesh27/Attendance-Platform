package com.attendify.backend.service;

import com.attendify.backend.dto.AttendanceDto;
import com.attendify.backend.entity.*;
import com.attendify.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentInstitute() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        if (user.getRole() == User.Role.INSTITUTE) {
            return user;
        } else {
            return user.getInstitute();
        }
    }

    @Transactional
    public Attendance markAttendance(AttendanceDto request) {
        Attendance attendance = new Attendance();
        attendance.setDate(request.getAttendance_date());

        Batch batch = batchRepository.findById(request.getBatch_id())
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        attendance.setBatch(batch);

        if (request.getSubject_id() != null) {
            Subject subject = subjectRepository.findById(request.getSubject_id())
                    .orElseThrow(() -> new RuntimeException("Subject not found"));
            attendance.setSubject(subject);
        }

        attendance.setInstitute(getCurrentInstitute());

        List<AttendanceDetail> details = new ArrayList<>();
        for (AttendanceDto.AttendanceDetailDto reqDetail : request.getAttendance_details()) {
            AttendanceDetail detail = new AttendanceDetail();
            detail.setAttendance(attendance);

            Student student = studentRepository.findById(reqDetail.getStudent_id())
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            detail.setStudent(student);

            detail.setStatus(AttendanceDetail.AttendanceStatus.valueOf(reqDetail.getStatus()));
            details.add(detail);
        }
        attendance.setAttendanceDetails(details);

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAttendanceByDate(LocalDate date, Long batchId, Long subjectId) {
        // Can be optimized with JPA Specification, simple filtering for now
        List<Attendance> attendances = attendanceRepository.findByInstituteIdAndDate(getCurrentInstitute().getId(),
                date);

        if (batchId != null) {
            attendances = attendances.stream()
                    .filter(a -> a.getBatch().getId().equals(batchId))
                    .collect(Collectors.toList());
        }

        if (subjectId != null) {
            attendances = attendances.stream()
                    .filter(a -> a.getSubject() != null && a.getSubject().getId().equals(subjectId))
                    .collect(Collectors.toList());
        }

        return attendances;
    }

    // Simple stats implementation
    public Map<String, Object> getOverallStats() {
        // This would usually be a complex aggregation query
        long totalStudents = studentRepository.findByInstituteId(getCurrentInstitute().getId()).size();
        long totalBatches = batchRepository.findByInstituteId(getCurrentInstitute().getId()).size();

        return Map.of(
                "totalStudents", totalStudents,
                "totalBatches", totalBatches,
                "attendanceRate", 85 // Mocked for now, needs complex logic
        );
    }
}
