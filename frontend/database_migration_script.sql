-- ============================================================================
-- Migration Script: Add Registration Module Changes to Existing Database
-- ============================================================================
-- This script safely adds new columns and constraints to existing tables
-- Run this script if you already have a student table and need to add
-- the new registration module fields
-- ============================================================================

-- Step 1: Create master tables (if they don't exist)
-- ============================================================================

CREATE TABLE IF NOT EXISTS class_levels (
    class_level_id INT PRIMARY KEY AUTO_INCREMENT,
    level INT NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    requires_stream BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS boards (
    board_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS streams (
    stream_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 2: Insert master data (only if not exists)
-- ============================================================================

INSERT IGNORE INTO class_levels (level, name, requires_stream) VALUES
(8, 'Class 8', FALSE),
(9, 'Class 9', FALSE),
(10, 'Class 10', FALSE),
(11, 'Class 11', TRUE),
(12, 'Class 12', TRUE);

INSERT IGNORE INTO boards (code, name) VALUES
('CBSE', 'Central Board of Secondary Education'),
('STATE', 'State Board'),
('ICSE', 'Indian Certificate of Secondary Education'),
('IB', 'International Baccalaureate');

INSERT IGNORE INTO streams (code, name) VALUES
('NEET', 'NEET (Medical)'),
('JEE', 'JEE (Engineering)'),
('FOUNDATION', 'Foundation Course'),
('COMMERCE', 'Commerce'),
('ARTS', 'Arts');

-- Step 3: Check and add columns to student table
-- ============================================================================
-- Note: For MySQL, you need to check column existence before adding
-- This script provides the ALTER statements - run them conditionally

-- Add class_level_id column
SET @dbname = DATABASE();
SET @tablename = 'student';
SET @columnname = 'class_level_id';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT COMMENT ''Foreign key to class_levels''')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add board_id column (NOT NULL, but allow NULL initially, then update with default, then set NOT NULL)
SET @columnname = 'board_id';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT NULL COMMENT ''Foreign key to boards (mandatory)''')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Update existing records with default board_id (use the first board if available)
-- Get the first board_id
SET @default_board_id = (SELECT MIN(board_id) FROM boards WHERE is_active = TRUE LIMIT 1);

-- If no active board exists, create one
SET @default_board_id = IFNULL(@default_board_id, 1);

-- Update NULL board_id values
UPDATE student SET board_id = @default_board_id WHERE board_id IS NULL;

-- Now set board_id to NOT NULL
SET @preparedStatement = CONCAT('ALTER TABLE ', @tablename, ' MODIFY COLUMN board_id INT NOT NULL');
PREPARE alterColumn FROM @preparedStatement;
EXECUTE alterColumn;
DEALLOCATE PREPARE alterColumn;

-- Add stream_id column
SET @columnname = 'stream_id';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT NULL COMMENT ''Foreign key to streams (NULL for 8-10, required for 11-12)''')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Step 4: Add foreign key constraints (drop existing ones first if they exist)
-- ============================================================================

-- Drop existing foreign keys if they exist (adjust names as needed)
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (CONSTRAINT_NAME = 'fk_student_class_level')
  ) > 0,
  CONCAT('ALTER TABLE ', @tablename, ' DROP FOREIGN KEY fk_student_class_level'),
  'SELECT 1'
));
PREPARE dropFK FROM @preparedStatement;
EXECUTE dropFK;
DEALLOCATE PREPARE dropFK;

SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (CONSTRAINT_NAME = 'fk_student_board')
  ) > 0,
  CONCAT('ALTER TABLE ', @tablename, ' DROP FOREIGN KEY fk_student_board'),
  'SELECT 1'
));
PREPARE dropFK FROM @preparedStatement;
EXECUTE dropFK;
DEALLOCATE PREPARE dropFK;

SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (CONSTRAINT_NAME = 'fk_student_stream')
  ) > 0,
  CONCAT('ALTER TABLE ', @tablename, ' DROP FOREIGN KEY fk_student_stream'),
  'SELECT 1'
));
PREPARE dropFK FROM @preparedStatement;
EXECUTE dropFK;
DEALLOCATE PREPARE dropFK;

-- Add foreign key constraints
ALTER TABLE student
ADD CONSTRAINT fk_student_class_level 
    FOREIGN KEY (class_level_id) 
    REFERENCES class_levels(class_level_id) 
    ON DELETE SET NULL
    ON UPDATE CASCADE;

ALTER TABLE student
ADD CONSTRAINT fk_student_board 
    FOREIGN KEY (board_id) 
    REFERENCES boards(board_id) 
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

ALTER TABLE student
ADD CONSTRAINT fk_student_stream 
    FOREIGN KEY (stream_id) 
    REFERENCES streams(stream_id) 
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- Step 5: Add indexes for better performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_student_class_level ON student(class_level_id);
CREATE INDEX IF NOT EXISTS idx_student_board ON student(board_id);
CREATE INDEX IF NOT EXISTS idx_student_stream ON student(stream_id);

-- Step 6: Verification
-- ============================================================================

-- Verify the changes
SELECT 'Migration completed successfully!' AS status;

-- Show new columns in student table
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM 
    INFORMATION_SCHEMA.COLUMNS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'student'
    AND COLUMN_NAME IN ('class_level_id', 'board_id', 'stream_id')
ORDER BY 
    ORDINAL_POSITION;

-- Show foreign key constraints
SELECT 
    CONSTRAINT_NAME, 
    COLUMN_NAME, 
    REFERENCED_TABLE_NAME, 
    REFERENCED_COLUMN_NAME 
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'student' 
    AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY 
    CONSTRAINT_NAME;
