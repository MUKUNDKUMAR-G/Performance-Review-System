# Performance Review System - Fullstack Developer Challenge

## Project Overview

This is a full-stack web application that enables employees to submit feedback for each other's performance reviews. The system provides separate interfaces for administrators and employees with role-based access control.


---


### Technology Stack

#### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5.2.1
- **Database:** MySQL 8.0+
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Database Driver:** mysql2

#### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Routing:** React Router DOM 7.10.0
- **HTTP Client:** Axios 1.13.2
- **Styling:** Custom CSS

---

## Features Implemented

### Admin Features 
- **Employee Management**
  - Add new employees
  - Update employee information
  - View all employees
  - Delete employees
  - Activate/Deactivate employee accounts
  
- **Performance Review Management**
  - Create performance reviews for employees
  - Update review details
  - View all reviews with status tracking
  - Delete reviews
  - Track review statistics
  
- **Review Assignment**
  - Assign multiple employees to participate in a review
  - View assigned reviewers for each review
  - Remove reviewer assignments
  
- **Feedback Viewing**
  - View all submitted feedback for any review
  - Monitor feedback submission status

### Employee Features 
-  **Dashboard**
  - View assigned performance reviews
  - See pending feedback requests
  - Track submission status

- **Feedback Submission**
  - List all reviews requiring feedback
  - Submit detailed feedback for assigned reviews
  - Update previously submitted feedback
  
- **Review Tracking**
  - View review details
  - See feedback submission history

---

## 🗄️ Database Schema

### Tables

**users**
- id (PK, AUTO_INCREMENT)
- email (UNIQUE)
- password (hashed)
- first_name
- last_name
- role (admin/employee)
- is_active (boolean)
- created_at, updated_at

**performance_reviews**
- id (PK, AUTO_INCREMENT)
- employee_id (FK → users)
- review_period
- status (draft/active/completed)
- created_by (FK → users)
- created_at, updated_at

**review_assignments**
- id (PK, AUTO_INCREMENT)
- review_id (FK → performance_reviews)
- reviewer_id (FK → users)
- status (pending/submitted)
- created_at
- UNIQUE constraint on (review_id, reviewer_id)

**feedback**
- id (PK, AUTO_INCREMENT)
- assignment_id (FK → review_assignments)
- answers (TEXT - JSON format)
- submitted_at

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| GET | `/me` | Get current user | Yes |

### Users (`/api/users`) - Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all users |
| GET | `/:id` | Get user by ID |
| POST | `/` | Create new user |
| PUT | `/:id` | Update user |
| DELETE | `/:id` | Delete user |
| PATCH | `/:id/activate` | Toggle user status |

### Reviews (`/api/reviews`) - Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all reviews |
| GET | `/stats` | Get review statistics |
| GET | `/:id` | Get review by ID |
| POST | `/` | Create new review |
| PUT | `/:id` | Update review |
| DELETE | `/:id` | Delete review |

### Assignments (`/api/assignments`)
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/my-assignments` | Get my assignments | Employee |
| GET | `/review/:reviewId` | Get review assignments | Admin |
| POST | `/` | Create assignment | Admin |
| DELETE | `/:id` | Delete assignment | Admin |

### Feedback (`/api/feedback`)
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/my-assignments` | Get my feedback assignments | Employee |
| GET | `/assignment/:assignmentId` | Get assignment details | Employee |
| POST | `/` | Submit feedback | Employee |
| PUT | `/:id` | Update feedback | Employee |
| GET | `/review/:reviewId` | Get review feedback | Admin |
| DELETE | `/:id` | Delete feedback | Admin |

---

##  Web Pages Implemented

### Public Pages
1. **Login Page** (`/login`) - User authentication
2. **Register Page** (`/register`) - New user registration

### Admin Pages
3. **Admin Dashboard** (`/admin/dashboard`) - Overview and statistics
4. **Employee List** (`/admin/employees`) - Manage employees
5. **Employee Form** (`/admin/employees/new`, `/admin/employees/edit/:id`) - Add/Edit employees
6. **Review List** (`/admin/reviews`) - Manage performance reviews
7. **Review Form** (`/admin/reviews/new`, `/admin/reviews/edit/:id`) - Create/Edit reviews
8. **Assign Reviewers** (`/admin/reviews/:id/assign`) - Assign employees to reviews
9. **View Feedback** (`/admin/reviews/:id/feedback`) - View submitted feedback

### Employee Pages
10. **Employee Dashboard** (`/employee/dashboard`) - Employee overview
11. **My Reviews** (`/employee/reviews`) - List of assigned reviews
12. **Submit Feedback** (`/employee/feedback/:assignmentId`) - Submit review feedback

**Total Pages: 12** (exceeds requirement of 2-5 pages)

---

## Setup & Installation
### **Clone the repo or download the repo, Then follow the below steps**

### Backend Setup

1. **Navigate to Backend directory:**
```bash
cd Backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
Create/Edit `.env` file:
```env
PORT=5000
JWT_SECRET=your_secret_key_here
DB_HOST=localhost
DB_NAME=feedback_system
DB_USER=root
DB_PASSWORD=your_mysql_password
```

4. **Setup Database:**
```bash
mysql -u root -p

source database.sql
```

5. **Seed Admin User (Must) from backend folder:**
```bash
node seedAdmin.js
```
This creates an admin user:
- Email: admin@example.com
- Password: admin123

6. **Start Backend Server:**
```bash
npm start
or
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to Frontend directory:**
```bash
cd Frontend
```

2. **Install dependencies:**
```bash
npm install
```
3. **Start Frontend Development Server:**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## Test the Application

### 1. Access the Application
Open browser and navigate to: `http://localhost:5173`

### 2. Login as Admin. before this seed the admin credentails to the backend
- Email: `admin@test.com`
- Password: `admin123`

### 3. Test Admin Workflow
if you use user management from admin to create Users follow below steps
    1. Create employees (at least 3)
    2. Create a performance review for an employee
    3. Assign other employees as reviewers
    4. View the review assignments
else using Register form to create a Users then:
    1. Register employees (at least 3)
    2. Login as admin
    3. Approve the employees that u have created 
    4. Create a performance review for an employee
    5. Assign other employees as reviewers
    6. View the review assignments

### 4. Test Employee Workflow
1. Logout from admin
2. Login as an employee (use credentials created by admin)
3. View assigned reviews in dashboard
4. Submit feedback for assigned reviews
5. View submission status

### 5. Verify Feedback
1. Login back as admin
2. Navigate to reviews
3. View submitted feedback for the review

---

## Assumptions Made by me

1. **User Registration:** 
   - New users register as employees by default
   - Admin must activate employee accounts before they can login
   - Only one admin account is needed (created via seed script)

2. **Review Process:**
   - A review can be in draft, active, or completed status
   - Employees can only see and submit feedback for active reviews
   - Multiple employees can provide feedback for a single review

3. **Feedback Format:**
   - Feedback is stored as JSON text in the database
   - Feedback can be updated before final submission
   - Once submitted, status changes from 'pending' to 'submitted'

4. **Security:**
   - JWT tokens expire (configured in backend)
   - Passwords are hashed using bcryptjs
   - Role-based middleware protects all sensitive routes

5. **Database:**
   - MySQL is running locally
   - Database name is `feedback_system`
   - Foreign key constraints ensure data integrity

---

