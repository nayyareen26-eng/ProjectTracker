import React, { useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import BoardList from "./BoardList";
import CreateBoardModal from "./CreateBoardModal";

const ProjectDetail = () => {
  const { projectId } = useParams();

  const [openBoardModal, setOpenBoardModal] = useState(false);
  const [refreshBoards, setRefreshBoards] = useState(false);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 3 }}>
        Project Boards
      </Typography>

      <Box my={2}>
        <Button
          variant="contained"
          onClick={() => setOpenBoardModal(true)}
        >
          + Add Sprint
        </Button>
      </Box>

      {/* CREATE BOARD */}
      <CreateBoardModal
        open={openBoardModal}
        onClose={() => setOpenBoardModal(false)}
        projectId={projectId}
        onCreated={() => setRefreshBoards(prev => !prev)}
      />

      {/* LIST BOARDS */}
      <BoardList
        projectId={projectId}
        refresh={refreshBoards}
      />
    </Container>
  );
};

export default ProjectDetail;
