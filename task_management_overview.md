
# Task Management Application - Technical Overview

## 1. Overview
The **Task Management Application** is a web-based platform designed to streamline task creation, assignment, and tracking within a team. 
It allows administrators to manage tasks, set priorities, and assign them to team members, while users can update statuses and manage their workload efficiently.

---

## 2. Key Features
- **Task Creation & Assignment** – Admins can create tasks and assign them to specific users.
- **Priority Levels** – Tasks have Low, Medium, or High priority.
- **Status Management** – Tasks can be updated from "Pending" to "In Progress" or "Completed".
- **Authentication & Authorization** – Secure access based on user roles.
- **Responsive UI** – Built with Material UI and React for a seamless experience.
- **API Integration** – Uses RESTful APIs to communicate with the backend.

---

## 3. Technology Stack

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| **Frontend** | React, TypeScript, Material UI, Vite    |
| **Backend**  | C# ASP.NET Core Web API                  |
| **Database** | In-Memory DB / SQL Server               |
| **Auth**     | JWT (JSON Web Token)                    |
| **HTTP**     | Axios                                   |
| **Validation** | Yup, React Hook Form                  |

---

## 4. Architecture Diagram
```plaintext
[React Frontend] <----> [ASP.NET Core Web API] <----> [SQL Server / In-Memory DB]
```
- The **frontend** communicates with the backend using Axios over HTTPS.
- The **backend** serves RESTful endpoints for tasks, authentication, and user management.
- The **database** persists task and user data.

---

## 5. API Endpoints

### **Authentication**
| Method | Endpoint         | Description           | Auth Required |
|--------|------------------|-----------------------|--------------|
| POST   | `/auth/login`    | User login            | No           |
| POST   | `/auth/register` | User registration     | No           |

### **Tasks**
| Method | Endpoint         | Description             | Auth Required |
|--------|------------------|-------------------------|--------------|
| GET    | `/tasks`         | Get all tasks           | Yes          |
| POST   | `/tasks`         | Create a new task       | Yes (Admin)  |
| PUT    | `/tasks/{id}`    | Update task details     | Yes          |
| DELETE | `/tasks/{id}`    | Delete a task           | Yes (Admin)  |

### **Users**
| Method | Endpoint         | Description             | Auth Required |
|--------|------------------|-------------------------|--------------|
| GET    | `/users`         | Get all users           | Yes (Admin)  |

---

## 6. Example Request & Response

**POST /tasks**
\`\`\`json
{
  "title": "Update Documentation",
  "description": "Prepare the project documentation for handover.",
  "priority": 2,
  "assigneeId": "user-123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "task-456",
  "title": "Update Documentation",
  "description": "Prepare the project documentation for handover.",
  "priority": 2,
  "status": "Pending",
  "assigneeId": "user-123",
  "creatorId": "admin-001"
}
\`\`\`

---

## 7. Installation & Setup

### **Frontend**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### **Backend**
\`\`\`bash
cd backend
dotnet restore
dotnet run
\`\`\`

---

## 8. Security Considerations
- JWT tokens are used for authentication.
- Input validation using Yup and ASP.NET ModelState.
- Role-based access control for Admin and User roles.
- HTTPS for secure data transfer.

---

## 9. Future Enhancements
- Integration with external services (e.g., email notifications).
- Drag-and-drop task management.
- Real-time updates via WebSockets.
- Audit logs for task changes.

---

## 10. Contributors
- **Frontend Developer:** [Name]
- **Backend Developer:** [Name]
- **UI/UX Designer:** [Name]
