# Job Portal

A full-stack Job Portal web application developed using **Spring Boot, Spring Data JPA, Hibernate, MySQL, HTML, CSS, and JavaScript**. The application provides separate functionalities for **Admin** and **Candidate**, allowing job management, job applications, resume upload/download, and application status tracking.

---

## Features

### Admin

- Admin Login
- Dashboard Statistics
  - Total Jobs
  - Total Applications
  - Total Users
- Add New Jobs
- Edit Existing Jobs
- Delete Jobs
- View All Applications
- Download Candidate Resume
- Update Application Status
  - Pending
  - Selected
  - Rejected
- Refresh Dashboard
- Logout

---

### Candidate

- User Registration
- User Login
- Browse Available Jobs
- Search Jobs by Title
- View Complete Job Details
- Apply for Jobs
- Upload Resume (PDF)
- View Applied Jobs
- Track Application Status
- Logout

---

## Technologies Used

### Backend

- Java 21+
- Spring Boot
- Spring MVC
- Spring Data JPA
- Hibernate
- REST API

### Frontend

- HTML5
- CSS3
- JavaScript

### Database

- MySQL

### Build Tool

- Maven

### IDE

- IntelliJ IDEA

---

## Project Structure

```
JobPortal
│
├── uploads
│   └── resumes
│
├── src
│   ├── main
│   │
│   ├── java
│   │   └── org.example.jobportal
│   │       ├── controller
│   │       ├── model
│   │       ├── repository
│   │       ├── service
│   │       └── JobPortalApplication.java
│   │
│   └── resources
│       ├── static
│       │   ├── css
│       │   ├── js
│       │   ├── images
│       │   ├── index.html
│       │   ├── login.html
│       │   ├── register.html
│       │   ├── jobs.html
│       │   ├── dashboard.html
│       │   ├── admin.html
│       │   └── apply.html
│       │
│       └── application.properties
│
└── pom.xml
```

---

# Database Tables

## Users

| Column |
|----------|
| id |
| full_name |
| email |
| password |
| phone |
| role |

---

## Jobs

| Column |
|----------|
| id |
| title |
| company |
| location |
| salary |
| experience |
| skills |
| description |

---

## Applications

| Column |
|----------|
| id |
| applicant_name |
| email |
| phone |
| resume |
| status |
| job_id |
| user_id |

---

# REST APIs

## User APIs

| Method | Endpoint | Description |
|----------|--------------------------|----------------|
| POST | /api/users/register | Register User |
| POST | /api/users/login | Login |

---

## Job APIs

| Method | Endpoint | Description |
|----------|----------------|----------------|
| GET | /api/jobs | Get All Jobs |
| GET | /api/jobs/{id} | Get Job By ID |
| POST | /api/jobs/add | Add Job |
| PUT | /api/jobs/update/{id} | Update Job |
| DELETE | /api/jobs/delete/{id} | Delete Job |

---

## Application APIs

| Method | Endpoint | Description |
|----------|--------------------------------------------|------------------------|
| POST | /api/applications/apply/{jobId}/{userId} | Apply Job |
| GET | /api/applications | View Applications |
| GET | /api/applications/user/{userId} | User Applications |
| PUT | /api/applications/{id}/status | Update Status |

---

## Resume API

| Method | Endpoint | Description |
|----------|------------------------------|----------------|
| GET | /api/resume/{fileName} | Download Resume |

---

# Application Workflow

### Candidate

```
Register
      ↓
Login
      ↓
View Jobs
      ↓
Search Job
      ↓
Apply
      ↓
Upload Resume
      ↓
Application Saved
      ↓
Track Status
```

---

### Admin

```
Login
      ↓
Dashboard
      ↓
Add Job
      ↓
Edit/Delete Job
      ↓
View Applications
      ↓
Download Resume
      ↓
Update Status
      ↓
Logout
```

---

# Resume Upload

- Candidate uploads PDF resume while applying.
- Resume is stored inside:

```
uploads/resumes/
```

- Only the generated filename is stored in the database.

Example:

```
1785743829834_Resume.pdf
```

---

# Search Functionality

Candidates can search jobs by:

- Job Title

Search is implemented using JavaScript on the Jobs page.

---

# Dashboard

The Admin Dashboard displays:

- Total Jobs
- Total Users
- Total Applications

---

# Future Enhancements

- Spring Security with JWT Authentication
- Email Notification
- Forgot Password
- Company Panel
- Profile Update
- Resume Preview
- Job Categories
- Pagination
- Advanced Search Filters
- Interview Scheduling
- Admin Analytics Dashboard

---

# Screenshots

- Home Page
- Login Page
- Register Page
- Candidate Dashboard
- Jobs Page
- Apply Page
- Admin Dashboard
- Applications Page

(Add screenshots here)

---

# How to Run

### Clone Repository

```bash
git clone https://github.com/your-username/JobPortal.git
```

### Open Project

Open using IntelliJ IDEA.

### Configure MySQL

Create a database:

```sql
CREATE DATABASE jobportal;
```

Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/jobportal
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
```

### Run

Run:

```
JobPortalApplication.java
```

Open:

```
http://localhost:8080
```

---

# Author

**Abhishek Gadavi**

---

# License

This project is developed for learning and educational purposes.
