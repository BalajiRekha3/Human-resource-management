# Project Overview & Architecture

This guide explains how the HRMS (HR Management System) project is structured and how its components interact.

## Complete Project Structure

```text
PriyanshJava/ (Root)
├── HR_Management/ (Backend - Spring Boot)
│   ├── pom.xml (Maven dependencies)
│   ├── src/main/java/com/example/hr/management/
│   │   ├── controller/ (API Endpoints)
│   │   │   ├── AuthController.java
│   │   │   ├── EmployeeController.java
│   │   │   ├── AttendanceController.java
│   │   │   ├── LeaveController.java
│   │   │   ├── LeaveTypeController.java
│   │   │   ├── LeaveBalanceController.java
│   │   │   └── ApiResponse.java (Common Response Wrapper)
│   │   ├── service/ (Business Logic)
│   │   ├── repository/ (Database Access)
│   │   │   ├── UserRepository.java
│   │   │   ├── EmployeeRepository.java
│   │   │   ├── AttendanceRepository.java
│   │   │   ├── LeaveRepository.java
│   │   │   ├── LeaveTypeRepository.java
│   │   │   ├── LeaveBalanceRepository.java
│   │   │   └── RoleRepository.java
│   │   ├── entity/ (Database Models: User, Employee, Leave, LeaveType, LeaveBalance, LeaveStatus)
│   │   ├── dto/ (Data Transfer Objects)
│   │   │   ├── LeaveRequestDTO.java
│   │   │   ├── LeaveResponseDTO.java
│   │   │   ├── LeaveBalanceDTO.java
│   │   │   └── LeaveTypeDTO.java
│   │   └── util/ (Helpers)
│   └── src/main/resources/ (application.properties, SQL)
│
├── hrms-frontend/ (Frontend - React + Vite)
│   ├── package.json (Node dependencies)
│   ├── vite.config.js (Vite config)
│   ├── index.html (Main entry point)
│   ├── src/
│   │   ├── components/ (Reusable UI components)
│   │   ├── pages/ (Login, Dashboard, Employee List, etc.)
│   │   ├── services/ (API communication logic)
│   │   ├── utils/ (Auth context, helpers)
│   │   ├── App.jsx (Main Routing)
│   │   └── main.jsx (React initialization)
│   └── public/ (Static assets)
│
├── .gitignore (Combined ignore rules)
└── PROJECT_GUIDE.md (This file)
```

---

## Backend Architecture (Java Spring Boot)

The backend follows a layered architecture to keep the code organized and easy to maintain.

### 1. Entity (`com.example.hr.management.entity`)
- **What it is**: Represents a table in the database.
- **Key Entities**:
  - **`User.java`**: Login credentials and roles.
  - **`Employee.java`**: Detailed employee profile.
  - **`Leave.java`**: Leave request details (dates, reason, status).
  - **`LeaveType.java`**: Types of leave (Sick, Casual, etc.) and their yearly limits.
  - **`LeaveBalance.java`**: Tracks how many days an employee has left for each leave type.
  - **`LeaveStatus.java`**: Enum for Pending, Approved, Rejected, etc.
  - **`Attendance.java`**: Daily clock-in/out records.

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
