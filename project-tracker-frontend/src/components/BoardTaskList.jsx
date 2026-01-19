import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import TaskCard from "./Taskcard";
import CreateTaskModal from "./CreateTaskModal";
import api from "../services/api";

const BoardTaskList = () => {
  const { boardId, projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [open, setOpen] = useState(false);

  // Fetch project members
  const fetchProjectMembers = useCallback(async () => {
    try {
      const res = await api.get(`/api/v1/project-members/project/${projectId}`);
      setAssignees(res.data || []);
    } catch (err) {
      console.error("Failed to fetch project members:", err);
      setAssignees([]);
    }
  }, [projectId]);

  // Fetch board tasks
  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get(`/api/v1/board_task_mapping/board/${boardId}/task`);
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setTasks([]);
    }
  }, [boardId]);

  useEffect(() => {
    fetchProjectMembers();
    fetchTasks();
  }, [fetchProjectMembers, fetchTasks]);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Board Tasks</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Task
        </Button>
      </Box>

      {tasks.length === 0 && <Typography>No tasks in this board</Typography>}

      {tasks.map((task) => (
        <TaskCard key={task.task_id} task={task} assignees={assignees} />
      ))}

      {/* MODAL */}
      <CreateTaskModal
        open={open}
        onClose={() => setOpen(false)}
        projectId={projectId}
        boardId={boardId}
        refreshTasks={fetchTasks}
      />
    </Box>
  );
};

export default BoardTaskList;
