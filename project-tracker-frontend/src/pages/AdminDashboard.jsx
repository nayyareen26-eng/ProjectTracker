import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Snackbar
} from "@mui/material";

const AdminDashboard = () => {

  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [notify, setNotify] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role_id: "",
    department_id: "",
    team_id: ""
  });

  /* ================= LOAD DATA ================= */

  const loadRoles = async () => {
    const res = await api.get("/api/v1/role/system");
    setRoles(res.data);
  };

  const loadDepartments = async () => {
    const res = await api.get("/api/v1/department/");
    setDepartments(res.data);
  };

  const loadTeams = async (departmentId) => {
    const res = await api.get(`/api/v1/department/${departmentId}/team`);
    setTeams(res.data);
  };

  useEffect(() => {
    loadRoles();
    loadDepartments();
  }, []);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "department_id") {
      loadTeams(value);
      setForm((prev) => ({ ...prev, team_id: "" }));
    }
  };

  /* ================= CREATE USER ================= */

  const createUser = async () => {
    try {
      const selectedRole = roles.find(r => r.id === form.role_id);
      if (!selectedRole) {
        alert("Select role");
        return;
      }

      await api.post("/api/v1/user/", {
        user_name: form.full_name,
        email_id: form.email,
        password: form.password,
        job_profile: selectedRole.role_type,
        department_id: form.department_id,
        team_id: form.team_id
      });

      setNotify(true);
      setForm({
        full_name: "",
        email: "",
        password: "",
        role_id: "",
        department_id: "",
        team_id: ""
      });

    } catch (err) {
      console.error("Create user error", err);
    }
  };

  /* ================= UI ================= */

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ maxWidth: 520, p: 2 }}>
        <CardContent>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Admin Dashboard
          </Typography>

          <TextField
            fullWidth
            sx={{ mb: 2 }}
            label="Full Name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            sx={{ mb: 2 }}
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            sx={{ mb: 2 }}
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          {/* Role */}
          <Select
            fullWidth
            sx={{ mb: 2 }}
            name="role_id"
            value={form.role_id}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="">Select Role</MenuItem>
            {roles.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.role_type}
              </MenuItem>
            ))}
          </Select>

          {/* Department */}
          <Select
            fullWidth
            sx={{ mb: 2 }}
            name="department_id"
            value={form.department_id}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="">Select Department</MenuItem>
            {departments.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.department_name}
              </MenuItem>
            ))}
          </Select>

          {/* Team */}
          <Select
            fullWidth
            sx={{ mb: 2 }}
            name="team_id"
            value={form.team_id}
            onChange={handleChange}
            displayEmpty
            disabled={!form.department_id}
          >
            <MenuItem value="">Select Team</MenuItem>
            {teams.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.team_name}
              </MenuItem>
            ))}
          </Select>

          <Button
            fullWidth
            variant="contained"
            onClick={createUser}
          >
            Create User
          </Button>

        </CardContent>
      </Card>

      <Snackbar
        open={notify}
        autoHideDuration={2000}
        onClose={() => setNotify(false)}
        message="User Created Successfully ✔"
      />
    </Box>
  );
};

export default AdminDashboard;
