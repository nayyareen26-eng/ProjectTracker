import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import BoardCard from "./BoardCard";
import api from "../services/api";

const BoardList = ({ projectId, refresh }) => {
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) return;

    fetchBoards();
  }, [projectId, refresh]);

  const fetchBoards = async () => {
    try {
      const res = await api.get(
        `/api/v1/board/project/${projectId}`
      );

      setBoards(res.data.boards); // backend aligned
    } catch (err) {
      console.error("Error fetching boards:", err);
    }
  };

  if (boards.length === 0) {
    return <Typography>No boards found for this project</Typography>;
  }

  return (
    <Box>
      {boards.map((board) => (
        <Box
          key={board.board_id}
          sx={{ cursor: "pointer" }}
          onClick={() =>
            navigate(`/project/${projectId}/board/${board.board_id}`)
          }
        >
          <BoardCard board={board} />
        </Box>
      ))}
    </Box>
  );
};

export default BoardList;
