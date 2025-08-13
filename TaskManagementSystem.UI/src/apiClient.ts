/// <reference types="vite/client" />
import axios from "axios";

const isHttps = window.location.protocol === "https:";

const baseURL = isHttps
  ? import.meta.env.VITE_BASE_API_HTTPS_URL || "https://localhost:5001/api"
  : import.meta.env.VITE_BASE_API_HTTP_URL || "http://localhost:7077/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post("/auth/register", data),

  login: (data: { username: string; password: string }) =>
    api.post("/auth/login", data),
};

export const tasksApi = {
  getTasks: (params?: { status?: string; assignee?: string }) =>
    api.get("/tasks", { params }),

  createTask: (data: {
    title: string;
    description?: string;
    priority?: string;
    assigneeId?: string;
  }) => api.post("/tasks", data),

  updateTask: (id: string, data: Partial<{ title: string; description: string; status: string; priority: string; assigneeId: string }>) =>
    api.put(`/tasks/${id}`, data),

  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
};

export const usersApi = {
  getUsers: () => api.get("/users"),
};

export default api;
