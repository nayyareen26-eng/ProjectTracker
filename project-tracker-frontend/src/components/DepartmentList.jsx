import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Card,
  CardContent,
  Typography
} from "@mui/material";

function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    api.get("http://127.0.0.1:8000/api/v1/department", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      setDepartments(res.data);   // ✅ FIX: response ko state me set kiya
    })
    .catch((err) => {
      console.error("Error fetching departments", err);
    });
  }, []);

  return (
  <>
    <Typography
      variant="h4"
      sx={{ mb: 3, fontWeight: "bold" }}
    >
      Departments
    </Typography>

    {departments.map((dept) => (
      <Card
        key={dept.department_id}
        sx={{ 
          backgroundColor:"#F5EDED",
          mb: 2,
          cursor: "pointer",
          "&:hover": {
            boxShadow: 6,
            backgroundColor: "#7FA1C3"
          }
        }}
        onClick={() =>
          navigate(`/department/${dept.department_id}/team`)
        }
      >
        <CardContent>
          <Typography variant="h6">
            {dept.department_name}
          </Typography>

          <Typography color="#1c1d1dff">
            Type: {dept.department_type}
          </Typography>
        </CardContent>
      </Card>
    ))}
  </>
);
}

export default DepartmentList;
