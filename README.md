# Job Portal

A full-stack **Job Portal Application** built using **Spring Boot, Spring Security, JWT, MySQL, HTML, CSS, and JavaScript**.

The application provides separate functionality for **Candidates** and **Administrators**, including secure authentication, job management, job applications, resume upload, and role-based authorization.

---

## Features

### Candidate Features

* User registration and login
* JWT-based authentication
* Browse available jobs
* View job details
* Apply for jobs
* Upload resume while applying
* View previously submitted applications
* Track application status
* Secure access to candidate-specific pages

### Admin Features

* Separate Admin role
* Secure admin authentication
* Add new job openings
* View available jobs
* Manage job listings
* View candidate applications
* Review submitted resumes
* Update application status
* Role-based access using Spring Security

---

## Security

The application uses **Spring Security with JWT authentication**.

Authentication flow:

```text
User Login
    ↓
Credentials verified
    ↓
JWT Token generated
    ↓
Token stored on frontend
    ↓
Authorization header sent with API requests
    ↓
JWT filter validates token
    ↓
Spring Security checks user role
    ↓
Protected resource is accessed
```

Two main roles are supported:

```text
USER  → Candidate
ADMIN → Administrator
```

Role-based authorization prevents candidates from accessing administrator functionality.

---

## Tech Stack

### Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate
* REST APIs
* Maven

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API
* Local Storage

### Database

* MySQL

### Development Tools

* IntelliJ IDEA
* MySQL Workbench
* Postman
* Git
* GitHub

---

## Project Structure

```text
JobPortal/
│
├── src/
│   └── main/
│       │
│       ├── java/
│       │   └── org/example/jobportal/
│       │       │
│       │       ├── controller/
│       │       ├── dto/
│       │       ├── model/
│       │       ├── repository/
│       │       ├── security/
│       │       ├── service/
│       │       └── JobPortalApplication.java
│       │
│       └── resources/
│           │
│           ├── static/
│           │   ├── css/
│           │   ├── js/
│           │   ├── admin.html
│           │   ├── apply.html
│           │   ├── dashboard.html
│           │   ├── index.html
│           │   ├── jobs.html
│           │   ├── login.html
│           │   └── register.html
│           │
│           └── application.properties
│
├── uploads/
├── pom.xml
├── .gitignore
└── README.md
```

---

## Main Modules

### Authentication Module

Handles:

* User registration
* User login
* Password encryption
* JWT generation
* JWT validation
* Role-based authorization

Important classes include:

```text
SecurityConfig
JwtService
JwtAuthenticationFilter
CustomUserDetailsService
AuthController
AuthResponse
```

---

### Job Module

Responsible for:

* Adding jobs
* Fetching jobs
* Displaying available job openings
* Managing job information

Example endpoint:

```http
GET /api/jobs
```

---

### Application Module

Responsible for candidate job applications.

Candidates can:

* Apply to a job
* Upload a resume
* View their submitted applications
* Track application status

Example endpoints:

```http
POST /api/applications/apply/{jobId}/{userId}

GET /api/applications/user/{userId}
```

---

## JWT Authentication

After successful login, the backend generates a JWT token.

The frontend sends the token with protected API requests using:

```http
Authorization: Bearer <JWT_TOKEN>
```

Example:

```javascript
fetch("/api/applications/user/1", {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
```

The `JwtAuthenticationFilter` validates the token before allowing access to protected resources.

---

## Password Security

Passwords are encrypted using:

```text
BCryptPasswordEncoder
```

Plain-text passwords are never stored directly in the database.

---

## Database Configuration

Create a MySQL database:

```sql
CREATE DATABASE jobportal;
```

