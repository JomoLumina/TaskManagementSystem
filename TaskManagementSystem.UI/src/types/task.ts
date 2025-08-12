import { TaskPriority } from "./taskPriority";
import { TaskStatus } from "./taskStatus.ts";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
};