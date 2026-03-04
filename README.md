# Employee Management API

A RESTful backend API built using Node.js, Express, and PostgreSQL.

## 🚀 Tech Stack
- Node.js
- Express.js
- PostgreSQL (pg Pool)
- REST API

## 📌 Features
- Create employee
- Get employees with pagination
- Search employees (case-insensitive)
- Update employee
- Delete employee
- Validation for required fields
- Duplicate email handling
- Proper HTTP status codes
- Global error handling middleware

## 📂 Project Structure
src/
- controllers/
- routes/
- config/
- middleware/
- utils/

## 🔍 Pagination Example
GET /api/employees?page=1&limit=5

## 🔎 Search Example
GET /api/employees?search=tam

## ▶️ Run Locally
npm install  
npm run dev