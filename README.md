# Smart Task Manager

A full-stack application built with the MERN stack (MongoDB, Express, React, Node.js) featuring single authentication and role-based access control (RBAC).

## 🚀 Tech Stack

**Frontend:** React.js (Vite), Axios, React-Router
**Backend:** Node.js, Express.js  
**Database:** MongoDB with Mongoose  
**Security/Auth:** JSON Web Tokens (JWT), bcryptjs, express-validator

---

## 🛠️ Features

* **Authentication System:** Secure registration and login using JWT.
* **Role-Based Access Control:** Separate roles for `user` and `admin`. Admin can view and delete all tasks across the system.
* **Task Management (CRUD):** Users can create, view, update, and delete their tasks.
* **Security:** Passwords hashed via bcrypt, centralized error handling, properly validated endpoints.

---

## ⚙️ Setup Instructions

### 1. Requirements

* Node.js (LTS version)
* Local MongoDB installed and running (or a MongoDB Atlas URI)

### 2. Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Configure environments
# A .env file is already provided for local setup with default credentials:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/taskmanager
# JWT_SECRET=supersecretjwtkey_change_in_production

# 4. Start the backend server
npm run dev
# Alternatively: node server.js
```

### 3. Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```
*(The frontend will automatically proxy/connect to `http://localhost:5000/api/v1` for APIs.)*

---

## 🔌 API Endpoints

### Auth (`/api/v1/auth`)
| Method | Endpoint    | Description          | Access |
| ------ | ----------- | -------------------- | ------ |
| POST   | `/register` | Register a new user  | Public |
| POST   | `/login`    | Login an existing user| Public |

*(Note: During registration, you can pass `"role": "admin"` to test admin functionalities).*

### Tasks (`/api/v1/tasks`)
| Method | Endpoint    | Description          | Access       |
| ------ | ----------- | -------------------- | ------------ |
| POST   | `/`         | Create a task        | Private/User |
| GET    | `/`         | Get user's tasks     | Private/User |
| PUT    | `/:id`      | Update a task        | Private/User |
| DELETE | `/:id`      | Delete a task        | Private/User |

### Admin Tasks (`/api/v1/tasks/all`)
| Method | Endpoint    | Description              | Access        |
| ------ | ----------- | ------------------------ | ------------- |
| GET    | `/all`      | Get ALL users' tasks     | Private/Admin |
| DELETE | `/all/:id`  | Delete ANY user's task   | Private/Admin |