Configure `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/jobportal
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Do not commit real database passwords or secret JWT keys to GitHub.

For production applications, use environment variables.

---

## Running the Project

### 1. Clone the repository

```bash
git clone https://github.com/Abhishek-gadavi/JobPortal.git
```

### 2. Navigate to the project

```bash
cd JobPortal
```

### 3. Configure MySQL

Create the database:

```sql
CREATE DATABASE jobportal;
```

Update your database credentials in:

```text
src/main/resources/application.properties
```

### 4. Run the Spring Boot application

Using Maven:

```bash
mvn spring-boot:run
```

Or run:

```text
JobPortalApplication.java
```

from IntelliJ IDEA.

### 5. Open the application

```text
http://localhost:8080
```

---

## User Registration

Candidates can create an account from:

```text
/register.html
```

After registration, users can sign in from:

```text
/login.html
```

---

## Candidate Dashboard

After successful authentication, candidates are redirected to:

```text
/dashboard.html
```

The dashboard displays information such as:

* Available jobs
* Number of applications
* Submitted applications
* Application status

---

## Admin Dashboard

Users with the `ADMIN` role are redirected to:

```text
/admin.html
```

The admin dashboard can be used to:

* Add jobs
* Manage job openings
* Review applications
* Manage candidate information

---

## Role-Based Access Control

Spring Security controls access based on roles.

Example:

```java
.requestMatchers("/api/admin/**").hasRole("ADMIN")
.requestMatchers("/api/applications/**").authenticated()
.requestMatchers("/api/jobs/**").permitAll()
```

This ensures that administrator functionality cannot be accessed by normal candidates.

---

## Resume Uploads

Candidate resumes are stored inside:

```text
uploads/resumes/
```

This directory is intentionally ignored by Git.

`.gitignore` contains:

```gitignore
uploads/resumes/
```

This prevents uploaded resumes and personal documents from being committed to the GitHub repository.

For production deployment, resumes should preferably be stored using cloud storage such as:

* AWS S3
* Azure Blob Storage
* Google Cloud Storage

---

## API Overview

| Method | Endpoint                                   | Description              |
| ------ | ------------------------------------------ | ------------------------ |
| POST   | `/api/users/register`                      | Register a new user      |
| POST   | `/api/users/login`                         | Authenticate user        |
| GET    | `/api/jobs`                                | Get available jobs       |
| POST   | `/api/applications/apply/{jobId}/{userId}` | Apply for a job          |
| GET    | `/api/applications/user/{userId}`          | View user's applications |

Additional endpoints can be added for admin job and application management.

---

## Application Workflow

```text
Candidate
   ↓
Register
   ↓
Login
   ↓
JWT Generated
   ↓
Browse Jobs
   ↓
Select Job
   ↓
Submit Application
   ↓
Upload Resume
   ↓
View Application Status
```

Admin workflow:

```text
Admin Login
   ↓
JWT Authentication
   ↓
Admin Dashboard
   ↓
Manage Jobs
   ↓
Review Applications
   ↓
Update Application Status
```

---

## Future Enhancements

Future improvements can include:

* Email notifications
* Forgot password functionality
* Search and filter jobs
* Job recommendations
* Pagination
* Company profiles
* Candidate profile management
* Admin analytics dashboard
* Interview scheduling
* Application status notifications
* Cloud resume storage
* Refresh-token authentication
* Docker deployment
* CI/CD integration

---

## Git Workflow

To commit future changes:

```bash
git status
git add .
git commit -m "Describe your changes"
git push origin main
```

Uploaded resumes are excluded automatically because of `.gitignore`.

---

## Project Highlights

* Full-stack web application
* RESTful API architecture
* JWT-based authentication
* Spring Security integration
* Role-based authorization
* Candidate and Admin modules
* MySQL database integration
* Resume upload functionality
* Secure password encryption
* Frontend-backend integration
* Git and GitHub version control

---

## Author

**Abhishek Gadavi**

GitHub:
`https://github.com/Abhishek-gadavi`

Project Repository:
`https://github.com/Abhishek-gadavi/JobPortal`

---

## License

This project is developed for educational, learning, and portfolio purposes.
