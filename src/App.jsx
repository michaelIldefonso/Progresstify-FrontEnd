import React, { useState } from "react";
import { AppBar, Toolbar, Button, Dialog, DialogTitle, DialogContent, TextField, Container, Typography, Paper } from "@mui/material";

function App() {
  const [open, setOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert(`${isSignUp ? "Sign Up" : "Login"} successful!`);
    setOpen(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "rgba(0, 0, 0, 0.3) ", boxShadow: "none" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <img src="/final_logo.png" alt="" />
          </Typography>
          <Button color="inherit" onClick={() => setOpen(true)} sx={{ color: "black",textTransform: "none" }}>
            Login or Sign-up
          </Button>
        </Toolbar>
      </AppBar>
      
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isSignUp ? "Sign Up" : "Login"}</DialogTitle>
        <DialogContent>
          <Container maxWidth="xs">
            <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  name="email"
                  type="email"
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
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                )}
                <Button fullWidth variant="contained" color="primary" type="submit" style={{ marginTop: "15px" }}>
                  {isSignUp ? "Sign Up" : "Login"}
                </Button>
              </form>
              <Button
                fullWidth
                color="secondary"
                onClick={() => setIsSignUp(!isSignUp)}
                style={{ marginTop: "10px" }}
              >
                {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
              </Button>
            </Paper>
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default App;
