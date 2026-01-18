package com.attendify.backend.repository;

import com.attendify.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByInstituteId(Long instituteId);

    List<Student> findByStream(String stream);

    Optional<Student> findByRollNo(String rollNo);

    List<Student> findByStatus(Student.Status status);
}
