package com.attendify.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class AttendanceDto {
    private Long id;
    private Long batch_id;
    private Long subject_id;
    private LocalDate attendance_date;
    private List<AttendanceDetailDto> attendance_details;

    @Data
    public static class AttendanceDetailDto {
        private Long student_id;
        private String status;
    }
}
