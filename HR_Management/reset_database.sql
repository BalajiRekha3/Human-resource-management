-- Complete Database Reset Script for HR_Management
-- WARNING: This will delete ALL data and recreate the database from scratch
-- Only run this if you want to start fresh!

-- Step 1: Drop the existing database (you need to disconnect from it first)
-- Run this from the 'postgres' database, not from HR_Management
DROP DATABASE IF EXISTS HR_Management;

-- Step 2: Create a fresh database
CREATE DATABASE HR_Management
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Step 3: Connect to the new database
\c HR_Management

-- Now your Spring Boot application will create all tables automatically
-- when you restart it with spring.jpa.hibernate.ddl-auto=update
