package com.attendify.backend.controller;

import com.attendify.backend.dto.AttendanceDto;
import com.attendify.backend.entity.Attendance;
import com.attendify.backend.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<Attendance> markAttendance(@RequestBody AttendanceDto request) {
        return ResponseEntity.ok(attendanceService.markAttendance(request));
    }

    @GetMapping
    public ResponseEntity<List<Attendance>> getAttendanceByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long batch_id,
            @RequestParam(required = false) Long subject_id) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date, batch_id, subject_id));
    }

    @GetMapping("/stats/overall")
    public ResponseEntity<?> getOverallStats() {
        return ResponseEntity.ok(attendanceService.getOverallStats());
    }
}
