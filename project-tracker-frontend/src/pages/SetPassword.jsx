import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert
} from "@mui/material";

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess]= useState("");

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      return setError("All fields are required");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/v1/auth/reset-password",
        {
          token: token,
          new_password: password
        }
      );

      setSuccess("Password set successfully. Redirecting to Login...");
      setError("");

      setTimeout(() => {
        navigate("/login");
    }, 2000);
      

    } catch (err) {
      setError("Invalid or expired link");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5EDED"
      }}
    >
      <Paper sx={{ padding: 4, width: 380 }}>
        <Typography
          variant="h5"
          align="center"
          mb={2}
          sx={{ fontWeight: "bold", color: "#6482AD" }}
        >
          Set Your Password
        </Typography>

        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {success && (
       <Alert severity="success" sx={{ mt: 2 }}>
        {success}
      </Alert>
    )}

      {error && (
    <Alert severity="error" sx={{ mt: 2 }}>
      {error}
    </Alert>
   )}


        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#7FA1C3",
            "&:hover": { backgroundColor: "#6482AD" }
          }}
          onClick={handleSubmit}
        >
          Set Password
        </Button>
      </Paper>
    </Box>
  );
};

export default SetPassword;
