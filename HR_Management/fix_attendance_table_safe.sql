-- SAFE Fix for Attendance table ID auto-increment issue
-- This will NOT delete existing data
-- Run this SQL script in your PostgreSQL database

-- Step 1: Check if the table exists and what the current ID column looks like
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'attendance' AND column_name = 'id';

-- Step 2: If the ID column exists but is not auto-increment, we need to alter it
-- First, create a sequence if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS attendance_id_seq;

-- Step 3: Set the sequence to start from the max current ID + 1 (to avoid conflicts)
SELECT setval('attendance_id_seq', COALESCE((SELECT MAX(id) FROM attendance), 0) + 1, false);

-- Step 4: Alter the ID column to use the sequence for auto-increment
ALTER TABLE attendance 
ALTER COLUMN id SET DEFAULT nextval('attendance_id_seq');

-- Step 5: Make the sequence owned by the column (so it gets deleted if column is deleted)
ALTER SEQUENCE attendance_id_seq OWNED BY attendance.id;

-- Step 6: Verify the change
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'attendance' AND column_name = 'id';

-- You should see something like: nextval('attendance_id_seq'::regclass)
