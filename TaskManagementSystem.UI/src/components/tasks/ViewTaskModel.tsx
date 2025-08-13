import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { TaskStatus } from "../../types/taskStatus";
import { TaskPriority } from "../../types/taskPriority";
import { Task } from "../../types/task";
import moment from "moment";
import { formatLabel } from "../../utils/functions";

interface ViewTaskModelProps {
  open: boolean;
  task: any | null;
  assignedTo: string | null;
  creator: string | null;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const ViewTaskModel: React.FC<ViewTaskModelProps> = ({
  open,
  task,
  assignedTo,
  creator,
  onClose,
  onUpdate,
  onDelete,
}) => {
  if (!task) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Task Details</DialogTitle>
      <DialogContent dividers>
      <Stack spacing={1}>
          <Typography variant="h6">{task.title}</Typography>
          <Typography variant="body1">{task.description}</Typography>
          <Typography variant="body2">
            <strong>Status:</strong> {formatLabel(TaskStatus[task.status])}
          </Typography>
          <Typography variant="body2">
            <strong>Priority:</strong> {formatLabel(TaskPriority[task.priority])}
          </Typography>
          {task.assigneeId && (
            <Typography variant="body2">
              <strong>Assigned to:</strong> {assignedTo || "Unassigned"}
            </Typography>
          )}
          <Typography variant="body2">
            <strong>Created by:</strong> {creator || "Unknown"}
          </Typography>
            <Typography variant="body2">
                <strong>Created at:</strong>{" "}
               {moment(task.createdAt).format("MMMM Do YYYY, h:mm a")}
            </Typography>
            <Typography variant="body2">
                <strong>Updated at:</strong>{" "}
                {moment(task.UpdatedAt).format("MMMM Do YYYY, h:mm a")}
            </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onUpdate(task)}
          variant="outlined"
          color="success">
          Update
        </Button>
        <Button
          onClick={() => onDelete(task.id)}
          variant="outlined"
          color="error"
        >
          Delete
        </Button>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewTaskModel;
