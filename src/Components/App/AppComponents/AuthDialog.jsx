import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { handleChange, handleSubmit } from "../../Functions/eventHandlerFunctions";
import PropTypes from "prop-types"; // Import PropTypes

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AuthDialog({ open, setOpen, isSignUp, setIsSignUp, darkMode }) {
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        style: {
          backgroundColor: darkMode ? "#111827" : "#fddfa1",
          color: darkMode ? "#fff" : "#000",
          padding: "20px",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle align="center">{isSignUp ? "Sign Up" : "Sign In"}</DialogTitle>
      <DialogContent style={{ maxHeight: "80vh", overflow: "hidden" }}>
        <Container maxWidth="xs">
          <Paper
            elevation={0}
            style={{
              padding: "20px",
              textAlign: "center",
              backgroundColor: "transparent",
            }}
          >
            <form onSubmit={(e) => handleSubmit(e, isSignUp, formData, setOpen)}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                variant="filled"
                InputProps={{
                  style: {
                    backgroundColor: darkMode ? "#1f2937" : "#f1bb75",
                    color: darkMode ? "#fff" : "#000",
                  },
                }}
                InputLabelProps={{
                  style: { color: darkMode ? "#578FCA" : "black" },
                }}
                value={formData.email}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type="password"
                variant="filled"
                InputProps={{
                  style: {
                    backgroundColor: darkMode ? "#1f2937" : "#f1bb75",
                    color: darkMode ? "#fff" : "#000",
                  },
                }}
                InputLabelProps={{
                  style: { color: darkMode ? "#578FCA" : "black" },
                }}
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
                  InputProps={{
                    style: {
                      backgroundColor: darkMode ? "#1f2937" : "#e0e0e0",
                      color: darkMode ? "#fff" : "#000",
                    },
                  }}
                  InputLabelProps={{ style: { color: "#578FCA" } }}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              )}
              <FormControlLabel
                control={<Checkbox style={{ color: darkMode ? "white" : "black" }} />}
                label={
                  <Typography variant="body2" style={{ color: darkMode ? "white" : "black" }}>
                    Remember me
                  </Typography>
                }
              />
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: darkMode ? "#578FCA" : "#f88f4e",
                  color: darkMode ? "#000" : "black",
                  marginTop: "10px",
                }}
                type="submit"
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </form>
            <Typography
              variant="body2"
              sx={{ marginTop: "10px", color: darkMode ? "#9ca3af" : "#757575" }}
            >
              Forgot your password?
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginY: "10px", color: darkMode ? "#9ca3af" : "#757575" }}
            >
              or
            </Typography>
            <Button
              fullWidth
              onClick={() => window.open(`${API_BASE_URL}/auth/google`, "_self")}
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{
                color: darkMode ? "white" : "black",
                borderColor: darkMode ? "white" : "black",
                textTransform: "none",
              }}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              color="secondary"
              onClick={() => setIsSignUp(!isSignUp)}
              sx={{
                marginTop: "10px",
                textTransform: "none",
                color: darkMode ? "#fff" : "#000",
              }}
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Button>
          </Paper>
        </Container>
      </DialogContent>
    </Dialog>
  );
}
// Add PropTypes for validation
AuthDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  isSignUp: PropTypes.bool.isRequired,
  setIsSignUp: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};
export default AuthDialog;