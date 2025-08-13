import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import apiClient from "../../apiClient";
import { useAuth } from "../../context/AuthContext";
import { Task } from "../../types/task";
import { TaskPriority } from "../../types/taskPriority";
import { TaskStatus } from "../../types/taskStatus";
import LoadingProgress from "../loading/LoadingProgress";
import { User } from "../../types/user";

interface TaskFormInputs {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string | undefined;
}

const schema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters"),
  status: yup.number().required("Status is required").oneOf([1, 2, 3]),
  priority: yup.number().required("Priority is required").oneOf([1, 2, 3]),
  assigneeId: yup.string().optional().nullable(),
});

interface UpdateTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate: (task: Task) => void;
  users?: User[];
}

const UpdateTaskModal: React.FC<UpdateTaskModalProps> = ({
  open,
  onClose,
  task,
  onUpdate,
}) => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormInputs>({
    defaultValues: {
      title: task ? task.title : "",
      description: task ? task.description : "",
      status: task?.status || TaskStatus.TODO,
      priority: task?.priority || TaskPriority.MEDIUM,
      assigneeId: task?.assigneeId || "",
    },
  });

  useEffect(() => {
    if (task && open) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId || undefined,
      });
      setLoading(false);
      setBackendError(null);
    }
  }, [task, open, reset]);

  useEffect(() => {
    if (isAdmin && open) {
      apiClient
        .get("/users")
        .then((res) => {
          setUsers(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch users", err);
        });
    }
  }, [isAdmin, open]);

  const onSubmit: SubmitHandler<TaskFormInputs> = async (data) => {
    if (!task) return;

    try {
      setLoading(true);
      setBackendError(null);

      const updatedTaskPayload = {
        ...task,
        ...data,
        creatorId: task.creatorId || user?.id,
      };

      const res = await apiClient.put<Task>(
        `/tasks/${task.id}`,
        updatedTaskPayload
      );

      onUpdate(res.data);
      setLoading(false);
      onClose();
    } catch (error: any) {
      console.error("Failed to update task:", error);
      setBackendError(
        error.response?.data?.message ||
          "Failed to update task. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Update Task</DialogTitle>
      <DialogContent>
        {loading && <LoadingProgress />}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          flexDirection="column"
          gap={2}
          mt={1}
        >
          {backendError && <Alert severity="error">{backendError}</Alert>}

          <TextField
            label="Title"
            fullWidth
            disabled={loading}
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            disabled={loading}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <TextField
            select
            label="Status"
            fullWidth
            defaultValue={task?.status}
            disabled={loading}
            {...register("status")}
          >
            <MenuItem value={TaskStatus.TODO}>Todo</MenuItem>
            <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
            <MenuItem value={TaskStatus.DONE}>Done</MenuItem>
          </TextField>

          <TextField
            select
            label="Priority"
            fullWidth
            defaultValue={task?.priority}
            disabled={loading}
            {...register("priority")}
          >
            <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
            <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
            <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
          </TextField>

          {isAdmin && (
            <TextField
              select
              label="Assigned To"
              fullWidth
              defaultValue={task?.assigneeId || ""}
              disabled={loading}
              {...register("assigneeId")}
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.username}
                </MenuItem>
              ))}
            </TextField>
          )}

          <DialogActions>
            <Button onClick={onClose} color="secondary" disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="secondary" /> : "Update Task"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTaskModal;