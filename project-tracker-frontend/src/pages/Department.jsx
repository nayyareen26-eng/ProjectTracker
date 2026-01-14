import React from "react";
import DepartmentList from "../components/DepartmentList";
import { Typography, Container } from "@mui/material";

const Departments = () => {
    return (
        <Container>
            <Typography color="#6482AD"
             variant="h4" sx={{ mt: 3, mb: 2}}>
                Departments
            </Typography>

            <DepartmentList/>
        </Container>
    );
};

export default Departments;