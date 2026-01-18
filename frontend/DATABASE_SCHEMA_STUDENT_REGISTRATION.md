# Database Schema: Student Registration Module

This document defines the database schema for the student registration module with class levels, boards, streams, and school types.

## Master Tables

### 1. class_levels
Master table storing available class levels (8, 9, 10, 11, 12).

```sql
CREATE TABLE class_levels (
    class_level_id INT PRIMARY KEY AUTO_INCREMENT,
    level INT NOT NULL UNIQUE,  -- 8, 9, 10, 11, 12
    name VARCHAR(50) NOT NULL,  -- e.g., "Class 8", "Class 9"
    description TEXT,
    requires_stream BOOLEAN DEFAULT FALSE,  -- TRUE for 11-12, FALSE for 8-10
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial data
INSERT INTO class_levels (level, name, requires_stream) VALUES
(8, 'Class 8', FALSE),
(9, 'Class 9', FALSE),
(10, 'Class 10', FALSE),
(11, 'Class 11', TRUE),
(12, 'Class 12', TRUE);
```

### 2. boards
Master table storing education boards (CBSE, STATE, etc.).

```sql
CREATE TABLE boards (
    board_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,  -- e.g., "CBSE", "STATE"
    name VARCHAR(100) NOT NULL,  -- e.g., "Central Board of Secondary Education"
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial data
INSERT INTO boards (code, name) VALUES
('CBSE', 'Central Board of Secondary Education'),
('STATE', 'State Board'),
('ICSE', 'Indian Certificate of Secondary Education'),
('IB', 'International Baccalaureate');
```

### 3. streams
Master table storing streams (NEET, JEE, etc.).

```sql
CREATE TABLE streams (
    stream_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,  -- e.g., "NEET", "JEE"
    name VARCHAR(100) NOT NULL,  -- e.g., "NEET (Medical)"
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial data
INSERT INTO streams (code, name) VALUES
('NEET', 'NEET (Medical)'),
('JEE', 'JEE (Engineering)'),
('FOUNDATION', 'Foundation Course'),
('COMMERCE', 'Commerce'),
('ARTS', 'Arts');
```

### 4. school_types
Master table storing school types.

```sql
CREATE TABLE school_types (
    school_type_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,  -- e.g., "PUBLIC", "PRIVATE"
    name VARCHAR(100) NOT NULL,  -- e.g., "Public School"
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial data
INSERT INTO school_types (code, name) VALUES
('PUBLIC', 'Public School'),
('PRIVATE', 'Private School'),
('GOVT', 'Government School'),
('COACHING', 'Coaching Institute');
```

## Updated Student Table

### 5. student (Updated Schema)
The student table should be updated to include references to the master tables.

```sql
-- Add new columns to existing student table (if table already exists)
ALTER TABLE student 
ADD COLUMN class_level_id INT,
ADD COLUMN board_id INT NOT NULL,
ADD COLUMN stream_id INT NULL,
ADD COLUMN school_type_id INT NOT NULL;

-- Add foreign key constraints
ALTER TABLE student
ADD CONSTRAINT fk_student_class_level 
    FOREIGN KEY (class_level_id) REFERENCES class_levels(class_level_id) ON DELETE SET NULL,
ADD CONSTRAINT fk_student_board 
    FOREIGN KEY (board_id) REFERENCES boards(board_id) ON DELETE RESTRICT,
ADD CONSTRAINT fk_student_stream 
    FOREIGN KEY (stream_id) REFERENCES streams(stream_id) ON DELETE SET NULL,
ADD CONSTRAINT fk_student_school_type 
    FOREIGN KEY (school_type_id) REFERENCES school_types(school_type_id) ON DELETE RESTRICT;

-- Add check constraint for stream_id based on class level
-- Note: This validation is typically done at application level for complex rules
-- Database-level check constraints can be added if your DBMS supports it
```

### Complete Student Table Schema (Reference)

```sql
CREATE TABLE student (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    roll_no VARCHAR(50) UNIQUE,
    mobile VARCHAR(15) NOT NULL,
    alt_mobile VARCHAR(15),
    dob DATE,
    password VARCHAR(255),  -- Hashed password for student login
    batch_id INT,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    
    -- New fields for registration module
    class_level_id INT,
    board_id INT NOT NULL,
    stream_id INT NULL,  -- NULL for classes 8-10, required for 11-12
    school_type_id INT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (class_level_id) REFERENCES class_levels(class_level_id) ON DELETE SET NULL,
    FOREIGN KEY (board_id) REFERENCES boards(board_id) ON DELETE RESTRICT,
    FOREIGN KEY (stream_id) REFERENCES streams(stream_id) ON DELETE SET NULL,
    FOREIGN KEY (school_type_id) REFERENCES school_types(school_type_id) ON DELETE RESTRICT,
    FOREIGN KEY (batch_id) REFERENCES batch(batch_id) ON DELETE SET NULL
);
```

## Business Rules (Validation Rules)

### Database Constraints:
1. **board_id**: `NOT NULL` - Mandatory for all students
2. **school_type_id**: `NOT NULL` - Mandatory for all students
3. **stream_id**: `NULL` - Can be NULL, but application-level validation requires:
   - `NULL` for class levels 8, 9, 10
   - `NOT NULL` (required) for class levels 11, 12

### Application-Level Validation:
1. If `class_level_id` corresponds to level 8, 9, or 10:
   - `stream_id` must be `NULL`
   - `board_id` must be selected
   - `school_type_id` must be selected

2. If `class_level_id` corresponds to level 11 or 12:
   - `stream_id` must be selected (NOT NULL)
   - `board_id` must be selected
   - `school_type_id` must be selected

## API Endpoints Required

### Master Data Endpoints:
- `GET /api/class-levels` - Get all class levels
- `GET /api/boards` - Get all active boards
- `GET /api/streams` - Get all active streams
- `GET /api/school-types` - Get all active school types

### Student Registration Endpoint:
- `POST /api/students` - Create student (with validation)
  ```json
  {
    "name": "John Doe",
    "roll_no": "R001",
    "mobile": "1234567890",
    "alt_mobile": "0987654321",
    "dob": "2010-01-15",
    "password": "hashed_password",
    "batch_id": 1,
    "class_level_id": 11,
    "board_id": 1,
    "stream_id": 1,  // Required for class 11-12
    "school_type_id": 1
  }
  ```

## Notes

1. **stream_id NULL for 8-10**: The database allows `stream_id` to be `NULL`, but application logic must ensure it's `NULL` for classes 8-10 and required for 11-12.

2. **Board Mandatory**: `board_id` has a `NOT NULL` constraint, making it mandatory at the database level.

3. **School Type Mandatory**: `school_type_id` has a `NOT NULL` constraint, making it mandatory at the database level.

4. **Data Integrity**: Foreign keys ensure referential integrity. Use `ON DELETE RESTRICT` for boards and school types to prevent deletion of referenced data.

5. **Indexes**: Consider adding indexes on foreign key columns for better query performance:
   ```sql
   CREATE INDEX idx_student_class_level ON student(class_level_id);
   CREATE INDEX idx_student_board ON student(board_id);
   CREATE INDEX idx_student_stream ON student(stream_id);
   CREATE INDEX idx_student_school_type ON student(school_type_id);
   ```
