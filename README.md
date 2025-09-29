# Simple Task Manager

A full-stack task management application built with Spring Boot (backend) and Angular (frontend).

## Project Structure

```
Task Manager/
├── backend/          # Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/taskmanager/
│   │   │   │   ├── controller/     # REST controllers
│   │   │   │   ├── model/         # JPA entities
│   │   │   │   ├── repository/    # Data repositories
│   │   │   │   ├── service/       # Business logic
│   │   │   │   ├── dto/           # Data Transfer Objects
│   │   │   │   ├── config/        # Security & JWT configuration
│   │   │   │   └── exception/     # Custom exceptions
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
└── frontend/         # Angular SPA
    ├── src/
    │   ├── app/
    │   │   ├── components/        # Angular components
    │   │   ├── services/          # HTTP services
    │   │   ├── guards/            # Route guards
    │   │   ├── interceptors/      # HTTP interceptors
    │   │   └── app.routes.ts      # Routing configuration
    │   └── index.html
    ├── package.json
    └── angular.json
```

## Features

### Backend (Spring Boot)
- **Authentication**: JWT-based authentication with Spring Security
- **User Management**: User registration and login
- **Task Management**: CRUD operations for tasks
- **Database**: H2 in-memory database
- **Security**: Protected API endpoints with JWT validation
- **Logging**: Comprehensive logging with SLF4J

### Frontend (Angular)
- **Authentication Flow**: Login/Register pages with JWT storage
- **Route Protection**: Auth guard for protected routes
- **Task Management**: Complete task CRUD interface
- **Responsive Design**: Mobile-friendly UI
- **Real-time Updates**: Immediate UI updates after operations
- **HTTP Interceptor**: Automatic JWT token attachment

## API Endpoints

### Authentication (Public)
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Tasks (Protected - Requires JWT)
- `GET /api/tasks` - Get all tasks for authenticated user
- `GET /api/tasks/{id}` - Get specific task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update existing task
- `DELETE /api/tasks/{id}` - Delete task

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build and run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   
   The backend will start on `http://localhost:8080`

3. H2 Database Console (optional):
   - Access: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: (leave empty)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```
   
   The frontend will start on `http://localhost:4200`

## Usage

1. **Start both applications** (backend on port 8080, frontend on port 4200)
2. **Register a new account** at `http://localhost:4200/register`
3. **Login** with your credentials at `http://localhost:4200/login`
4. **Manage tasks** on the dashboard:
   - Create new tasks
   - Mark tasks as completed/pending
   - Edit task details
   - Delete tasks
   - Filter tasks by status

## Security Features

- Passwords are hashed using BCrypt
- JWT tokens for stateless authentication
- Protected API endpoints
- Automatic token refresh handling
- Secure logout functionality

## Technologies Used

### Backend
- **Spring Boot 3.x** - Main framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Data persistence
- **H2 Database** - In-memory database
- **JWT (jjwt)** - Token-based authentication
- **BCrypt** - Password hashing
- **Maven** - Build tool
- **SLF4J/Logback** - Logging

### Frontend
- **Angular 18** - Frontend framework
- **TypeScript** - Programming language
- **RxJS** - Reactive programming
- **Angular Router** - Navigation
- **Angular Forms** - Form handling
- **CSS3** - Styling
- **Angular CLI** - Development tools

## Development Notes

- The application uses CORS configuration to allow frontend-backend communication
- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- H2 database is configured for development (consider PostgreSQL/MySQL for production)
- Both applications include comprehensive error handling and validation

## Future Enhancements

- Task categories and tags
- Due dates and reminders
- Task priority levels
- File attachments
- Team collaboration features
- Email notifications
- Mobile application
- Production database integration