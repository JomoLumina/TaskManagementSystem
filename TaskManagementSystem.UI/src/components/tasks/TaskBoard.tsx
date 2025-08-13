import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Button, Divider } from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import { TaskStatus } from "../../types/taskStatus";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../apiClient";
import AddTaskModal from "./AddTaskModal";
import { Task } from "../../types/task";
import { Column } from "../../types/column";
import LoadingProgress from "../loading/LoadingProgress";
import UpdateTaskModal from "./UpdateTaskModal";

const columnOrder: { key: number; id: string; title: string }[] = [
  { key: TaskStatus.TODO, id: "todo", title: "To Do" },
  { key: TaskStatus.IN_PROGRESS, id: "inprogress", title: "In Progress" },
  { key: TaskStatus.DONE, id: "done", title: "Done" },
];

const TaskBoard: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [columns, setColumns] = useState<Record<string, Column>>({
    todo: { id: "todo", title: "To Do", taskIds: [] },
    inprogress: { id: "inprogress", title: "In Progress", taskIds: [] },
    done: { id: "done", title: "Done", taskIds: [] },
  });
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Fetch tasks for current user
  useEffect(() => {
    if (!userId) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get<Task[]>(`/tasks?assignee=${userId}`);
        const tasksMap: Record<string, Task> = {};
        const newColumns = {
          todo: { id: "todo", title: "To Do", taskIds: [] },
          inprogress: { id: "inprogress", title: "In Progress", taskIds: [] },
          done: { id: "done", title: "Done", taskIds: [] },
        };

        res.data.forEach((task) => {
          tasksMap[task.id] = task;
          let colKey = "";
          if (task.status === TaskStatus.TODO) colKey = "todo";
          if (task.status === TaskStatus.IN_PROGRESS) colKey = "inprogress";
          if (task.status === TaskStatus.DONE) colKey = "done";
          if (colKey) newColumns[colKey].taskIds.push(task.id);
        });

        setTasks(tasksMap);
        setColumns(newColumns);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  // Drag end handler
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const startColumn = columns[source.droppableId];
    const finishColumn = columns[destination.droppableId];

    // Moving inside same column
    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...startColumn, taskIds: newTaskIds };
      setColumns({ ...columns, [newColumn.id]: newColumn });
      return;
    }

    // Moving across columns
    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...startColumn, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finishColumn, taskIds: finishTaskIds };

    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });

    // Determine new status from destination column
    let newStatus: TaskStatus = TaskStatus.TODO;
    if (destination.droppableId === "inprogress")
      newStatus = TaskStatus.IN_PROGRESS;
    if (destination.droppableId === "done") newStatus = TaskStatus.DONE;

    const updatedTask: Task = { ...tasks[draggableId], status: newStatus };
    setTasks((prev) => ({ ...prev, [draggableId]: updatedTask }));

    try {
      await apiClient.put(`/tasks/${draggableId}`, updatedTask);
    } catch (error) {
      console.error("Failed to update task status", error);
    }
  };

  if (loading) return <LoadingProgress />;

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          display="flex"
          gap={2}
          padding={2}
          height="80vh"
          overflow="auto"
          sx={{ backgroundColor: "#f4f5f7" }}
        >
          {columnOrder.map(({ id, title }) => {
            const column = columns[id];
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
                  {title}
                </Typography>

                {id === "todo" && (
                  <>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setAddModalOpen(true)}
                      sx={{ mb: 1 }}
                      fullWidth
                    >
                      <AddIcon /> Add Task
                    </Button>
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
                        backgroundColor: snapshot.isDraggingOver
                          ? "#e0e0e0"
                          : "inherit",
                        flexGrow: 1,
                        padding: 1,
                        borderRadius: 1,
                      }}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Paper
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                padding: 1,
                                marginBottom: 1,
                                backgroundColor: snapshot.isDragging
                                  ? "#bbdefb"
                                  : "white",
                                cursor: "grab",
                              }}
                              elevation={1}
                            >
                              <Typography noWrap>{task.title}</Typography>
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

      <AddTaskModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onTaskAdded={(task) => {
          setTasks((prev) => ({ ...prev, [task.id]: task }));
          setColumns((prev) => ({
            ...prev,
            todo: { ...prev.todo, taskIds: [task.id, ...prev.todo.taskIds] },
          }));
        }}
      />
    </>
  );
};

export default TaskBoard;
