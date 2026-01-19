import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  TextField,
  IconButton,
  Button,
  Divider,
  Stack,
  Snackbar,
  Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const TaskDetail = () => {
  const { id } = useParams();
  const loggedInUserId = 6; // 🔥 auth se aayega later

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [attachments, setAttachments] = useState([]);
  
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [snack, setSnack] = useState({ 
    open: false,
     message: "",
    severity: "success"
  });

  /* ================= TASK ================= */

  const fetchTask = useCallback(async () => {
    try {
      const res = await api.get(`/api/v1/task/${id}`);
      setTask(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  /* ================= COMMENTS ================= */

  const fetchComments = async () => {
    const res = await api.get(`/api/v1/comment/task/${id}`);
    setComments(res.data);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    await api.post("/api/v1/comment", {
      task_id: Number(id),
      user_id: loggedInUserId,
      content: newComment
    });

    setNewComment("");
    fetchComments();
  };

  /* ================= ATTACHMENTS ================= */

  const fetchAttachments = async () => {
    const res = await api.get(`/api/v1/attachment/task/${id}`);
    setAttachments(res.data);
  };

  const uploadAttachment = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setSelectedFile(file); 

  const formData = new FormData();
  formData.append("task_id", Number(id));
  formData.append("file", file);

  await api.post("/api/v1/attachment", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  setSelectedFile(null); 
  fetchAttachments();
};

  /* ================= INLINE EDIT ================= */

  const startEdit = (field, value) => {
    setEditField(field);
    setEditValue(value || "");
  };

  const saveEdit = async () => {
    await api.post(`/api/v1/task/${id}`, {
      [editField]: editValue
    });

    setEditField(null);
    fetchTask();
  };

  useEffect(() => {
    fetchTask();
    fetchComments();
    fetchAttachments();
  }, [fetchTask]);

  const deleteAttachment = async (attachmentId) => {
  try {
    await api.delete(`/api/v1/attachment/${attachmentId}`);

    setSnack({
      open: true,
      message: "Attachment deleted successfully",
      severity: "success"
    });

    fetchAttachments();
  } catch (err) {
    console.error(err);
    setSnack({
      open: true,
      message: "Failed to delete attachment",
      severity: "error"
    });
  }
};


  /* ================= UI ================= */

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (!task)
    return (
      <Typography color="error" align="center">
        Task not found
      </Typography>
    );

  const renderEditable = (label, field, value) => (
    <Paper sx={{ p: 2, mb: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle2">{label}</Typography>
        {editField === field ? (
          <>
            <TextField
              size="small"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
            <IconButton onClick={saveEdit}>
              <SaveIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography>{value || "-"}</Typography>
            <IconButton onClick={() => startEdit(field, value)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Stack>
    </Paper>
  );

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {task.task_title}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {renderEditable("Description", "task_description", task.task_description)}
              {renderEditable("Status", "status", task.status)}
              {renderEditable("Priority", "priority", task.priority)}
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, mb: 1 }}>
                <Typography variant="subtitle2">Start Date</Typography>
                <Typography>{task.start_date?.split("T")[0] || "-"}</Typography>
              </Paper>
              <Paper sx={{ p: 2, mb: 1 }}>
                <Typography variant="subtitle2">Due Date</Typography>
                <Typography>{task.due_date?.split("T")[0] || "-"}</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* ================= COMMENTS ================= */}
          <Typography variant="h6">Comments</Typography>

          {comments.map((c) => (
            <Paper key={c.comment_id} sx={{ p: 1.5, my: 1 }}>
              <Typography>{c.content}</Typography>
              <Typography variant="caption">
                {new Date(c.created_at).toLocaleString()}
              </Typography>
            </Paper>
          ))}

          <TextField
            fullWidth
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button onClick={addComment} variant="contained" sx={{ mt: 1 }}>
            Add Comment
          </Button>

          <Divider sx={{ my: 3 }} />

          {/* ================= ATTACHMENTS ================= */}
          <Typography variant="h6">Attachments</Typography>

          {attachments.map((a) => (
            <Paper
            key={a.attachment_id}
            sx={{
            p: 1.5,
            my: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
         }}
  >
    <a href={a.file_url} target="_blank" rel="noreferrer">
      {a.file_name}
    </a>

    <Button
      size="small"
      color="error"
      onClick={() => deleteAttachment(a.attachment_id)}
    >
      Delete
    </Button>
  </Paper>
))}


          <Button component="label" variant="outlined" sx={{ mt: 2 }}>
            Upload File
            <input hidden type="file" onChange={uploadAttachment} />
          </Button>

          {selectedFile && (
             <Typography variant="body2" sx={{ mt: 1 }}>
                 📎 Selected: {selectedFile.name}
                  </Typography>
          )}

        </CardContent>
      </Card>
      <Snackbar
  open={snack.open}
  autoHideDuration={3000}
  onClose={() => setSnack({ ...snack, open: false })}
>
  <Alert
    onClose={() => setSnack({ ...snack, open: false })}
    severity={snack.severity}
    sx={{ width: "100%" }}
  >
    {snack.message}
  </Alert>
</Snackbar>

    </Box>
  );
};

export default TaskDetail;
