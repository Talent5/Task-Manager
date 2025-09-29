# Task Manager

Full-stack task management application with Spring Boot backend and Angular frontend.

## Quick Start

### Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
Runs on `http://localhost:8080`

### Frontend (Angular)
```bash
cd frontend
npm install
ng serve
```
Runs on `http://localhost:4200`

## Features

- User authentication (JWT)
- Task CRUD operations
- Responsive UI
- Protected routes

## API Endpoints

**Auth (Public)**
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user

**Tasks (Protected)**
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

## Tech Stack

**Backend:** Spring Boot, Spring Security, JWT, H2 Database  
**Frontend:** Angular 18, TypeScript, RxJS