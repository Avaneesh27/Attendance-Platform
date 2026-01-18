-- ============================================================================
-- Complete Database Schema for Student Registration Module
-- ============================================================================
-- This file contains all tables with changes for the registration module
-- including master tables and updated student table
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. MASTER TABLES
-- ----------------------------------------------------------------------------

-- Table: class_levels
-- Purpose: Master table for class levels (8, 9, 10, 11, 12)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS class_levels (
    class_level_id INT PRIMARY KEY AUTO_INCREMENT,
    level INT NOT NULL UNIQUE COMMENT 'Class level number: 8, 9, 10, 11, or 12',
    name VARCHAR(50) NOT NULL COMMENT 'Display name like "Class 8", "Class 9"',
    description TEXT COMMENT 'Optional description',
    requires_stream BOOLEAN DEFAULT FALSE COMMENT 'TRUE for classes 11-12, FALSE for 8-10',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_level (level),
    INDEX idx_requires_stream (requires_stream)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial class level data
INSERT INTO class_levels (level, name, requires_stream) VALUES
(8, 'Class 8', FALSE),
(9, 'Class 9', FALSE),
(10, 'Class 10', FALSE),
(11, 'Class 11', TRUE),
(12, 'Class 12', TRUE)
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    requires_stream = VALUES(requires_stream);

-- ----------------------------------------------------------------------------
-- Table: boards
-- Purpose: Master table for education boards (CBSE, STATE, etc.)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS boards (
    board_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE COMMENT 'Unique code like "CBSE", "STATE"',
    name VARCHAR(100) NOT NULL COMMENT 'Full board name',
    description TEXT COMMENT 'Optional description',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Active status flag',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial board data
INSERT INTO boards (code, name) VALUES
('CBSE', 'Central Board of Secondary Education'),
('STATE', 'State Board'),
('ICSE', 'Indian Certificate of Secondary Education'),
('IB', 'International Baccalaureate')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name);

-- ----------------------------------------------------------------------------
-- Table: streams
-- Purpose: Master table for streams (NEET, JEE, etc.)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS streams (
    stream_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE COMMENT 'Unique code like "NEET", "JEE"',
    name VARCHAR(100) NOT NULL COMMENT 'Full stream name',
    description TEXT COMMENT 'Optional description',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Active status flag',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial stream data
INSERT INTO streams (code, name) VALUES
('NEET', 'NEET (Medical)'),
('JEE', 'JEE (Engineering)'),
('FOUNDATION', 'Foundation Course'),
('COMMERCE', 'Commerce'),
('ARTS', 'Arts')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name);

-- ----------------------------------------------------------------------------
-- 2. EXISTING TABLES (Reference - do not modify if already exists)
-- ----------------------------------------------------------------------------

-- Note: The following tables should already exist in your system.
-- Only ALTER statements are provided to add new columns.

-- ----------------------------------------------------------------------------
-- Table: student (UPDATED with new columns)
-- Purpose: Student information with references to master tables
-- ----------------------------------------------------------------------------

-- Check if student table exists, if not create it
-- If table already exists, use ALTER statements below

-- Add new columns if they don't exist (for existing student table)
-- Run these ALTER statements only if the columns don't already exist

ALTER TABLE student 
ADD COLUMN IF NOT EXISTS class_level_id INT COMMENT 'Foreign key to class_levels',
ADD COLUMN IF NOT EXISTS board_id INT NOT NULL COMMENT 'Foreign key to boards (mandatory)',
ADD COLUMN IF NOT EXISTS stream_id INT NULL COMMENT 'Foreign key to streams (NULL for 8-10, required for 11-12)';

-- Note: MySQL doesn't support "IF NOT EXISTS" in ALTER TABLE ADD COLUMN
-- For MySQL, use this approach instead (run manually or check first):
/*
-- For MySQL, check and add columns separately:
-- Check if class_level_id exists, if not:
ALTER TABLE student ADD COLUMN class_level_id INT COMMENT 'Foreign key to class_levels';

-- Check if board_id exists, if not:
ALTER TABLE student ADD COLUMN board_id INT NOT NULL COMMENT 'Foreign key to boards (mandatory)';

-- Check if stream_id exists, if not:
ALTER TABLE student ADD COLUMN stream_id INT NULL COMMENT 'Foreign key to streams (NULL for 8-10, required for 11-12)';
*/

-- Add foreign key constraints (if not already added)
-- Note: Remove existing constraints with same name if they exist

-- Drop existing foreign keys if they exist (adjust constraint names as needed)
-- ALTER TABLE student DROP FOREIGN KEY IF EXISTS fk_student_class_level;
-- ALTER TABLE student DROP FOREIGN KEY IF EXISTS fk_student_board;
-- ALTER TABLE student DROP FOREIGN KEY IF EXISTS fk_student_stream;

-- Add foreign key constraint for class_level_id
ALTER TABLE student
ADD CONSTRAINT fk_student_class_level 
    FOREIGN KEY (class_level_id) 
    REFERENCES class_levels(class_level_id) 
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- Add foreign key constraint for board_id
ALTER TABLE student
ADD CONSTRAINT fk_student_board 
    FOREIGN KEY (board_id) 
    REFERENCES boards(board_id) 
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

-- Add foreign key constraint for stream_id
ALTER TABLE student
ADD CONSTRAINT fk_student_stream 
    FOREIGN KEY (stream_id) 
    REFERENCES streams(stream_id) 
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_student_class_level ON student(class_level_id);
CREATE INDEX IF NOT EXISTS idx_student_board ON student(board_id);
CREATE INDEX IF NOT EXISTS idx_student_stream ON student(stream_id);

-- ----------------------------------------------------------------------------
-- 3. COMPLETE STUDENT TABLE SCHEMA (Reference - if creating from scratch)
-- ----------------------------------------------------------------------------

/*
-- Complete student table schema (use this if creating table from scratch)
CREATE TABLE IF NOT EXISTS student (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    roll_no VARCHAR(50) UNIQUE,
    mobile VARCHAR(15) NOT NULL,
    alt_mobile VARCHAR(15),
    dob DATE,
    password VARCHAR(255) COMMENT 'Hashed password for student login',
    batch_id INT,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    
    -- New fields for registration module
    class_level_id INT COMMENT 'Foreign key to class_levels',
    board_id INT NOT NULL COMMENT 'Foreign key to boards (mandatory)',
    stream_id INT NULL COMMENT 'Foreign key to streams (NULL for 8-10, required for 11-12)',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_student_class_level 
        FOREIGN KEY (class_level_id) 
        REFERENCES class_levels(class_level_id) 
        ON DELETE SET NULL
        ON UPDATE CASCADE,
        
    CONSTRAINT fk_student_board 
        FOREIGN KEY (board_id) 
        REFERENCES boards(board_id) 
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
        
    CONSTRAINT fk_student_stream 
        FOREIGN KEY (stream_id) 
        REFERENCES streams(stream_id) 
        ON DELETE SET NULL
        ON UPDATE CASCADE,
        
    CONSTRAINT fk_student_batch 
        FOREIGN KEY (batch_id) 
        REFERENCES batch(batch_id) 
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_roll_no (roll_no),
    INDEX idx_mobile (mobile),
    INDEX idx_status (status),
    INDEX idx_batch_id (batch_id),
    INDEX idx_class_level_id (class_level_id),
    INDEX idx_board_id (board_id),
    INDEX idx_stream_id (stream_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/

-- ----------------------------------------------------------------------------
-- 4. OTHER EXISTING TABLES (Reference only - should already exist)
-- ----------------------------------------------------------------------------

-- These tables are referenced but assumed to already exist in your system

/*
-- batch table (should already exist)
CREATE TABLE IF NOT EXISTS batch (
    batch_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    timings VARCHAR(100),
    institute_id INT,
    manager_id INT,
    strength INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- institute table (should already exist)
CREATE TABLE IF NOT EXISTS institute (
    institute_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- manager table (should already exist)
CREATE TABLE IF NOT EXISTS manager (
    manager_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    institute_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (institute_id) REFERENCES institute(institute_id)
);

-- subject table (should already exist)
CREATE TABLE IF NOT EXISTS subject (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- batch_subject table (should already exist)
CREATE TABLE IF NOT EXISTS batch_subject (
    batch_id INT,
    subject_id INT,
    PRIMARY KEY (batch_id, subject_id),
    FOREIGN KEY (batch_id) REFERENCES batch(batch_id),
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id)
);

-- attendance table (should already exist)
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    batch_id INT NOT NULL,
    subject_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batch(batch_id),
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id),
    UNIQUE KEY unique_attendance (batch_id, subject_id, attendance_date)
);

-- attendance_details table (should already exist)
CREATE TABLE IF NOT EXISTS attendance_details (
    attendance_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    attendance_id INT NOT NULL,
    student_id INT NOT NULL,
    status ENUM('PRESENT', 'ABSENT') NOT NULL,
    FOREIGN KEY (attendance_id) REFERENCES attendance(attendance_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id)
);
*/

-- ----------------------------------------------------------------------------
-- 5. SUMMARY OF CHANGES
-- ----------------------------------------------------------------------------

/*
CHANGES MADE FOR REGISTRATION MODULE:
=====================================

1. NEW MASTER TABLES CREATED:
   ✓ class_levels - Stores class levels (8, 9, 10, 11, 12)
   ✓ boards - Stores education boards (CBSE, STATE, etc.)
   ✓ streams - Stores streams (NEET, JEE, etc.)

2. STUDENT TABLE UPDATED:
   ✓ Added class_level_id (INT, NULL allowed, FK to class_levels)
   ✓ Added board_id (INT, NOT NULL, FK to boards) - MANDATORY
   ✓ Added stream_id (INT, NULL allowed, FK to streams) - NULL for 8-10, required for 11-12

3. FOREIGN KEY CONSTRAINTS ADDED:
   ✓ fk_student_class_level - Links to class_levels
   ✓ fk_student_board - Links to boards (RESTRICT on delete)
   ✓ fk_student_stream - Links to streams (SET NULL on delete)

4. INDEXES ADDED:
   ✓ idx_student_class_level
   ✓ idx_student_board
   ✓ idx_student_stream

5. VALIDATION RULES:
   ✓ board_id: NOT NULL (mandatory for all students)
   ✓ stream_id: NULL allowed, but application must ensure:
     - NULL for class levels 8, 9, 10
     - NOT NULL (required) for class levels 11, 12

6. SAMPLE DATA INSERTED:
   ✓ 5 class levels (8, 9, 10, 11, 12)
   ✓ 4 boards (CBSE, STATE, ICSE, IB)
   ✓ 5 streams (NEET, JEE, FOUNDATION, COMMERCE, ARTS)
*/

-- ----------------------------------------------------------------------------
-- 6. VERIFICATION QUERIES
-- ----------------------------------------------------------------------------

-- View all class levels
-- SELECT * FROM class_levels ORDER BY level;

-- View all active boards
-- SELECT * FROM boards WHERE is_active = TRUE ORDER BY name;

-- View all active streams
-- SELECT * FROM streams WHERE is_active = TRUE ORDER BY name;

-- View student table structure with new columns
-- DESCRIBE student;

-- View foreign key constraints on student table
-- SELECT 
--     CONSTRAINT_NAME, 
--     COLUMN_NAME, 
--     REFERENCED_TABLE_NAME, 
--     REFERENCED_COLUMN_NAME 
-- FROM 
--     INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
-- WHERE 
--     TABLE_NAME = 'student' 
--     AND TABLE_SCHEMA = DATABASE()
--     AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Example query: Get students with their class level, board, and stream
-- SELECT 
--     s.student_id,
--     s.name,
--     s.roll_no,
--     cl.name AS class_level,
--     b.name AS board,
--     st.name AS stream
-- FROM 
--     student s
--     LEFT JOIN class_levels cl ON s.class_level_id = cl.class_level_id
--     LEFT JOIN boards b ON s.board_id = b.board_id
--     LEFT JOIN streams st ON s.stream_id = st.stream_id
-- ORDER BY 
--     s.student_id;

-- ----------------------------------------------------------------------------
-- END OF SCRIPT
-- ----------------------------------------------------------------------------
