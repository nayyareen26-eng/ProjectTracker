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
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [notify, setNotify] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role_id: "",
    company_id: "",
    department_id: "",
    team_id: ""
  });

  /* ================= LOAD DATA ================= */

  const loadRoles = async () => {
    const res = await api.get("/api/v1/role/system");
    setRoles(res.data);
  };

  const loadCompanies = async () => {
    const res = await api.get("/api/v1/company/");
    setCompanies(res.data);
  };

  const loadDepartments = async (companyId) => {
    if (!companyId) return;
    const res = await api.get(`/api/v1/company/${companyId}/department`);
    setDepartments(res.data);
  };

  const loadTeams = async (departmentId) => {

  if (!departmentId) {
    console.warn("🚫 loadTeams blocked, invalid id:", departmentId);
    return;
  }

  console.log("🚀 loadTeams called with:", departmentId);

  try {
    const res = await api.get(
      `/api/v1/department/${departmentId}/team`
    );

    setTeams(res.data);
  } catch (err) {
    console.error("❌ Load teams error:", err);
  }
};



  useEffect(() => {
    loadRoles();
    loadCompanies();
  }, []);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // COMPANY CHANGE
    if (name === "company_id") {
      setDepartments([]);
      setTeams([]);

      setForm(prev => ({
        ...prev,
        department_id: "",
        team_id: ""
      }));

      if (value) {
        loadDepartments(Number(value));
      }
    }

    // DEPARTMENT CHANGE
    if (name === "department_id") {

      if (!value) {
        console.warn("Invalid department id: ", value);
        setTeams([]);
        return;
      }
      

      setForm(prev => ({
        ...prev,
        department_id: value,
        team_id: ""
      }));
    
      loadTeams(Number(value));
    }
  };

  /* ================= CREATE USER ================= */

  const createUser = async () => {
    try {
      const selectedRole = roles.find(
        r => String(r.id) === String(form.role_id)
      );

      if (!selectedRole) {
        alert("Select role");
        return;
      }

      await api.post("/api/v1/user/", {
        user_name: form.full_name,
        email_id: form.email,
        password: form.password,
        job_profile: selectedRole.role_type,
        department_id: Number(form.department_id),
        team_id: Number(form.team_id)
      });

      setNotify(true);

      setForm({
        full_name: "",
        email: "",
        password: "",
        role_id: "",
        company_id: "",
        department_id: "",
        team_id: ""
      });

      setDepartments([]);
      setTeams([]);

    } catch (err) {
      console.error("Create user error", err.response?.data);
      alert("User creation failed");
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

          {/* ROLE */}
          <Select
            fullWidth
            sx={{ mb: 2 }}
            name="role_id"
            value={form.role_id}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="" disabled>Select Role</MenuItem>
            {roles.map(r => (
              <MenuItem key={r.id} value={String(r.id)}>
                {r.role_type}
              </MenuItem>
            ))}
          </Select>

          {/* COMPANY */}
          <Select
            fullWidth
            sx={{ mb: 2 }}
            name="company_id"
            value={form.company_id}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="" disabled>Select Company</MenuItem>
            {companies.map(c => (
              <MenuItem key={c.id} value={String(c.id)}>
                {c.company_name}
              </MenuItem>
            ))}
          </Select>

          {/* DEPARTMENT */}
          <Select
            fullWidth
            sx={{ mb: 2 }}
            name="department_id"
            value={form.department_id || ""}
            onChange={handleChange}
            displayEmpty
            disabled={!form.company_id}
          >
            <MenuItem 
            value="">
              Select Department
            </MenuItem>

            {departments.map(dept => (
              <MenuItem key={dept.department_id}
               value={dept.department_id}>
                {dept.department_name}
              </MenuItem>
            ))}
          </Select>

          {/* TEAM */}
          <Select
  fullWidth
  sx={{ mb: 2 }}
  name="team_id"
  value={form.team_id || ""}
  onChange={handleChange}
  displayEmpty
  disabled={!form.department_id}
>
  <MenuItem value="" disabled>
    Select Team
  </MenuItem>

  {teams.map((t) => (
    <MenuItem key={t.team_id} value={String(t.team_id)}>
      {t.team_name}
    </MenuItem>
  ))}
</Select>
<Typography variant="caption">
  Teams count: {teams.length}
</Typography>


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


export default AdminDashboard ;
