import { useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,

} from "@mui/material";
import { Link as RouterLink} from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      return setError("Email is required");
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/v1/auth/forgot-password",
        { email }
      );

      setSuccess(
        "Password reset link has been sent to your email."
      );
      setEmail("");
    } catch (err) {
      setError("User not found or email invalid");
    } finally {
      setLoading(false);
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
          Forgot Password
        </Typography>

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        {success && (
          <Typography color="success.main" variant="body2">
            {success}
          </Typography>
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
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>

        <Typography
  component={RouterLink}
  to="/"
  sx={{
    mt: 2,
    fontSize: 14,
    color: "primary.main",
    cursor: "pointer",
    textAlign: "center",
    display: "block",
    textDecoration: "none"
  }}
>
  Back to Login
</Typography>

      </Paper>
    </Box>
  );
};

export default ForgotPassword;
