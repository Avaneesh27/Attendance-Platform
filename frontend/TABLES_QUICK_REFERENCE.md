# Database Tables - Quick Reference

## All Tables Created/Modified for Registration Module

---

## 📋 Master Tables (NEW)

### 1. class_levels
```sql
CREATE TABLE class_levels (
    class_level_id INT PRIMARY KEY AUTO_INCREMENT,
    level INT NOT NULL UNIQUE,          -- 8, 9, 10, 11, 12
    name VARCHAR(50) NOT NULL,          -- "Class 8", "Class 9", etc.
    requires_stream BOOLEAN DEFAULT FALSE  -- TRUE for 11-12
);
```
**Sample Data:** 5 rows (levels 8-12)

---

### 2. boards
```sql
CREATE TABLE boards (
    board_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,   -- "CBSE", "STATE"
    name VARCHAR(100) NOT NULL,         -- "Central Board..."
    is_active BOOLEAN DEFAULT TRUE
);
```
**Sample Data:** 4 rows (CBSE, STATE, ICSE, IB)

---

### 3. streams
```sql
CREATE TABLE streams (
    stream_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,   -- "NEET", "JEE"
    name VARCHAR(100) NOT NULL,         -- "NEET (Medical)"
    is_active BOOLEAN DEFAULT TRUE
);
```
**Sample Data:** 5 rows (NEET, JEE, FOUNDATION, COMMERCE, ARTS)

---

### 4. school_types
```sql
CREATE TABLE school_types (
    school_type_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,   -- "PUBLIC", "PRIVATE"
    name VARCHAR(100) NOT NULL,         -- "Public School"
    is_active BOOLEAN DEFAULT TRUE
);
```
**Sample Data:** 4 rows (PUBLIC, PRIVATE, GOVT, COACHING)

---

## 🔄 Updated Table

### 5. student (MODIFIED)

#### New Columns Added:
```sql
ALTER TABLE student ADD COLUMN class_level_id INT;        -- FK → class_levels
ALTER TABLE student ADD COLUMN board_id INT NOT NULL;     -- FK → boards [MANDATORY]
ALTER TABLE student ADD COLUMN stream_id INT NULL;        -- FK → streams [NULL for 8-10, REQUIRED for 11-12]
ALTER TABLE student ADD COLUMN school_type_id INT NOT NULL; -- FK → school_types [MANDATORY]
```

#### Complete student Table Structure:
```sql
CREATE TABLE student (
    -- Existing columns
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    roll_no VARCHAR(50) UNIQUE,
    mobile VARCHAR(15) NOT NULL,
    alt_mobile VARCHAR(15),
    dob DATE,
    password VARCHAR(255),
    batch_id INT,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    
    -- NEW COLUMNS (Registration Module)
    class_level_id INT,              -- FK → class_levels.class_level_id
    board_id INT NOT NULL,           -- FK → boards.board_id [MANDATORY]
    stream_id INT NULL,              -- FK → streams.stream_id [NULL for 8-10]
    school_type_id INT NOT NULL,     -- FK → school_types.school_type_id [MANDATORY]
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (class_level_id) REFERENCES class_levels(class_level_id),
    FOREIGN KEY (board_id) REFERENCES boards(board_id),
    FOREIGN KEY (stream_id) REFERENCES streams(stream_id),
    FOREIGN KEY (school_type_id) REFERENCES school_types(school_type_id),
    FOREIGN KEY (batch_id) REFERENCES batch(batch_id)
);
```

---

## 📊 Field Requirements Summary

| Field | Data Type | Required? | For Classes 8-10 | For Classes 11-12 | FK To |
|-------|-----------|-----------|------------------|-------------------|-------|
| `class_level_id` | INT | ✅ Yes | ✅ Yes | ✅ Yes | `class_levels` |
| `board_id` | INT | ✅ Yes | ✅ Yes | ✅ Yes | `boards` |
| `stream_id` | INT | ❌ No / ✅ Yes | ❌ NULL | ✅ Required | `streams` |
| `school_type_id` | INT | ✅ Yes | ✅ Yes | ✅ Yes | `school_types` |

---

## 🔗 Foreign Key Relationships

```
student
  ├── class_level_id → class_levels.class_level_id (SET NULL on delete)
  ├── board_id → boards.board_id (RESTRICT on delete) [MANDATORY]
  ├── stream_id → streams.stream_id (SET NULL on delete) [NULL for 8-10]
  └── school_type_id → school_types.school_type_id (RESTRICT on delete) [MANDATORY]
```

---

## 📝 Complete Table List

### New Tables Created:
1. ✅ `class_levels` - Class levels master (8, 9, 10, 11, 12)
2. ✅ `boards` - Education boards master (CBSE, STATE, etc.)
3. ✅ `streams` - Streams master (NEET, JEE, etc.)
4. ✅ `school_types` - School types master (Public, Private, etc.)

### Modified Tables:
5. ✅ `student` - Added 4 new columns with foreign keys

### Existing Tables (Not Modified):
- `institute`
- `manager`
- `batch`
- `subject`
- `batch_subject`
- `attendance`
- `attendance_details`

---

## 🚀 Quick Implementation Checklist

- [x] Create `class_levels` table
- [x] Create `boards` table
- [x] Create `streams` table
- [x] Create `school_types` table
- [x] Insert master data
- [x] Add `class_level_id` column to `student`
- [x] Add `board_id` column to `student` (NOT NULL)
- [x] Add `stream_id` column to `student` (NULL allowed)
- [x] Add `school_type_id` column to `student` (NOT NULL)
- [x] Add foreign key constraints
- [x] Add indexes on foreign keys
- [x] Update frontend form (`AddStudent.jsx`)
- [x] Create API service (`masterDataApi.js`)

---

## 📂 Files Created/Modified

### Database Files:
- ✅ `database_schema_complete.sql` - Complete schema
- ✅ `database_migration_script.sql` - Migration script
- ✅ `DATABASE_SCHEMA_STUDENT_REGISTRATION.md` - Detailed documentation
- ✅ `DATABASE_TABLES_REFERENCE.md` - Complete table reference
- ✅ `TABLES_QUICK_REFERENCE.md` - This file

### Frontend Files:
- ✅ `src/Services/masterDataApi.js` - NEW - API service for master data
- ✅ `src/Pages/AddStudent.jsx` - MODIFIED - Updated form with conditional logic

---

## 📋 SQL Files Usage

1. **For new database:** Run `database_schema_complete.sql`
2. **For existing database:** Run `database_migration_script.sql`
3. **For reference:** See `DATABASE_TABLES_REFERENCE.md`

---

**Last Updated:** Registration Module Implementation  
**Total New Tables:** 4  
**Total Columns Added to student:** 4  
**Total Foreign Keys Added:** 4  
