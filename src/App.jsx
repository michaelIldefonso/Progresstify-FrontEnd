import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, TextField, Container, Typography, Paper, Checkbox, FormControlLabel, IconButton, } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google"; // Google icon from MUI
import Brightness4Icon from '@mui/icons-material/Brightness4';//moon icon
import Brightness7Icon from '@mui/icons-material/Brightness7';// sun icon

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [open, setOpen] = useState(false); // Controls dialog visibility
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign Up and Login
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [darkMode, setDarkMode] = useState(true); // Toggle between dark mode and light mode

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
    Navigate("/workspace"); // Redirect to home page after sign up / login
  };

  // Function to toggle between dark mode and light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode); // Toggle dark mode state
  };

  return (
    // Main page container
    <div style={{
      backgroundColor: darkMode ? "#0a0f1e" : "#f0f0f0",
      backgroundImage: darkMode ? 'url("/ladida1.jpg")' : 'url("/ladida2.jpg")', // Add background images for l and d mode
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    }}>
      <div style={{ 
        position: "absolute", 
        top: 0, 
        width: "100%", 
        display: "flex", 
        alignItems: "center", 
        padding: "10px 20px",
        backgroundColor: "transparent"
      }}>
        <Typography variant="h6" sx={{marginLeft: "20px",}}>
          <img src="/hahaha.png" alt="Sitemark" />
        </Typography>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
          {/* IconButton to toggle between light and dark mode */}
          <IconButton onClick={toggleDarkMode} sx={{ color: darkMode ? "#fff" : "#000" }}>
            {darkMode ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
          <Button variant="outlined" onClick={() => setOpen(true)} sx={{
            color: darkMode ? "#2196F3" : "#000",
            borderColor: darkMode ? "#2196F3" : "#000",
            textTransform: "none",
            marginLeft: "10px",
            marginRight: "20px"
          }}>
            Login / Sign Up
          </Button>
        </div>
      </div>

      {/* Login / Sign Up Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        PaperProps={{ style: {
          backgroundColor: darkMode ? "#111827" : "#fff",
          color: darkMode ? "#fff" : "#000",
          padding: "20px",
          borderRadius: "10px"
        }}}
      >
        <DialogTitle align="center">{isSignUp ? "Sign Up" : "Sign In"}</DialogTitle>
        <DialogContent style={{ maxHeight: "80vh", overflow: "hidden" }}>
          <Container maxWidth="xs">
            <Paper elevation={0} style={{
              padding: "20px",
              textAlign: "center",
              backgroundColor: "transparent"
            }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email" 
                  name="email"
                  type="email"
                  variant="filled"
                  InputProps={{ style: {
                    backgroundColor: darkMode ? "#1f2937" : "#e0e0e0",
                    color: darkMode ? "#fff" : "#000"
                  }}}
                  InputLabelProps={{ style: { color: "#578FCA" } }}
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
                  InputProps={{ style: {
                    backgroundColor: darkMode ? "#1f2937" : "#e0e0e0",
                    color: darkMode ? "#fff" : "#000"
                  }}}
                  InputLabelProps={{ style: { color: "#578FCA" } }}
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
                    InputProps={{ style: {
                      backgroundColor: darkMode ? "#1f2937" : "#e0e0e0",
                      color: darkMode ? "#fff" : "#000"
                    }}}
                    InputLabelProps={{ style: { color: "#578FCA" } }}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                )}
                <FormControlLabel // Remember me checkbox
                  control={<Checkbox style={{ color: darkMode ? "white" : "black" }} />}
                  label={<Typography variant="body2" style={{ color: darkMode ? "white" : "black" }}>Remember me</Typography>}
                />
                <Button fullWidth variant="contained" sx={{
                  backgroundColor: "#578FCA",
                  color: darkMode ? "#000" : "#fff",
                  marginTop: "10px"
                }} type="submit">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
              </form>
              
              <Typography variant="body2" sx={{ marginTop: "10px", color: darkMode ? "#9ca3af" : "#757575" }}>
                Forgot your password?
              </Typography>

              <Typography variant="body2" sx={{ marginY: "10px", color: darkMode ? "#9ca3af" : "#757575" }}>or</Typography>

              <Button // Google Sign In button
                fullWidth
                onClick={() => window.open(`${API_BASE_URL}/auth/google`, "_self")}
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{
                  color: darkMode ? "white" : "black",
                  borderColor: darkMode ? "white" : "black",
                  textTransform: "none"
                }}
              >
                Sign in with Google
              </Button>

              <Button // Toggle between Sign Up and Login
                fullWidth
                color="secondary"
                onClick={() => setIsSignUp(!isSignUp)}
                sx={{ marginTop: "10px", textTransform: "none", color: darkMode ? "#fff" : "#000" }}
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