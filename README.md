# Task Manager API

A RESTful API built with NestJS for managing tasks with user authentication.

## Features

- User authentication with JWT
- CRUD operations for tasks
- Task filtering and sorting
- MongoDB integration
- API documentation with Swagger
- Input validation
- Error handling

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- MongoDB (running locally or have a connection string)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Iphycodes/task-manager-api.git
cd task-manager-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_jwt_secret_key
```

4. Start the application:
```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

The API will be available at `http://localhost:5000`

## API Documentation

Once the application is running, you can access the Swagger documentation at:
`http://localhost:5000/api-docs`

### Main Endpoints

#### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token

#### Tasks
- `GET /tasks` - Get all tasks (requires authentication)
- `POST /tasks` - Create a new task
- `GET /tasks/:id` - Get a specific task
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### Query Parameters

Tasks can be filtered and sorted using the following query parameters:

- `status` - Filter by status (pending, in-progress, completed)
- `sortBy` - Sort by creation date (asc/desc)
- `page` - Page number for pagination
- `limit` - Number of items per page
- `search` - Search tasks by title

Example:
```
GET /tasks?status=pending&sortBy=desc&page=1&limit=10
```

## Request Examples

### Register a New User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create a Task
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the NestJS task manager project",
    "status": "pending"
  }'
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `500` - Internal Server Error

## Testing

Run the test suite:
```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.