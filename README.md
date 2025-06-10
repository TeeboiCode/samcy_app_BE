# Samcy Node Backend

======================

A Node.js backend application for user authentication and management.

## Table of Contents

---

- [Getting Started](#getting-started)
- [Features](#features)
- [Dependencies](#dependencies)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)

## Getting Started

---

To get started with the application, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/samcy-node-backend.git`
2. Install dependencies: `npm install`
3. Create a `.env` file with the required environment variables (see [Environment Variables](#environment-variables) below)
4. Start the application: `npm start`

## Features

---

- User authentication using JSON Web Tokens (JWT)
- User registration and login
- Password reset and recovery
- User data management (CRUD operations)

## Dependencies

---

- `bcryptjs`: for password hashing and verification
- `cors`: for cross-origin resource sharing
- `dotenv`: for environment variable management
- `express`: for building the RESTful API
- `jsonwebtoken`: for JSON Web Token generation and verification
- `mysql2`: for database interactions
- `nodemailer`: for sending password reset emails

## API Endpoints

---

- `POST /api/auth/signup`: create a new user account
- `POST /api/auth/login`: login to an existing user account
- `POST /api/auth/forgot-password`: send a password reset email
- `POST /api/auth/reset-password`: reset a user's password

## Database Schema

---

The application uses a MySQL database with the following schema:

```sql
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15),
  password VARCHAR(255) NOT NULL,
  maritalStatus VARCHAR(20),
  dob DATE,
  state VARCHAR(50),
  localGovt VARCHAR(50),
  address VARCHAR(255),
  nationality VARCHAR(50),
  nin VARCHAR(20),
  department VARCHAR(50),
  gender VARCHAR(10),
  privacyPolicy BOOLEAN NOT NULL DEFAULT true,
  role ENUM('student', 'admin') NOT NULL DEFAULT 'student'
);
```

## Environment Variables

---

The application requires the following environment variables to be set:

- `JWT_SECRET`: a secret key for JSON Web Token generation and verification
- `EMAIL_USER`: the email address used for sending password reset emails
- `EMAIL_PASS`: the password for the email address used for sending password reset emails
- `PORT`: the port number for the application to listen on

## Contributing

---

Contributions to the application are welcome. Please submit a pull request with a clear description of the changes made.

Note: This is just a sample README file, and you should update it to reflect the specific details of your application.
