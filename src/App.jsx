import React, { useState } from "react";
import { AppBar, Toolbar, Button, Dialog, DialogTitle, DialogContent, TextField, Container, Typography, Paper, Checkbox, FormControlLabel } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google"; // Google icon from MUI

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [open, setOpen] = useState(false); // Controls dialog visibility
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign Up and Login
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Update form state
  };

  const handleSubmit = (e) => { // Form submission handler
    e.preventDefault();
    if (isSignUp && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert(`${isSignUp ? "Sign Up" : "Login"} successful!`);
    setOpen(false);
    Navigate("/home"); // Redirect to home page after sign up / login
    
  };

  return (
    // Main page container
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <AppBar position="absolute" sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <img src="/hahaha.png" alt="Sitemark" />
          </Typography>
          <Button variant="outlined" onClick={() => setOpen(true)} sx={{ color: "#2196F3", borderColor: "#2196F3", textTransform: "none" }}>
            Login / Sign Up
          </Button>
        </Toolbar>
      </AppBar>
      

      {/* Login / Sign Up Dialog */}
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
                <FormControlLabel // Remember me checkbox
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

              <Button // Google Sign In button
                fullWidth
                onClick={() => window.open(`${API_BASE_URL}/auth/google`, "_self")}
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{ color: "white", borderColor: "white", textTransform: "none" }}
              >
                Sign in with Google
              </Button>

              <Button // Toggle between Sign Up and Login
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