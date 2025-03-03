import React, { useState } from "react";
import { AppBar, Toolbar, Button, Dialog, DialogTitle, DialogContent, TextField, Container, Typography, Paper, Checkbox, FormControlLabel } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google"; // MUI icon for Google

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
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <AppBar position="absolute" sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <img src="/final_logo.png" alt="Sitemark" />
          </Typography>
          <Button variant="outlined" onClick={() => setOpen(true)} sx={{ color: "white", borderColor: "white", textTransform: "none" }}>
            Login or Sign Up
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
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                )}
                <FormControlLabel
                  control={<Checkbox style={{ color: "white" }} />}
                  label={<Typography variant="body2" style={{ color: "white" }}>Remember me</Typography>}
                />
                <Button fullWidth variant="contained" sx={{ backgroundColor: "#fff", color: "#000", marginTop: "10px" }} type="submit">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
              </form>

              <Typography variant="body2" sx={{ marginTop: "10px", color: "#9ca3af" }}>
                Forgot your password?
              </Typography>

              <Typography variant="body2" sx={{ marginY: "10px", color: "#9ca3af" }}>or</Typography>

              <Button
                fullWidth
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
