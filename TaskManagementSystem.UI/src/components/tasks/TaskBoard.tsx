import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

// Types
type Task = {
  id: string;
  title: string;
};

type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

// Initial data
const initialTasks: Record<string, Task> = {
  "task-1": { id: "task-1", title: "Buy groceries" },
  "task-2": { id: "task-2", title: "Write blog post" },
  "task-3": { id: "task-3", title: "Fix bugs" },
  "task-4": { id: "task-4", title: "Update resume" },
};

const initialColumns: Record<string, Column> = {
  todo: {
    id: "todo",
    title: "To Do",
    taskIds: ["task-1", "task-2"],
  },
  inprogress: {
    id: "inprogress",
    title: "In Progress",
    taskIds: ["task-3"],
  },
  done: {
    id: "done",
    title: "Done",
    taskIds: ["task-4"],
  },
};

const columnOrder = ["todo", "inprogress", "done"];

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [columns, setColumns] = useState(initialColumns);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Handle drag end
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const startColumn = columns[source.droppableId];
    const finishColumn = columns[destination.droppableId];

    // Moving within same column
    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...startColumn, taskIds: newTaskIds };

      setColumns({ ...columns, [newColumn.id]: newColumn });
      return;
    }

    // Moving to different column
    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...startColumn, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finishColumn, taskIds: finishTaskIds };

    setColumns({ ...columns, [newStart.id]: newStart, [newFinish.id]: newFinish });
  };

  // Add new task to To Do
  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const id = `task-${Date.now()}`;
    const newTask: Task = { id, title: newTaskTitle.trim() };

    setTasks({ ...tasks, [id]: newTask });

    const newTaskIds = Array.from(columns.todo.taskIds);
    newTaskIds.unshift(id);

    const newTodoColumn = { ...columns.todo, taskIds: newTaskIds };

    setColumns({ ...columns, todo: newTodoColumn });
    setNewTaskTitle("");
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        display="flex"
        gap={2}
        padding={2}
        height="80vh"
        overflow="auto"
        sx={{ backgroundColor: "#f4f5f7" }}
      >
        {columnOrder.map((columnId) => {
          const column = columns[columnId];
          const columnTasks = column.taskIds.map((taskId) => tasks[taskId]);

          return (
            <Paper
              key={column.id}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                maxHeight: "100%",
                overflowY: "auto",
                padding: 2,
              }}
              elevation={3}
            >
              <Typography variant="h6" textAlign="center" mb={2}>
                {column.title}
              </Typography>

              {columnId === "todo" && (
                <>
                  <Box display="flex" mb={2}>
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Add new task"
                      fullWidth
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addTask();
                      }}
                    />
                    <Button onClick={addTask} variant="contained" sx={{ ml: 1 }}>
                      Add
                    </Button>
                  </Box>
                  <Divider />
                </>
              )}

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      minHeight: "50px",
                      backgroundColor: snapshot.isDraggingOver ? "#e0e0e0" : "inherit",
                      flexGrow: 1,
                      padding: 1,
                      borderRadius: 1,
                    }}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              padding: 1,
                              marginBottom: 1,
                              backgroundColor: snapshot.isDragging ? "#bbdefb" : "white",
                              cursor: "grab",
                            }}
                            elevation={1}
                          >
                            <Typography>{task.title}</Typography>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Paper>
          );
        })}
      </Box>
    </DragDropContext>
  );
};

export default TaskBoard;
