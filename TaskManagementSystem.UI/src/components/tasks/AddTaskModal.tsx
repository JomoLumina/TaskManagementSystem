import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Alert,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../apiClient";
import { TaskPriority } from "../../types/taskPriority";
import { Task } from "../../types/task";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingProgress from "../loading/LoadingProgress";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onTaskAdded: (task: Task) => void;
}

interface AddTaskFormInputs {
  title: string;
  description: string;
  priority: TaskPriority;
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
  priority: yup.number().required("Priority is required").oneOf([1, 2, 3]),
});

export default function AddTaskModal({
  open,
  onClose,
  onTaskAdded,
}: AddTaskModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddTaskFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      priority: TaskPriority.MEDIUM,
    },
  });

  const onSubmit: SubmitHandler<AddTaskFormInputs> = async (data) => {
    try {
      setLoading(true);
      setBackendError(null);

      const res = await apiClient.post(`/tasks`, {
        ...data,
        assigneeId: user?.id,
        creatorId: user?.id,
      });

      if (res.status !== 201) {
        throw new Error("Unexpected server response");
      }

      onTaskAdded(res.data);
      reset();
      onClose();
    } catch (error: any) {
      console.error("Failed to add task:", error);
      setBackendError(
        error.response?.data?.message || "Failed to add task. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Task</DialogTitle>
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
          {loading && <LoadingProgress />}
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
            label="Priority"
            fullWidth
            defaultValue={3}
            disabled={loading}
            {...register("priority")}
          >
            <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
            <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
            <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
          </TextField>

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
              {loading ? <CircularProgress size={24} /> : "Add Task"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
