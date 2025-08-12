import React from "react";

export type Task = {
  id: number;
  title: string;
  completed: boolean;
};
const tasks: Task[] = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
  { id: 3, title: "Task 3", completed: false }]

const TaskList: React.FC = () => (
  <ul className="task-list">
    {tasks.map(task => (
      <li key={task.id} className={task.completed ? "completed" : ""}>
        {task.title}
      </li>
    ))}
  </ul>
);

export default TaskList;