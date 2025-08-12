# Task Management System

A simple **Trello-style** task board application with three columns: **To Do**, **In Progress**, and **Done**.  
The project is split into two main parts:  
- **Frontend (React + Vite)** — in `/TaskManagementSystem.UI`
- **Backend (.NET API)** — in `/TaskManagementSystem.API`

---

## 📋 Description

The Task Management System helps teams organize their work visually, manage progress, and keep track of completed tasks.  
It supports creating, updating, and moving tasks between different stages of completion.  

---

## 🛠 Tech Stack

**Frontend:**  
- React 19 (Vite)
- TypeScript
- SCSS
- MUI (Material-UI)

**Backend:**  
- .NET 8 Web API
- C#
- Entity Framework Core
- SQL Server

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1️⃣ Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS recommended)
- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or [SQL Server LocalDB](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb)

---

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/TaskManagementSystem.git
cd TaskManagementSystem
```

---

### 3️⃣ Setting Up the Backend (`TaskManagementSystem.API`)

#### Navigate to the API folder:
```bash
cd TaskManagementSystem.API
```

#### Restore NuGet packages:
```bash
dotnet restore
```

#### Apply EF Core migrations (optional if DB schema is already created):
```bash
dotnet ef database update
```

#### Run the API:
```bash
dotnet run
```

By default, the API will run on:
```
https://localhost:7077
http://localhost:5100
```

---

### 4️⃣ Setting Up the Frontend (`TaskManagementSystem.UI`)

#### Navigate to the UI folder:
```bash
cd ../TaskManagementSystem.UI
```

#### Install dependencies:
```bash
npm install
```

#### Start the development server:
```bash
npm run dev
```

By default, the UI will run on:
```
http://localhost:9000
```

---

### 5️⃣ Configuration

You can update environment variables in the following files:

- **Frontend:** `/TaskManagementSystem.UI/.env`  
  Example:
  ```env
  VITE_API_BASE_URL=https://localhost:7077/api

---

## ⚡ Quick Start (Run Both Frontend & Backend Together)

You can run both projects simultaneously using two terminals or a single command with [concurrently](https://www.npmjs.com/package/concurrently).

### Option 1: Two separate terminals
```bash
# Terminal 1 - Run backend
cd TaskManagementSystem.API
dotnet run

# Terminal 2 - Run frontend
cd TaskManagementSystem.UI
npm run dev
```

### Option 2: Single command with concurrently
1. Install `concurrently` in the root folder:
```bash
npm install -g concurrently
```

2. Create a script in the **root package.json**:
```json
"scripts": {
  "dev": "concurrently \"cd TaskManagementSystem.API && dotnet run\" \"cd TaskManagementSystem.UI && npm run dev\""
}
```

3. Run:
```bash
npm run dev
```

This will start both the backend and frontend in one go.

---

## 📌 Features
- Create, edit, and delete tasks
- Drag and drop between columns
- Responsive UI with Material-UI
- RESTful API backend

---

## 📜 License
This project is licensed under the MIT License.
