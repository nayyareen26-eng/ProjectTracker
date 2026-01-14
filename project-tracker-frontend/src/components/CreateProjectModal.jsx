import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Button,
  Box,
  IconButton,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import axios from "axios";

const ROLE_OPTIONS = [
  { label: "Team Leader", role_id: 2 },
  { label: "Contributor", role_id: 3 }
];

export default function CreateProjectModal({ open, onClose, teamId, onCreated }) {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [users, setUsers] = useState([]);

  const [assignments, setAssignments] = useState([
    { user_id: null, role_id: null }
  ]);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  /* 🔹 Fetch users */
  useEffect(() => {
    if (!open) return;

    axios
      .get("http://127.0.0.1:8000/api/v1/user/")
      .then((res) => setUsers(res.data))
      .catch(console.error);
  }, [open]);

  /* 🔹 Avoid duplicate users */
  const selectedUserIds = assignments.map((a) => a.user_id);

  const handleChange = (index, field, value) => {
    const updated = [...assignments];
    updated[index][field] = value;
    setAssignments(updated);
  };

  const addRow = () => {
    setAssignments([...assignments, { user_id: null, role_id: null }]);
  };

  const removeRow = (index) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  /* ✅ FINAL CREATE HANDLER */
  const handleCreate = async () => {

    
  try {
    const projectRes = await axios.post(
      "http://127.0.0.1:8000/api/v1/project/",
      {
        team_id: Number(teamId),
        project_title: projectTitle,
        project_description: projectDescription,
        project_manager: Number(loggedInUser.user_id),
        created_by: Number(loggedInUser.user_id)
      }
    );

    const projectId = projectRes.data.project_id;

    for (const a of assignments) {
      if (!a.user_id || !a.role_id) continue;

      await axios.post(
        "http://127.0.0.1:8000/api/v1/project-members/",
        {
          project_id: projectId,
          user_id: Number(a.user_id),
          role_id: Number(a.role_id)
        }
      );
    }

    alert("Project created successfully 🎉");
    onCreated();
    onClose();
  } catch (err) {
    console.error("Backend error:", err.response?.data || err);
    alert("Project creation failed");
  }
};

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Create Project</DialogTitle>

      <DialogContent>
        <TextField
          label="Project Title"
          fullWidth
          margin="normal"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
        />

        <TextField
          label="Project Description"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        />

        <Typography mt={3} mb={1} fontWeight={600}>
          Assign Users
        </Typography>

        {assignments.map((row, index) => (
          <Box key={index} display="flex" gap={2} mb={2}>
            {/* USER */}
            <TextField
              select
              label="User"
              fullWidth
              value={row.user_id ?? ""}
              onChange={(e) =>
                handleChange(index, "user_id", Number(e.target.value))
              }
            >
              <MenuItem value="" disabled>
                Select user
              </MenuItem>

              {users
                .filter(
                  (u) =>
                    !selectedUserIds.includes(u.user_id) ||
                    u.user_id === row.user_id
                )
                .map((u) => (
                  <MenuItem key={u.user_id} value={u.user_id}>
                    {u.user_name}
                  </MenuItem>
                ))}
            </TextField>

            {/* ROLE */}
            <TextField
              select
              label="Role"
              fullWidth
              value={row.role_id ?? ""}
              onChange={(e) =>
                handleChange(index, "role_id", Number(e.target.value))
              }
            >
              <MenuItem value="" disabled>
                Select role
              </MenuItem>

              {ROLE_OPTIONS.map((r) => (
                <MenuItem key={r.role_id} value={r.role_id}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>

            {assignments.length > 1 && (
              <IconButton onClick={() => removeRow(index)}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}

        <Button startIcon={<AddIcon />} onClick={addRow}>
          Add User
        </Button>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create Project
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}