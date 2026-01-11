# HRMS - Developer Documentation

Welcome to the **Human Resource Management System (HRMS)** developer guide. This document provides a comprehensive overview of the project's architecture, technologies, and setup instructions to help developers understand and contribute to the system.

---

## 🚀 Project Overview
The HRMS is a full-stack application designed to streamline human resource processes, including employee management, attendance tracking, leave applications, payroll processing, and reporting. It features a robust Spring Boot backend and a modern React frontend.

---

## 🛠️ Tech Stack

### Backend
- **Java 17 & Spring Boot 3.2**: Core framework for building high-performance REST APIs.
- **Spring Security & JWT**: Secure authentication and role-based access control.
- **Spring Data JPA & PostgreSQL**: Efficient data persistence and management.
- **Swagger/OpenAPI**: Automated API documentation and interactive testing.

### Frontend
- **React 19 & Vite**: Modern frontend library and ultra-fast build tool.
- **Tailwind CSS**: Utility-first CSS framework for beautiful, responsive UI.
- **React Router Dom**: Client-side routing for seamless navigation.
- **Axios**: Promised-based HTTP client for API communication.
- **Lucide React**: Clean and consistent icon set for the interface.

---

## 📂 Project Structure

### Backend (`HR_Management/`)

#### [Directory] `src/main/java/com/example/hr/management/config`
- Contains configuration classes for security, CORS, and JWT.
- Handlers for Spring Security filter chains and authentication providers.
- Essential for cross-origin communication and securing API endpoints.

#### [Directory] `src/main/java/com/example/hr/management/controller`
- REST controllers that define the API endpoints for each module.
- Handles incoming HTTP requests and maps them to appropriate service methods.
- Includes controllers for Auth, Employee, Leave, Attendance, and Payroll.

#### [Directory] `src/main/java/com/example/hr/management/service`
- Defines the business logic interface for the application.
- Decouples API handlers from actual business rules for better maintainability.
- Contains implementation (`impl`) classes that handle complex logic.

#### [Directory] `src/main/java/com/example/hr/management/entity`
- JPA entities representing database tables and their relationships.
- Defines fields, primary keys, and foreign keys for the PostgreSQL database.
- Uses Lombok annotations to reduce boilerplate code like getters and setters.

#### [Directory] `src/main/java/com/example/hr/management/repository`
- Interfaces extending JpaRepository for direct database interaction.
- Provides built-in methods for CRUD operations and custom query methods.
- Bridges the gap between entities and data persistence.

---

### Frontend (`hrms-frontend/`)

#### [Directory] `src/pages`
- Contains all page-level components that correspond to application routes.
- Includes Dashboard, Employee List, Leave Management, and Payroll views.
- Orchestrates smaller components to build full-screen interfaces.

#### [Directory] `src/components`
- Reusable UI elements such as badges, tables, and layouts.
- Shared logic and styles for consistency across the entire application.
- Divided into subfolders like `layout`, `auth`, and `payroll`.

#### [Directory] `src/services`
- API service layer using Axios to communicate with the backend.
- Centralizes all HTTP calls to make management and debugging easier.
- Handles standard headers and request/response interceptors.

#### [Directory] `src/context`
- React Context API implementation for global state management.
- Primarily used for storing authentication state and user information.
- Provides a centralized "Source of Truth" for session data.

---

## 🏃 Getting Started

### 1. Prerequisites
- **Java 17 JDK** installed.
- **Node.js (v18+)** and npm installed.
- **PostgreSQL** database running with a database named `HR_Management`.

### 2. Backend Setup
1. Navigate to the backend folder: `cd HR_Management`.
2. Configure `src/main/resources/application.properties` with your database credentials.
3. Run the application using Maven: `./mvnw spring-boot:run`.
4. Access Swagger UI at: `http://localhost:9090/swagger-ui.html`.

### 3. Frontend Setup
1. Navigate to the frontend folder: `cd hrms-frontend`.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.
4. Open your browser at: `http://localhost:3000` (or the port shown in terminal).

---

## 🔐 Key Features

### Authentication & Authorization
Uses JWT tokens for secure sessions. Roles include **ADMIN**, **HR**, and **EMPLOYEE**, each with specific permissions defined in `SecurityConfig.java`.

### Employee Management
Full CRUD functionality for employee records, including personal details, department assignments, and role management via a polished table interface.

### Leave & Attendance
Integrated system for applying for leave, approving requests, and tracking daily attendance with specialized UI components for better visibility.

### Payroll Processing
Calculates and generates payslips based on salary structures, with exportable PDF options for employees to download their financial records.

---

*This guide aims to provide a clear path for developers joining the project. For specific implementation details, please refer to the inline code documentation.*
