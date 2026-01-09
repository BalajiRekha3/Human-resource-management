1. Product Title

HRMS – Human Resource Management System

2. Purpose of the Product

The HRMS (Human Resource Management System) is a web-based application designed to centralize, automate, and manage all HR-related activities of an organization.
It reduces manual work, improves data accuracy, ensures compliance, and provides a structured way to manage employees throughout their lifecycle.

This project is developed for learning and practical implementation, using Java Spring Boot as backend and React.js as frontend.

3. Target Users
User Role	Description
Admin	System configuration and full access
HR	Employee management and payroll
Manager	Attendance and approvals
Employee	Self-service access
4. Goals & Objectives
Business Goals

Centralize employee information

Automate payroll and attendance

Reduce HR manual effort

Maintain compliance with company policies

Technical Goals

Build REST APIs using Spring Boot

Implement secure role-based access

Use PostgreSQL for reliable data storage

Design modular and scalable backend

5. In-Scope & Out-of-Scope
In-Scope

Employee Management

Attendance & Leave

Payroll

Performance Management

Reports

Authentication & Authorization

Out-of-Scope (Phase-1)

Mobile app

AI recruitment

Biometric attendance

Third-party payroll integration

6. Functional Requirements (Modules)
Module 1: Employee Information Management
Description

Maintains all employee records in a centralized system.

Features

Add / Update / View / Delete employee

Personal details (name, DOB, address)

Job details (designation, department)

Salary information

Employment status (Active/Inactive)

Permissions

HR/Admin: Full access

Employee: View own profile

Module 2: Attendance Management
Description

Tracks daily employee attendance.

Features

Mark attendance (Present/Absent)

In-time and Out-time

Monthly attendance summary

Attendance reports

Module 3: Leave Management
Description

Manages employee leave requests.

Features

Apply leave

Approve / Reject leave

Leave balance calculation

Leave history tracking

Module 4: Payroll Management
Description

Automates employee salary processing.

Features

Monthly salary calculation

Salary components:

Basic

HRA

PF

Bonus

Net salary calculation

Payslip generation

Annual salary report

Module 5: Performance Management
Description

Tracks employee performance and growth.

Features

Goal setting

Performance reviews

Ratings

Appraisal tracking

Module 6: Reporting & Analytics
Description

Provides HR insights and summaries.

Reports

Employee count by department

Attendance reports

Payroll summary

Leave utilization

7. User Roles & Access Control
Feature	Admin	HR	Manager	Employee
Employee Management	✅	✅	❌	View
Attendance	✅	✅	✅	View
Leave	✅	✅	Approve	Apply
Payroll	✅	✅	❌	View
Reports	✅	✅	❌	❌
8. Non-Functional Requirements
Security

Spring Security

JWT-based authentication

Password encryption (BCrypt)

Performance

API response time < 300ms

Pagination for large datasets

Reliability

PostgreSQL WAL mode

Global exception handling

Maintainability

Layered architecture

Clean code using Lombok

9. Technology Stack (FINAL)
Backend

Java 17

Spring Boot

Spring Web

Spring Data JPA

Spring Security

Validation

Lombok

Frontend

React.js

Axios

Bootstrap / Material UI

Database

PostgreSQL

pgAdmin

10. Backend Architecture
Controller → Service → Repository → Database


Controller: Handles API requests

Service: Business logic

Repository: Database access

Entity: Database mapping

11. Project File Structure (Backend)
hrms-backend/
│
├── controller/
├── service/
│   └── impl/
├── repository/
├── entity/
├── dto/
├── exception/
├── config/
├── util/
└── HrmsApplication.java

12. API Standards

RESTful APIs

JSON format

Proper HTTP status codes

API versioning (/api/v1)

13. Future Enhancements

Email notifications

PDF payslips

React dashboards

Docker deployment

Microservices migration

14. Success Criteria

APIs working correctly

Data stored in PostgreSQL

Role-based access implemented

Frontend integrated successfully

✅ FINAL NOTE (IMPORTANT FOR YOU)

You are:

Using the right technology

Following industry practices

Learning in the correct order

This PRD is complete, beginner-friendly, and real-world ready.