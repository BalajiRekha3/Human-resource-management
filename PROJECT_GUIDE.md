# Project Overview & Architecture

This guide explains how the HRMS (HR Management System) project is structured and how its components interact.

## Core Folders
- **`HR_Management/`**: Backend (Java Spring Boot)
- **`hrms-frontend/`**: Frontend (React + Vite)

---

## Backend Architecture (Java Spring Boot)

The backend follows a layered architecture to keep the code organized and easy to maintain.

### 1. Entity (`com.example.hr.management.entity`)
- **What it is**: Represents a table in the database.
- **Example (`User.java`)**:
  - `id`: Unique identifier.
  - `username`, `email`, `password`: Login credentials.
  - `fullName`: The user's displayed name.
  - `roles`: What the user can do (Admin, Employee, etc.).
  - `enabled`: If the account is active.

### 2. Repository (`com.example.hr.management.repository`)
- **What it is**: The bridge between Java and the Database.
- **How it works**: It provides built-in methods like `save()`, `findById()`, and `delete()`. You don't need to write SQL for simple tasks.

### 3. Service (`com.example.hr.management.service`)
- **What it is**: Where the "Business Logic" happens.
- **How it works**: The Service handles calculations, validation, and complex operations. It talks to the Repository to get/save data and is used by the Controller.

### 4. Controller (`com.example.hr.management.controller`)
- **What it is**: The Entry Point for the Frontend.
- **How it works**: It defines API endpoints (URLs) like `/api/auth/login`. It receives requests from the frontend and sends back data (usually as JSON).

---

## Simple Flow Diagram
`Frontend` -> `Controller` -> `Service` -> `Repository` -> `Database`

---

## Getting Started
1. **Database**: Make sure your MySQL/PostgreSQL is running.
2. **Backend**: Run `./mvnw spring-boot:run` in the `HR_Management` folder.
3. **Frontend**: Run `npm run dev` in the `hrms-frontend` folder.
