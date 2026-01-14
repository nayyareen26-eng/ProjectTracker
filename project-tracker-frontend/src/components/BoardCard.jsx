import { Box, Typography } from "@mui/material";

const BoardCard = ({ board }) => {
  return (
    <Box
      p={2}
      mb={2}
      border="1px solid #ddd"
      borderRadius={1}
      sx={{ cursor: "pointer" }}
    >
      <Typography fontWeight={600}>
        {board.board_title}
      </Typography>

      <Typography variant="body2">
        {board.board_short_description}
      </Typography>

      <Typography variant="caption">
        {board.sprint_start_date} → {board.sprint_end_date}
      </Typography>
    </Box>
  );
};

export default BoardCard;
