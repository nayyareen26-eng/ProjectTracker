import React, { useEffect,useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CreateProjectModal from "../components/CreateProjectModal";

const Projects = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const[projects, setProjects] = useState([]);

  // logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  const canAddProject = user?.job_profile === "PRODUCT MANAGER";
   
  //  fetch projects of team
  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/v1/project/list"
      );

      // team wise filter
      const teamProjects = res.data.projects.filter(
        (p) => p.team_id === Number(teamId)
      );

      setProjects(teamProjects);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  //  load projects on page load
  useEffect(() => {
    fetchProjects();
  }, [teamId, refresh]);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
        Projects
      </Typography>

      {/* PM only */}
      {canAddProject && (
        <Box mb={2}>
          <Button variant="contained" onClick={() => setOpen(true)}>
            + Add Project
          </Button>
        </Box>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        open={open}
        onClose={() => setOpen(false)}
        teamId={teamId}
        onCreated={() => setRefresh(prev => !prev)}
      />

      {/*  Projects List */}
      {projects.length === 0 ? (
        <Typography>No projects found</Typography>
      ) : (
        projects.map((proj) => (
          <Box
            key={proj.project_id}
            p={2}
            mb={1}
            border="1px solid #ddd"
            borderRadius={1}
            sx={{
              cursor: "pointer",
              "&:hover": { backgroundColor: "#f5f5f5" }
            }}
            onClick={() =>
              navigate(`/project/${proj.project_id}`)
            }
          >
            <Typography fontWeight={600}>
              {proj.project_title}
            </Typography>
            <Typography variant="body2">
              {proj.project_description}
            </Typography>
          </Box>
        ))
      )}
    </Container>
  );
};

export default Projects;