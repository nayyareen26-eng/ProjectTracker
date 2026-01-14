import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper
} from "@mui/material";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/v1/auth/login",
      {
        email: email,
        password: password
      }
    );

    console.log(res.data);

    // ---------- SAVE CONTEXT CORRECT ----------
    localStorage.setItem(
  "user",
  JSON.stringify({
    user_id: res.data.user_id,
    job_profile: res.data.job_profile,
    user_name: res.data.user_name
  })
);


    // ---------- ROLE BASED REDIRECT ----------
    if (res.data.job_profile === "ADMIN") {
      navigate("/admin-dashboard");

    } else if (
      res.data.job_profile === "PRODUCT MANAGER" ||
      res.data.job_profile === "PROJECT MANAGER"
    ){
      navigate("/department");
    }
    else {
      navigate("/project/");
    }
      
    

    alert("Login Successful ✔");

  } catch (err) {
    setError("Invalid email or password");
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
      <Paper sx={{ padding: 4, width: 350 }}>
        <Typography 
        variant="h5" 
        align="center" 
        mb={2}
        sx={{
          color:"#6482AD",
          fontWeight: "bold"
        }}
        >
          Login
        </Typography>

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#7FA1C3",
            "&:hover": {
              backgroundColor: "#E2DAD6"
  }
}}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
