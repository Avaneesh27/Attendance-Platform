# Database Migration Guide

This document outlines the changes made to align the codebase with the new database schema.

## Database Schema Overview

The application now uses the following database structure:

### Tables:
1. **institute** - Stores institute/coaching center information
2. **manager** - Managers linked to institutes
3. **batch** - Batches/classes with timings and strength
4. **subject** - Subjects available
5. **batch_subject** - Many-to-many relationship between batches and subjects
6. **student** - Students linked to batches
7. **attendance** - Attendance records per date, batch, and subject
8. **attendance_details** - Individual student attendance status

## Key Changes Made

### 1. Authentication (`src/Services/userApi.js`)
- **Added**: `loginInstitute()` - For institute login
- **Added**: `loginManager()` - For manager login
- **Added**: `registerInstitute()` - For institute registration
- **Added**: `registerManager()` - For manager registration
- **Updated**: `logoutUser()` - Now clears all institute/manager related data

### 2. Student API (`src/Services/studentApi.js`)
- **Updated**: Student fields now match database schema:
  - `name` - Student name
  - `roll_no` - Roll number
  - `mobile` - Primary mobile number
  - `alt_mobile` - Alternate mobile number
  - `stream` - Stream (NEET, JEE, FOUNDATION, etc.)
  - `dob` - Date of birth
  - `password` - Student login password
  - `batch_id` - Foreign key to batch table
- **Added**: `getStudentsByBatch(batchId)` - Get students by batch
- **Added**: `getStudentByRollNo(rollNo)` - Get student by roll number

### 3. Batch API (`src/Services/batchApi.js`) - NEW
- `getAllBatches()` - Get all batches
- `getBatchById(id)` - Get batch by ID
- `createBatch(batchData)` - Create new batch
- `updateBatch(id, batchData)` - Update batch
- `deleteBatch(id)` - Delete batch
- `getBatchesByInstitute(instituteId)` - Get batches by institute
- `getBatchesByManager(managerId)` - Get batches by manager

### 4. Subject API (`src/Services/subjectApi.js`) - NEW
- `getAllSubjects()` - Get all subjects
- `getSubjectById(id)` - Get subject by ID
- `createSubject(subjectData)` - Create new subject
- `updateSubject(id, subjectData)` - Update subject
- `deleteSubject(id)` - Delete subject
- `getSubjectsByBatch(batchId)` - Get subjects for a batch
- `addSubjectToBatch(batchId, subjectId)` - Add subject to batch
- `removeSubjectFromBatch(batchId, subjectId)` - Remove subject from batch

### 5. Attendance API (`src/Services/attendApi.js`)
- **Updated**: `markAttendance()` now requires:
  ```javascript
  {
    batch_id: number,
    subject_id: number,
    attendance_date: "YYYY-MM-DD",
    attendance_details: [
      { student_id: number, status: "PRESENT" | "ABSENT" }
    ]
  }
  ```
- **Updated**: `getAttendanceByDate()` now accepts optional `batchId` and `subjectId` parameters

### 6. Student Pages
- **Updated**: `AddStudent.jsx` - Now uses new student fields:
  - Roll number instead of class level
  - Batch selection dropdown
  - Date of birth field
  - Mobile and alternate mobile
  - Stream field
  - Password field for student login

## API Endpoints Expected

### Institute
- `POST /api/institute/login` - Institute login
- `POST /api/institute/register` - Institute registration

### Manager
- `POST /api/manager/login` - Manager login
- `POST /api/manager/register` - Manager registration

### Batches
- `GET /api/batches` - Get all batches
- `GET /api/batches/:id` - Get batch by ID
- `POST /api/batches` - Create batch
- `PUT /api/batches/:id` - Update batch
- `DELETE /api/batches/:id` - Delete batch
- `GET /api/batches/institute/:instituteId` - Get batches by institute
- `GET /api/batches/manager/:managerId` - Get batches by manager
- `GET /api/batches/:batchId/students` - Get students in batch

### Subjects
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id` - Get subject by ID
- `POST /api/subjects` - Create subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject
- `GET /api/batches/:batchId/subjects` - Get subjects for batch
- `POST /api/batches/:batchId/subjects` - Add subject to batch
- `DELETE /api/batches/:batchId/subjects/:subjectId` - Remove subject from batch

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `GET /api/students/roll/:rollNo` - Get student by roll number
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Attendance
- `POST /api/attendance` - Mark attendance
  ```json
  {
    "batch_id": 1,
    "subject_id": 1,
    "attendance_date": "2024-01-15",
    "attendance_details": [
      { "student_id": 1, "status": "PRESENT" },
      { "student_id": 2, "status": "ABSENT" }
    ]
  }
  ```
- `GET /api/attendance?date=2024-01-15&batch_id=1&subject_id=1` - Get attendance

## LocalStorage Keys

The application now uses:
- `token` - Authentication token
- `instituteId` - Institute ID
- `instituteName` - Institute name
- `coachingName` - Institute name (legacy)
- `email` - User email
- `userEmail` - User email (legacy)
- `managerId` - Manager ID (if logged in as manager)

## Migration Notes

1. **Student Data**: Old student records with `classLevel`, `personalMobile`, `fatherName`, etc. need to be migrated to the new schema
2. **Attendance Data**: Old attendance records need to be updated to include `batch_id` and `subject_id`
3. **Authentication**: Update login endpoints to return `institute_id` and `name` instead of just `coachingName`

## Next Steps

1. Update backend API to match these endpoints
2. Migrate existing data to new schema
3. Update remaining pages (Student.jsx, Attendance.jsx, etc.) to use new fields
4. Add batch and subject management pages
5. Update attendance page to require batch and subject selection

