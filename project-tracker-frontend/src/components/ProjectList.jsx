import { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, ListItemText } from "@mui/material";

function ProjectsList({ teamId , refresh, onProjectClick }) {
  const [projects, setProjects] = useState([]);

  // Fetch project function
   const fetchProjects = async () => {
    if (!teamId) return;

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/v1/project/list"
      );

      const teamProjects = res.data.projects.filter(
        (p) => p.team_id === Number(teamId)
      );

      setProjects(teamProjects);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };
  //auto refresh changes
  useEffect(() => {
    fetchProjects();
  }, [teamId, fetchProjects, refresh]); 

  return (
    <List>
      {projects.map((proj) => (
        <ListItem
          key={proj.project_id}
          button
          onClick={() => onProjectClick(proj.project_id)} // ✅ click works
        >
          <ListItemText
            primary={proj.project_title}
            secondary={proj.project_description}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default ProjectsList;