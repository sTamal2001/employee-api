# Employee Management API

A RESTful API built with Node.js, Express, and PostgreSQL.

## Tech Stack
- Node.js
- Express.js
- PostgreSQL (pg Pool)
- JWT Authentication
- Bcrypt
- Zod Validation
- Helmet, Morgan, Rate Limiting

## Features
- Employee CRUD with pagination and search
- JWT access token + refresh token auth
- Role-based access control (admin/user)
- Global error handling
- Input validation using Zod
- Security headers with Helmet
- Rate limiting

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL

### Installation
```bash
git clone <your-repo-url>
cd <project-folder>
npm install
```

### Environment Variables
Create a `.env` file:
```
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=
```

### Run
```bash
npm run dev
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login, get tokens |
| POST | /api/auth/refresh | Get new access token |
| POST | /api/auth/logout | Logout |

### Employees
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/employees | Bearer | Get all employees |
| POST | /api/employees | Admin | Create employee |
| PUT | /api/employees/:id | Admin | Update employee |
| DELETE | /api/employees/:id | Admin | Delete employee |