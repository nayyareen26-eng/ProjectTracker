// src/pages/TaskList.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography} from "@mui/material";
import TaskCard from "../components/Taskcard";
import TaskForm from "./TaskForm";
import api from "../services/api";

const TaskList = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [showForm] = useState(false);

  const fetchTasks = async () => {
    if (!projectId) return; // 🛑 safety check

    try {
      const res = await api.get(
        `/api/v1/project/${projectId}/task`
      );

      setTasks(res.data.tasks); 
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]); // ✅ FIXED

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        All Tasks
      </Typography>

      {/* OPTIONAL: role based button (ensure userRole exists) */}
      {/* 
      {(userRole === "PM" || userRole === "TL") && (
        <Button
          variant="contained"
          onClick={() => setShowForm(!showForm)}
          sx={{ mb: 2 }}
        >
          {showForm ? "Close Form" : "Create Task"}
        </Button>
      )} 
      */}

      {showForm && (
        <TaskForm
          projectId={projectId}   // ✅ important
          onTaskCreated={fetchTasks}
        />
      )}

      {tasks.length === 0 ? (
        <Typography>No tasks for this project</Typography>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task.task_id} task={task} />
        ))
      )}
    </Box>
  );
};

export default TaskList;
