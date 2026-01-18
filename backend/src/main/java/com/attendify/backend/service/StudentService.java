package com.attendify.backend.service;

import com.attendify.backend.entity.Student;
import com.attendify.backend.entity.User;
import com.attendify.backend.repository.StudentRepository;
import com.attendify.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

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
            return user.getInstitute(); // For Manager
        }
    }

    public List<Student> getAllStudents() {
        return studentRepository.findByInstituteId(getCurrentInstitute().getId());
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student addStudent(Student student) {
        student.setInstitute(getCurrentInstitute());
        student.setStatus(Student.Status.ACTIVE);
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student studentDetails) {
        Student student = getStudentById(id);
        student.setName(studentDetails.getName());
        student.setMobile(studentDetails.getMobile());
        student.setEmail(studentDetails.getEmail());
        student.setAddress(studentDetails.getAddress());
        student.setGender(studentDetails.getGender());
        student.setDob(studentDetails.getDob());
        student.setStream(studentDetails.getStream());
        student.setBatches(studentDetails.getBatches()); // If updated

        return studentRepository.save(student);
    }

    // Helper to set batches which might be transient
    private void updateStudentBatches(Student existing, Student updates) {
        // Logic to update batches if needed
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public Student activateStudent(Long id) {
        Student student = getStudentById(id);
        student.setStatus(Student.Status.ACTIVE);
        return studentRepository.save(student);
    }

    public Student deactivateStudent(Long id) {
        Student student = getStudentById(id);
        student.setStatus(Student.Status.INACTIVE);
        return studentRepository.save(student);
    }

    public List<Student> searchStudents(String query) {
        // Basic implementation, ideally use a custom query
        // For now, filtering in memory or strictly by roll no if it matches
        return studentRepository.findByRollNo(query).stream().toList();
    }
}
