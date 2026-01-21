import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Divider
} from "@mui/material";

const statusColor = (status) => {
  switch (status) {
    case "TODO": return "default";
    case "IN_PROGRESS": return "warning";
    case "DONE": return "success";
    default: return "default";
  }
};

const priorityColor = (priority) => {
  switch (priority) {
    case "High": return "error";
    case "Medium": return "warning";
    case "Low": return "success";
    default: return "default";
  }
};

const TaskCard = ({ task, assignees = [] }) => {
  const assigneeName =
    assignees.find((u) => u.user_id === task.assignee_id)?.user_name || "None";

  return (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        {/* Title + Chips */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight={600}>{task.task_title}</Typography>
          <Stack direction="row" spacing={1}>
            <Chip label={task.status} color={statusColor(task.status)} size="small" />
            <Chip label={task.priority} color={priorityColor(task.priority)} size="small" />
          </Stack>
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" mb={1}>
          {task.task_description}
        </Typography>

        <Divider sx={{ my: 1 }} />

        {/* Meta Info */}
        <Box display="flex" justifyContent="space-between" flexWrap="wrap">
          <Typography variant="caption">👤 Assignee: {assigneeName}</Typography>
          <Typography variant="caption">🗓️ Start: {task.start_date?.slice(0, 10)}</Typography>
          <Typography variant="caption">🗓️ Due: {task.due_date?.slice(0, 10)}</Typography>
          <Typography variant="caption">⭐ Points: {task.estimation_points}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;