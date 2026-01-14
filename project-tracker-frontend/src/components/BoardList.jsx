import { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, ListItemText } from "@mui/material";

const BoardList = ({ projectId, refresh }) => {
  const [boards, setBoards] = useState([]);

  const fetchBoards = () => {
    if (!projectId) return;

    axios
      .get("http://127.0.0.1:8000/api/v1/board/list")
      .then((res) => {
        setBoards(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchBoards();
  }, [refresh, projectId]); // AUTO REFRESH HERE

  return (
    <List>
      {boards.length === 0 && <p>No boards found</p>}

      {boards.map((board) => (
        <ListItem key={board.board_id}>
          <ListItemText
            primary={board.board_title}
            secondary={board.board_short_description}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default BoardList;
