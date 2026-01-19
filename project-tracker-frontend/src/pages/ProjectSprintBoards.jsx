import { useState } from "react";
import { Button, Box, Typography } from "@mui/material";

import BoardList from "../components/BoardList";
import CreateBoardModal from "../components/CreateBoardModal";

const ProjectSprintBoards = ({ projectId }) => {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // role saved during login
  const role = localStorage.getItem("role");

  // only PM & TL can create boards
  const canCreateBoard =
    role === "PROJECT MANAGER" || role === "TEAM LEADER";

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight={600}>
          Sprint Boards
        </Typography>

        {canCreateBoard && (
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Create Board
          </Button>
        )}
      </Box>

      {/* Board List */}
      <BoardList projectId={projectId} refresh={refresh} />

      {/* Create Board Modal */}
      <CreateBoardModal
        open={open}
        onClose={() => setOpen(false)}
        projectId={projectId}
        onCreated={() => setRefresh(!refresh)}
      />
    </Box>
  );
};

export default ProjectSprintBoards;
