import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import TaskCard from "../components/TaskCard";

import TaskForm from "./TaskForm";
import api from "../services/api";

const TaskList = ({ userRole }) => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/api/v1/task/list");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        All Tasks
      </Typography>

      {(userRole === "PM" || userRole === "TL") && (
        <Button variant="contained" onClick={() => setShowForm(!showForm)} sx={{ mb: 2 }}>
          {showForm ? "Close Form" : "Create Task"}
        </Button>
      )}

      {showForm && <TaskForm onTaskCreated={fetchTasks} />}

      {tasks.map((task) => (
        <TaskCard key={task.task_id} task={task} />
      ))}
    </Box>
  );
};

export default TaskList;