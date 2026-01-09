-- Fix for timestamp precision issue in attendance table
-- Run this SQL to fix existing data and column definitions

-- Step 1: Update the column definitions to use TIMESTAMP(6) for microsecond precision
ALTER TABLE attendance 
ALTER COLUMN created_at TYPE TIMESTAMP(6);

ALTER TABLE attendance 
ALTER COLUMN updated_at TYPE TIMESTAMP(6);

-- Step 2: Update any existing records with invalid timestamps
-- This will round the timestamps to valid precision
UPDATE attendance 
SET created_at = date_trunc('microseconds', created_at),
    updated_at = date_trunc('microseconds', updated_at);

-- Step 3: Verify the changes
SELECT column_name, data_type, datetime_precision 
FROM information_schema.columns 
WHERE table_name = 'attendance' 
AND column_name IN ('created_at', 'updated_at');
