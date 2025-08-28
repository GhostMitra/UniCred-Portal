# Secure Edu Chain

Secure Edu Chain is a platform designed to streamline credential management and verification processes for students, universities, and recruiters.

## Table of Contents

- [Frontend](#frontend)
  - [Setup](#frontend-setup)
  - [Folder Structure](#frontend-folder-structure)
- [Backend](#backend)
  - [Setup](#backend-setup)
  - [Folder Structure](#backend-folder-structure)
  - [API Documentation](#api-documentation)
- [Tech Stack](#tech-stack)
- [Workflow](#workflow)
- [Architecture](#architecture)
- [Detailed Architecture Diagram](#detailed-architecture-diagram)

---

## Frontend

The frontend is built using React, TypeScript, and Vite. It provides user interfaces for students, universities, and recruiters.

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```zsh
   cd frontend
   ```

2. Install dependencies:
   ```zsh
   npm install
   ```

3. Start the development server:
   ```zsh
   npm run dev
   ```

4. Open the application in your browser at `http://localhost:3000`.

### Frontend Folder Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Shared components like Layout
│   │   ├── recruiter/       # Recruiter-specific components
│   │   ├── student/         # Student-specific components
│   │   ├── university/      # University-specific components
│   ├── lib/                 # API utilities
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Entry point
│   ├── index.css           # Global styles
│   ├── types.ts            # TypeScript types
```

---

## Backend

The backend is built using Node.js, TypeScript, and Prisma. It provides APIs for authentication, credential management, and more.

### Backend Setup

1. Navigate to the `backend` directory:
   ```zsh
   cd backend
   ```

2. Install dependencies:
   ```zsh
   npm install
   ```

3. Set up the database:
   - Apply Prisma migrations:
     ```zsh
     npx prisma migrate dev
     ```

4. Start the server:
   ```zsh
   npm run dev
   ```

5. The server will run at `http://localhost:4000`.

### Backend Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # Prisma schema
│   ├── migrations/          # Database migrations
├── src/
│   ├── routes/              # API route handlers
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   ├── server.ts            # Entry point
```

---

## API Documentation

### Authentication

#### POST `/auth/login`
- **Description**: Logs in a user.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt-token"
  }
  ```

#### POST `/auth/register`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully"
  }
  ```

### Credential Management

#### GET `/credentials`
- **Description**: Fetches all credentials for the logged-in user.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Bachelor's Degree",
      "issuedBy": "University A",
      "dateIssued": "2023-05-15"
    }
  ]
  ```

#### POST `/credentials`
- **Description**: Adds a new credential.
- **Request Body**:
  ```json
  {
    "title": "Bachelor's Degree",
    "issuedBy": "University A",
    "dateIssued": "2023-05-15"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Credential added successfully"
  }
  ```

### Metrics

#### GET `/metrics`
- **Description**: Fetches platform usage metrics.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "totalUsers": 1000,
    "totalCredentials": 5000
  }
  ```

---

## Tech Stack

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma

### Tools
- **Version Control**: Git
- **Package Manager**: npm
- **API Testing**: Postman
- **Deployment**: Docker

---

## Workflow

1. **Frontend**:
   - User interacts with the React-based UI.
   - API calls are made to the backend for data.

2. **Backend**:
   - Handles authentication, credential management, and metrics.
   - Interacts with the PostgreSQL database via Prisma ORM.

3. **Database**:
   - Stores user data, credentials, and platform metrics.

4. **Deployment**:
   - Docker containers are used for consistent deployment.


---

## Detailed Architecture Diagram

Below is the detailed architecture diagram for VisionX, illustrating the interaction between the frontend, backend, and database, along with external integrations like blockchain and authentication.

```
+-------------------+          +-------------------+          +-------------------+
|                   |          |                   |          |                   |
|   Frontend (UI)   +--------->|   Backend (API)   +--------->|   Database (DB)   |
|                   |          |                   |          |                   |
+-------------------+          +-------------------+          +-------------------+
        |                           |                           |
        |                           |                           |
        v                           v                           v
+-------------------+          +-------------------+          +-------------------+
|                   |          |                   |          |                   |
| React + Vite      |          | Node.js + Prisma  |          | PostgreSQL        |
|                   |          |                   |          |                   |
+-------------------+          +-------------------+          +-------------------+
        |                           |                           |
        |                           |                           |
        v                           v                           v
+-------------------+          +-------------------+          +-------------------+
|                   |          |                   |          |                   |
| Tailwind CSS      |          | Authentication    |          | User Data         |
|                   |          | Credential Mgmt   |          | Credentials       |
+-------------------+          +-------------------+          +-------------------+
        |                           |                           |
        |                           |                           |
        v                           v                           v
+-------------------+          +-------------------+          +-------------------+
|                   |          |                   |          |                   |
| Lucide Icons      |          | Blockchain API    |          | Metrics           |
|                   |          |                   |          |                   |
+-------------------+          +-------------------+          +-------------------+
```

### Explanation

1. **Frontend**:
   - Built with React and Vite for fast and interactive user interfaces.
   - Styled using Tailwind CSS for a modern look.
   - Utilizes Lucide Icons for visual elements.

2. **Backend**:
   - Node.js runtime with TypeScript for type safety.
   - Prisma ORM for database interactions.
   - Handles authentication, credential management, and blockchain integration.

3. **Database**:
   - PostgreSQL stores user data, credentials, and platform metrics.
   - Prisma migrations ensure schema consistency.

4. **Blockchain Integration**:
   - Verifies credentials securely using blockchain APIs.

5. **Authentication**:
   - JWT-based authentication for secure access control.

This architecture ensures scalability, security, and a seamless user experience.

---

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```zsh
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```zsh
   git commit -m "Add feature"
   ```
4. Push to the branch:
   ```zsh
   git push origin feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License.