import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, Dialog, DialogTitle, DialogContent, TextField, Container, Typography, Paper, Checkbox, FormControlLabel } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google"; // MUI icon for Google

const API_BASE_URL = import.meta.env.VITE_API_URL;

function App() {
  const [open, setOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [data, setData] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/data`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }  // ✅ Send session cookie
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((data) => setData(data.message))
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/${isSignUp ? "signup" : "login"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(`${isSignUp ? "Sign Up" : "Login"} successful!`);
        setOpen(false);
        // Navigate to another page if needed
        // navigate("/dashboard");
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <AppBar position="absolute" sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <img src="/final_logo.png" alt="Sitemark" />
          </Typography>
          <Button variant="outlined" onClick={() => setOpen(true)} sx={{ color: "#2196F3", borderColor: "#2196F3", textTransform: "none" }}>
            Login / Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        PaperProps={{ style: { backgroundColor: "#111827", color: "#fff", padding: "20px", borderRadius: "10px" } }}
      >
        <DialogTitle align="center">{isSignUp ? "Sign Up" : "Sign In"}</DialogTitle>
        <DialogContent>
          <Container maxWidth="xs">
            <Paper elevation={0} style={{ padding: "20px", textAlign: "center", backgroundColor: "transparent" }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email" 
                  name="email"
                  type="email"
                  variant="filled"
                  InputProps={{ style: { backgroundColor: "#1f2937", color: "#fff" } }}
                  InputLabelProps={{ style: { backgroundColor: "#1f2937", color: "#578FCA" } }}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  name="password"
                  type="password"
                  variant="filled"
                  InputProps={{ style: { backgroundColor: "#1f2937", color: "#fff" } }}
                  InputLabelProps={{ style: { backgroundColor: "#1f2937", color: "#578FCA" } }}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {isSignUp && (
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    variant="filled"
                    InputProps={{ style: { backgroundColor: "#1f2937", color: "#fff" } }}
                    InputLabelProps={{ style: { backgroundColor: "#1f2937", color: "#578FCA" } }}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                )}
                <FormControlLabel
                  control={<Checkbox style={{ color: "white" }} />}
                  label={<Typography variant="body2" style={{ color: "white" }}>Remember me</Typography>}
                />
                <Button fullWidth variant="contained" sx={{ backgroundColor: "#578FCA", color: "#000", marginTop: "10px" }} type="submit">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
              </form>

              <Typography variant="body2" sx={{ marginTop: "10px", color: "#9ca3af" }}>
                Forgot your password?
              </Typography>

              <Typography variant="body2" sx={{ marginY: "10px", color: "#9ca3af" }}>or</Typography>

              <Button
                fullWidth
                onClick={() => window.location.href = `${API_BASE_URL}/auth/google`}
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{ color: "white", borderColor: "white", textTransform: "none" }}
              >
                Sign in with Google
              </Button>

              <Button
                fullWidth
                color="secondary"
                onClick={() => setIsSignUp(!isSignUp)}
                sx={{ marginTop: "10px", textTransform: "none", color: "#fff" }}
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </Button>
            </Paper>
          </Container>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;