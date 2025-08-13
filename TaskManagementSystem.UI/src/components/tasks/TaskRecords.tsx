import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import apiClient from "../../apiClient";
import { Task } from "../../types/task";
import ViewTaskModel from "../tasks/ViewTaskModel";
import ConfirmModal from "../shared/ConfirmModel";
import LoadingProgress from "../loading/LoadingProgress";
import UpdateTaskModal from "./UpdateTaskModal";
import { TaskPriority } from "../../types/taskPriority";
import { TaskStatus } from "../../types/taskStatus";
import { User } from "../../types/user";
import { formatLabel } from "../../utils/functions";

const TaskRecords: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [creator, setCreator] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasksAndUsers = async () => {
      try {
        setLoading(true);
        const resTasks = await apiClient.get("/tasks");
        const resUsers = await apiClient.get("/users");
        setTasks(resTasks.data);
        setUsers(resUsers.data);
      } catch (error) {
        console.error("Failed to fetch tasks and users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasksAndUsers();
  }, []);

  const handleViewModalOpen = (task: Task) => {
    const _assignedTo = users.find((u: User) => u.id === task.assigneeId);
    const _creator = users.find((u: User) => u.id === task.creatorId);

    setAssignedTo(_assignedTo ? _assignedTo.username : "Unassigned");
    setCreator(_creator ? _creator.username : "Unknown");
    setSelectedTask(task);
    setViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setUpdateModalOpen(false);
    setSelectedTask(null);
  };

  const handleUpdateModalOpen = (task: Task) => {
    handleViewModalClose();
    setSelectedTask(task);
    setUpdateModalOpen(true);
  };

  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false);
    setSelectedTask(null);
  };

  const openConfirm = (id: string) => {
    handleViewModalClose();
    setTaskId(id);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setTaskId(null);
    setConfirmOpen(false);
  };

  const handleDelete = async () => {
    try {
      if (!taskId) return;
      await apiClient.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      closeConfirm();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleUpdate = async (task: Task) => {
    try {
      if (!taskId) return;
      const { data: updatedTask } = await apiClient.put(
        `/tasks/${task.id}`,
        task
      );
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
      );
      handleUpdateModalClose();
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <LoadingProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Task Records
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Priority</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Assigned to</strong></TableCell>
              <TableCell><strong>Created by</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    {formatLabel(TaskPriority[task.priority])}
                  </TableCell>
                  <TableCell>{formatLabel(TaskStatus[task.status])}</TableCell>
                  <TableCell>
                    {
                      users.find((u: User) => u.id === task.assigneeId)
                        ?.username
                    }
                  </TableCell>
                  <TableCell>
                    {users.find((u: User) => u.id === task.creatorId)?.username}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="secondary"
                      onClick={() => handleViewModalOpen(task)}
                      aria-label="view"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="success"
                      onClick={() => handleUpdateModalOpen(task)}
                      aria-label="update"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => openConfirm(task.id)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ViewTaskModel
        open={viewModalOpen}
        onClose={handleViewModalClose}
        task={selectedTask}
        assignedTo={assignedTo}
        creator={creator}
        onDelete={openConfirm}
        onUpdate={handleUpdateModalOpen}
      />

      <ConfirmModal
        open={confirmOpen}
        question="Are you sure you want to delete this task?"
        title="Confirm Deletion"
        onConfirm={handleDelete}
        onCancel={closeConfirm}
      />

      <UpdateTaskModal
        open={updateModalOpen}
        onClose={handleUpdateModalClose}
        task={selectedTask}
        onUpdate={handleUpdate}
      />
    </Box>
  );
};

export default TaskRecords;
