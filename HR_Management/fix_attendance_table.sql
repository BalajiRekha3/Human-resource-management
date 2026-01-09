-- Fix for Attendance table ID auto-increment issue
-- Run this SQL script in your PostgreSQL database

-- Step 1: Drop the existing attendance table if it exists
DROP TABLE IF EXISTS attendance CASCADE;

-- Step 2: Create the attendance table with proper ID auto-increment
CREATE TABLE attendance (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    clock_in_time TIME,
    clock_out_time TIME,
    status VARCHAR(20) NOT NULL DEFAULT 'PRESENT',
    remarks VARCHAR(500),
    working_hours DOUBLE PRECISION,
    is_late BOOLEAN NOT NULL DEFAULT FALSE,
    late_minutes INTEGER,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT unique_emp_date UNIQUE (employee_id, attendance_date),
    CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Step 3: Create index for better query performance
CREATE INDEX idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);

-- Verify the table structure
\d attendance
