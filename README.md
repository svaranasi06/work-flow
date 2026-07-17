# Workforce Management System
 
## Overview
 
The Workforce Management System is a full-stack web application designed to simplify employee leave management and workforce operations within an organization. It provides a centralized platform where employees can apply for leave, managers can review and approve requests, and HR can efficiently manage employees, holidays, reports, and organizational workflows.
 
The application follows a modular architecture with separate frontend and backend applications, making it scalable, maintainable, and easy to extend with additional features.
 
---
 
# Features
 
## Authentication
 
- Secure Login
- JWT Authentication
- Refresh Token Authentication
- Role-Based Authorization
- Protected Routes
- Secure Session Management
 
---
 
## Employee Module
 
- Employee Dashboard
- Apply for Leave
- View Leave History
- Attendance Tracking
- Calendar View
- Holiday List
- Notifications
- Profile Management
 
---
 
## Manager Module
 
- Manager Dashboard
- Review Team Leave Requests
- Approve Leave Requests
- Reject Leave Requests
- Manager Inbox
 
---
 
## HR Module
 
- HR Dashboard
- Employee Management
- Holiday Management
- Reports
- HR Inbox
- Workforce Monitoring
 
---
 
# Technology Stack
 
## Frontend
 
- React
- TypeScript
- React Router
- Axios
- CSS
 
## Backend
 
- Node.js
- Express.js
- REST API
- JWT Authentication
 
## Database
 
- PostgreSQL
 
---
 
# Project Structure
 
```
workforce-management-system
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   ├── styles
│   │   ├── types
│   │   └── utils
│   ├── public
│   ├── package.json
│   └── vite.config.ts
│
├── backend
│   ├── controllers
│   ├── services
│   ├── routes
│   ├── middleware
│   ├── validators
│   ├── models
│   ├── database
│   ├── utils
│   ├── package.json
│   └── server.js
│
├── README.md
└── .gitignore
```
 
---
 
# System Workflow
 
## Employee
 
1. Login to the application.
2. Access the employee dashboard.
3. Submit a leave request.
4. Track leave request status.
5. View attendance records.
6. Check company holidays.
7. Receive notifications.
 
---
 
## Manager
 
1. Login as Manager.
2. View pending leave requests.
3. Review employee leave details.
4. Approve or reject requests.
5. Manage team leave workflow.
 
---
 
## HR
 
1. Login as HR.
2. Manage employee information.
3. Manage company holidays.
4. View reports.
5. Monitor leave records.
6. Handle HR inbox requests.
 
---
 
# Security Features
 
- JWT Authentication
- Refresh Tokens
- Role-Based Access Control
- Protected API Routes
- Input Validation
- Secure Password Handling
- Authentication Middleware
- Authorization Middleware
 
---
 
# Installation
 
## Clone Repository
 
```bash
git clone <repository-url>
```
 
---
 
## Backend Setup
 
```bash
cd backend
 
npm install
 
npm run dev
```
 
---
 
## Frontend Setup
 
```bash
cd frontend
 
npm install
 
npm run dev
```
 
---
 
# Environment Variables
 
Create a `.env` file inside the backend directory.
 
Example:
 
```env
PORT=5000
 
DATABASE_URL=your_database_url
 
JWT_SECRET=your_jwt_secret
 
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```
 
Do not commit the `.env` file to GitHub.
 
---
 
# API Modules
 
- Authentication
- Employee Management
- Leave Management
- Attendance
- Holidays
- Notifications
- Reports
- User Profile
 
---
 
# Project Architecture
 
```
                React Frontend
                       │
                       │
                 REST API Calls
                       │
                       │
              Express.js Backend
                       │
                       │
                  PostgreSQL
```
 
---
 
# Folder Responsibilities
 
## Frontend
 
### components
 
Reusable UI components.
 
### pages
 
Application pages and screens.
 
### services
 
API service calls.
 
### routes
 
Application routing.
 
### context
 
Global state management.
 
### styles
 
Application styling.
 
### types
 
TypeScript interfaces and types.
 
### utils
 
Utility helper functions.
 
---
 
## Backend
 
### controllers
 
Handle incoming API requests.
 
### services
 
Business logic.
 
### routes
 
Application endpoints.
 
### middleware
 
Authentication and authorization.
 
### validators
 
Request validation.
 
### models
 
Database models.
 
### database
 
Database configuration.
 
### utils
 
Reusable helper functions.
 
---
 
# Future Enhancements
 
- Email Notifications
- Dashboard Analytics
- Export Reports
- Mobile Responsive Improvements
- Audit Logs
- Performance Optimization
- Multi-Level Approval Workflow
 
---
 
# Best Practices Followed
 
- Modular Folder Structure
- Separation of Concerns
- Reusable Components
- RESTful API Design
- Clean Code Principles
- Type Safety with TypeScript
- JWT Authentication
- Error Handling
- Role-Based Access Control
- Maintainable Architecture
 
---
 
# Author
 
**Balaji Thamiri**
 
Computer Science Engineer
 
Full Stack Developer
 
---
 
# License
 
This project is intended for educational and demonstration purposes.