package com.attendify.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String rollNo;
    private String mobile;
    private String email;
    private String address;
    private LocalDate dob;
    private String gender;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String stream;

    @ManyToOne
    @JoinColumn(name = "institute_id")
    private User institute;

    @ManyToMany
    @JoinTable(name = "student_batches", joinColumns = @JoinColumn(name = "student_id"), inverseJoinColumns = @JoinColumn(name = "batch_id"))
    private Set<Batch> batches = new HashSet<>();

    public enum Status {
        ACTIVE,
        INACTIVE
    }
}
