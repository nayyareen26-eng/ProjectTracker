import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from "@mui/material";
import axios from "axios";

const CreateBoardModal = ({ open, onClose, projectId, onCreated }) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!title || !startDate || !endDate) {
      alert("All fields required");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/v1/board/", {
        project_id: Number(projectId),
        board_title: title,
        sprint_start_date: startDate,
        sprint_end_date: endDate,
        board_short_description: description
      });

      // reset
      setTitle("");
      setStartDate("");
      setEndDate("");
      setDescription("");

      onCreated();   // refresh board
      onClose();     // close modal
    } catch (err) {
      console.error(err);
      alert("Board creation failed");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Sprint Board</DialogTitle>

      <DialogContent>
        <TextField
          label="Sprint Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Box display="flex" gap={2}>
          <TextField
            type="date"
            label="Start Date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <TextField
            type="date"
            label="End Date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Box>

        <TextField
          label="Short Description"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleCreate}>
          Create Sprint
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBoardModal;
