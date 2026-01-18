# Database Tables Reference - Student Registration Module

This document provides a complete reference of all database tables with changes made for the student registration module.

---

## Table of Contents

1. [Master Tables](#master-tables)
   - [class_levels](#class_levels)
   - [boards](#boards)
   - [streams](#streams)
   - [school_types](#school_types)
2. [Updated Tables](#updated-tables)
   - [student](#student-table)
3. [Summary of Changes](#summary-of-changes)
4. [Table Relationships](#table-relationships)

---

## Master Tables

### class_levels

**Purpose:** Master table storing available class levels (8, 9, 10, 11, 12).

**Table Structure:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `class_level_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `level` | INT | NOT NULL, UNIQUE | Class level number (8, 9, 10, 11, 12) |
| `name` | VARCHAR(50) | NOT NULL | Display name (e.g., "Class 8") |
| `description` | TEXT | NULL | Optional description |
| `requires_stream` | BOOLEAN | DEFAULT FALSE | TRUE for 11-12, FALSE for 8-10 |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Sample Data:**
```
class_level_id | level | name     | requires_stream
---------------|-------|----------|----------------
1              | 8     | Class 8  | FALSE
2              | 9     | Class 9  | FALSE
3              | 10    | Class 10 | FALSE
4              | 11    | Class 11 | TRUE
5              | 12    | Class 12 | TRUE
```

---

### boards

**Purpose:** Master table storing education boards (CBSE, STATE, etc.).

**Table Structure:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `board_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `code` | VARCHAR(20) | NOT NULL, UNIQUE | Unique code (e.g., "CBSE") |
| `name` | VARCHAR(100) | NOT NULL | Full board name |
| `description` | TEXT | NULL | Optional description |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active status flag |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Sample Data:**
```
board_id | code  | name                                      | is_active
---------|-------|-------------------------------------------|----------
1        | CBSE  | Central Board of Secondary Education      | TRUE
2        | STATE | State Board                               | TRUE
3        | ICSE  | Indian Certificate of Secondary Education | TRUE
4        | IB    | International Baccalaureate               | TRUE
```

---

### streams

**Purpose:** Master table storing streams (NEET, JEE, etc.).

**Table Structure:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `stream_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `code` | VARCHAR(20) | NOT NULL, UNIQUE | Unique code (e.g., "NEET") |
| `name` | VARCHAR(100) | NOT NULL | Full stream name |
| `description` | TEXT | NULL | Optional description |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active status flag |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Sample Data:**
```
stream_id | code        | name                | is_active
----------|-------------|---------------------|----------
1         | NEET        | NEET (Medical)      | TRUE
2         | JEE         | JEE (Engineering)   | TRUE
3         | FOUNDATION  | Foundation Course   | TRUE
4         | COMMERCE    | Commerce            | TRUE
5         | ARTS        | Arts                | TRUE
```

---

### school_types

**Purpose:** Master table storing school types (Public, Private, etc.).

**Table Structure:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `school_type_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `code` | VARCHAR(20) | NOT NULL, UNIQUE | Unique code (e.g., "PUBLIC") |
| `name` | VARCHAR(100) | NOT NULL | Full school type name |
| `description` | TEXT | NULL | Optional description |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active status flag |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

**Sample Data:**
```
school_type_id | code     | name                | is_active
---------------|----------|---------------------|----------
1              | PUBLIC   | Public School       | TRUE
2              | PRIVATE  | Private School      | TRUE
3              | GOVT     | Government School   | TRUE
4              | COACHING | Coaching Institute  | TRUE
```

---

## Updated Tables

### student (Table)

**Purpose:** Stores student information with references to class level, board, stream, and school type.

**Table Structure:**

#### Existing Columns:
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `student_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `name` | VARCHAR(255) | NOT NULL | Student name |
| `roll_no` | VARCHAR(50) | UNIQUE | Roll number |
| `mobile` | VARCHAR(15) | NOT NULL | Primary mobile number |
| `alt_mobile` | VARCHAR(15) | NULL | Alternate mobile number |
| `dob` | DATE | NULL | Date of birth |
| `password` | VARCHAR(255) | NULL | Hashed password for login |
| `batch_id` | INT | NULL, FK | Foreign key to batch table |
| `status` | ENUM | DEFAULT 'ACTIVE' | Student status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### **NEW COLUMNS ADDED:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| **`class_level_id`** | INT | NULL, FK → `class_levels.class_level_id` | Foreign key to class levels (8-12) |
| **`board_id`** | INT | **NOT NULL**, FK → `boards.board_id` | Foreign key to boards (**MANDATORY**) |
| **`stream_id`** | INT | NULL, FK → `streams.stream_id` | Foreign key to streams (NULL for 8-10, **REQUIRED for 11-12**) |
| **`school_type_id`** | INT | **NOT NULL**, FK → `school_types.school_type_id` | Foreign key to school types (**MANDATORY**) |

**Foreign Key Constraints:**

| Constraint Name | Column | References | On Delete | On Update |
|----------------|--------|------------|-----------|-----------|
| `fk_student_class_level` | `class_level_id` | `class_levels(class_level_id)` | SET NULL | CASCADE |
| `fk_student_board` | `board_id` | `boards(board_id)` | RESTRICT | CASCADE |
| `fk_student_stream` | `stream_id` | `streams(stream_id)` | SET NULL | CASCADE |
| `fk_student_school_type` | `school_type_id` | `school_types(school_type_id)` | RESTRICT | CASCADE |

**Indexes:**
- `idx_student_class_level` on `class_level_id`
- `idx_student_board` on `board_id`
- `idx_student_stream` on `stream_id`
- `idx_student_school_type` on `school_type_id`

**Sample Data:**
```
student_id | name      | class_level_id | board_id | stream_id | school_type_id
-----------|-----------|----------------|----------|-----------|---------------
1          | John Doe  | 1 (Class 8)    | 1 (CBSE) | NULL      | 1 (PUBLIC)
2          | Jane Smith| 4 (Class 11)   | 2 (STATE)| 1 (NEET)  | 2 (PRIVATE)
```

---

## Summary of Changes

### New Tables Created:

1. ✅ **class_levels** - Master table for class levels
2. ✅ **boards** - Master table for education boards
3. ✅ **streams** - Master table for streams
4. ✅ **school_types** - Master table for school types

### Student Table Changes:

1. ✅ Added `class_level_id` column (INT, NULL allowed)
2. ✅ Added `board_id` column (INT, **NOT NULL** - mandatory)
3. ✅ Added `stream_id` column (INT, NULL allowed, but required for 11-12)
4. ✅ Added `school_type_id` column (INT, **NOT NULL** - mandatory)
5. ✅ Added foreign key constraints for all new columns
6. ✅ Added indexes on all foreign key columns

### Validation Rules:

| Field | Classes 8-10 | Classes 11-12 | Notes |
|-------|--------------|---------------|-------|
| `class_level_id` | Required | Required | Must be selected first |
| `board_id` | Required | Required | Mandatory for all |
| `stream_id` | **NULL** | **Required** | Hidden for 8-10, shown for 11-12 |
| `school_type_id` | Required | Required | Mandatory for all |

---

## Table Relationships

```
class_levels (1) ←─── (many) student
     │
     ├─ level: 8, 9, 10 → stream_id = NULL
     └─ level: 11, 12 → stream_id REQUIRED

boards (1) ←─── (many) student [MANDATORY]

streams (1) ←─── (many) student [NULL for 8-10, REQUIRED for 11-12]

school_types (1) ←─── (many) student [MANDATORY]

batch (1) ←─── (many) student [existing relationship]
```

**Entity Relationship Diagram (Simplified):**

```
┌──────────────┐      ┌──────────┐
│class_levels  │      │ boards   │
│──────────────│      │──────────│
│class_level_id│      │board_id  │
│level         │      │code      │
│requires_     │      │name      │
│  stream      │      └────┬─────┘
└──────┬───────┘           │
       │                   │
       │                   │
┌──────▼───────────────────▼─────────────────┐
│              student                        │
│────────────────────────────────────────────│
│ student_id (PK)                            │
│ class_level_id (FK) → class_levels         │
│ board_id (FK, NOT NULL) → boards           │
│ stream_id (FK, NULL for 8-10) → streams    │
│ school_type_id (FK, NOT NULL) → school_type│
│ batch_id (FK) → batch                      │
│ ... other existing columns ...             │
└──────┬─────────────────────────────────────┘
       │
       │
┌──────▼───────┐      ┌──────────────┐
│ streams      │      │ school_types │
│──────────────│      │──────────────│
│stream_id     │      │school_type_id│
│code          │      │code          │
│name          │      │name          │
└──────────────┘      └──────────────┘
```

---

## SQL Files

1. **`database_schema_complete.sql`** - Complete schema with all tables
2. **`database_migration_script.sql`** - Migration script for existing databases
3. **`DATABASE_SCHEMA_STUDENT_REGISTRATION.md`** - Detailed schema documentation

---

## API Endpoints Required

### Master Data:
- `GET /api/class-levels` - Get all class levels
- `GET /api/boards` - Get all active boards
- `GET /api/streams` - Get all active streams
- `GET /api/school-types` - Get all active school types

### Student Registration:
- `POST /api/students` - Create student (includes new fields)

---

## Notes

1. **Database-Level Constraints:**
   - `board_id`: NOT NULL (enforced at database level)
   - `school_type_id`: NOT NULL (enforced at database level)
   - `stream_id`: NULL allowed (validation at application level)

2. **Application-Level Validation:**
   - `stream_id` must be NULL for classes 8-10
   - `stream_id` must be provided (NOT NULL) for classes 11-12
   - All validation is handled in `AddStudent.jsx`

3. **Data Integrity:**
   - Foreign keys ensure referential integrity
   - RESTRICT on delete for boards and school_types (prevents orphaned records)
   - SET NULL on delete for class_level and stream (allows deletion of master data)
