CREATE DATABASE user_leo;
USE user_leo;

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