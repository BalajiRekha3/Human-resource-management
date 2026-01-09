HR_Management/
│
├── pom.xml
├── mvnw
├── mvnw.cmd
├── README.md
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── hr/
│   │   │               └── management/
│   │   │                   │
│   │   │                   ├── HrManagementApplication.java
│   │   │                   │
│   │   │                   ├── config/
│   │   │                   │   ├── SecurityConfig.java
│   │   │                   │   ├── JwtAuthenticationFilter.java
│   │   │                   │   └── SwaggerConfig.java
│   │   │                   │
│   │   │                   ├── controller/
│   │   │                   │   ├── AuthController.java
│   │   │                   │   ├── EmployeeController.java
│   │   │                   │   ├── AttendanceController.java
│   │   │                   │   ├── LeaveController.java
│   │   │                   │   ├── PayrollController.java
│   │   │                   │   └── ReportController.java
│   │   │                   │
│   │   │                   ├── service/
│   │   │                   │   ├── AuthService.java
│   │   │                   │   ├── EmployeeService.java
│   │   │                   │   ├── AttendanceService.java
│   │   │                   │   ├── LeaveService.java
│   │   │                   │   ├── PayrollService.java
│   │   │                   │   └── ReportService.java
│   │   │                   │
│   │   │                   ├── service/impl/
│   │   │                   │   ├── AuthServiceImpl.java
│   │   │                   │   ├── EmployeeServiceImpl.java
│   │   │                   │   ├── AttendanceServiceImpl.java
│   │   │                   │   ├── LeaveServiceImpl.java
│   │   │                   │   ├── PayrollServiceImpl.java
│   │   │                   │   └── ReportServiceImpl.java
│   │   │                   │
│   │   │                   ├── repository/
│   │   │                   │   ├── UserRepository.java
│   │   │                   │   ├── EmployeeRepository.java
│   │   │                   │   ├── AttendanceRepository.java
│   │   │                   │   ├── LeaveRepository.java
│   │   │                   │   ├── PayrollRepository.java
│   │   │                   │   └── RoleRepository.java
│   │   │                   │
│   │   │                   ├── entity/
│   │   │                   │   ├── User.java
│   │   │                   │   ├── Role.java
│   │   │                   │   ├── Employee.java
│   │   │                   │   ├── Attendance.java
│   │   │                   │   ├── Leave.java
│   │   │                   │   └── Payroll.java
│   │   │                   │
│   │   │                   ├── dto/
│   │   │                   │   ├── LoginRequestDTO.java
│   │   │                   │   ├── LoginResponseDTO.java
│   │   │                   │   ├── EmployeeRequestDTO.java
│   │   │                   │   ├── EmployeeResponseDTO.java
│   │   │                   │   ├── AttendanceDTO.java
│   │   │                   │   ├── LeaveRequestDTO.java
│   │   │                   │   └── PayrollDTO.java
│   │   │                   │
│   │   │                   ├── exception/
│   │   │                   │   ├── GlobalExceptionHandler.java
│   │   │                   │   ├── ResourceNotFoundException.java
│   │   │                   │   └── BadRequestException.java
│   │   │                   │
│   │   │                   └── util/
│   │   │                       ├── JwtUtil.java
│   │   │                       ├── SalaryCalculator.java
│   │   │                       └── DateUtil.java
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql
│   │
│   └── test/
│       └── java/
│           └── com/example/hr/management/
│               └── HrManagementApplicationTests.java
