import { useState } from "react"; // Import useState for managing local state
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
} from "@mui/material"; // Import Material-UI components
import GoogleIcon from "@mui/icons-material/Google"; // Import Google icon for the "Sign in with Google" button
import { handleChange, handleSubmit } from "../../Functions/eventHandlerFunctions"; // Import custom event handler functions
import PropTypes from "prop-types"; // Import PropTypes for prop validation

// Base URL for API requests, loaded from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AuthDialog({ open, setOpen, isSignUp, setIsSignUp, darkMode }) {
  // State to manage form data (email, password, confirmPassword)
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });

  return (
    <Dialog
      open={open} // Controls whether the dialog is open
      onClose={() => setOpen(false)} // Close the dialog when the user clicks outside or presses escape
      PaperProps={{
        style: {
          backgroundColor: darkMode ? "#111827" : "#fddfa1", // Background color based on dark mode
          color: darkMode ? "#fff" : "#000", // Text color based on dark mode
          padding: "20px", // Padding inside the dialog
          borderRadius: "10px", // Rounded corners for the dialog
        },
      }}
    >
      {/* Dialog title */}
      <DialogTitle align="center">{isSignUp ? "Sign Up" : "Sign In"}</DialogTitle>

      {/* Dialog content */}
      <DialogContent style={{ maxHeight: "80vh", overflow: "hidden" }}>
        <Container maxWidth="xs">
          <Paper
            elevation={0} // No shadow for the paper
            style={{
              padding: "20px", // Padding inside the paper
              textAlign: "center", // Center-align text
              backgroundColor: "transparent", // Transparent background
            }}
          >
            {/* Form for sign-in or sign-up */}
            <form onSubmit={(e) => handleSubmit(e, isSignUp, formData, setOpen)}>
              {/* Email input field */}
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                variant="filled"
                InputProps={{
                  style: {
                    backgroundColor: darkMode ? "#1f2937" : "#f1bb75", // Input background color based on dark mode
                    color: darkMode ? "#fff" : "#000", // Input text color based on dark mode
                  },
                }}
                InputLabelProps={{
                  style: { color: darkMode ? "#578FCA" : "black" }, // Label color based on dark mode
                }}
                value={formData.email} // Bind input value to state
                onChange={(e) => handleChange(e, formData, setFormData)} // Update state on change
                required // Make the field required
              />

              {/* Password input field */}
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type="password"
                variant="filled"
                InputProps={{
                  style: {
                    backgroundColor: darkMode ? "#1f2937" : "#f1bb75", // Input background color based on dark mode
                    color: darkMode ? "#fff" : "#000", // Input text color based on dark mode
                  },
                }}
                InputLabelProps={{
                  style: { color: darkMode ? "#578FCA" : "black" }, // Label color based on dark mode
                }}
                value={formData.password} // Bind input value to state
                onChange={handleChange} // Update state on change
                required // Make the field required
              />

              {/* Confirm password field (only for sign-up) */}
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
                      backgroundColor: darkMode ? "#1f2937" : "#e0e0e0", // Input background color based on dark mode
                      color: darkMode ? "#fff" : "#000", // Input text color based on dark mode
                    },
                  }}
                  InputLabelProps={{ style: { color: "#578FCA" } }} // Label color
                  value={formData.confirmPassword} // Bind input value to state
                  onChange={handleChange} // Update state on change
                  required // Make the field required
                />
              )}

              {/* Remember me checkbox */}
              <FormControlLabel
                control={<Checkbox style={{ color: darkMode ? "white" : "black" }} />}
                label={
                  <Typography variant="body2" style={{ color: darkMode ? "white" : "black" }}>
                    Remember me
                  </Typography>
                }
              />

              {/* Submit button */}
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: darkMode ? "#578FCA" : "#f88f4e", // Button background color based on dark mode
                  color: darkMode ? "#000" : "black", // Button text color based on dark mode
                  marginTop: "10px", // Margin above the button
                }}
                type="submit"
              >
                {isSignUp ? "Sign Up" : "Sign In"} {/* Button text based on mode */}
              </Button>
            </form>

            {/* Forgot password link */}
            <Typography
              variant="body2"
              sx={{ marginTop: "10px", color: darkMode ? "#9ca3af" : "#757575" }}
            >
              Forgot your password?
            </Typography>

            {/* Divider text */}
            <Typography
              variant="body2"
              sx={{ marginY: "10px", color: darkMode ? "#9ca3af" : "#757575" }}
            >
              or
            </Typography>

            {/* Sign in with Google button */}
            <Button
              fullWidth
              onClick={() => window.open(`${API_BASE_URL}/auth/google`, "_self")} // Redirect to Google auth
              variant="outlined"
              startIcon={<GoogleIcon />} // Add Google icon
              sx={{
                color: darkMode ? "white" : "black", // Button text color based on dark mode
                borderColor: darkMode ? "white" : "black", // Button border color based on dark mode
                textTransform: "none", // Disable uppercase text
              }}
            >
              Sign in with Google
            </Button>

            {/* Toggle between sign-in and sign-up */}
            <Button
              fullWidth
              color="secondary"
              onClick={() => setIsSignUp(!isSignUp)} // Toggle sign-up mode
              sx={{
                marginTop: "10px", // Margin above the button
                textTransform: "none", // Disable uppercase text
                color: darkMode ? "#fff" : "#000", // Button text color based on dark mode
              }}
            >
              {isSignUp
                ? "Already have an account? Sign In" // Text for sign-up mode
                : "Don't have an account? Sign Up"}   {/* Text for sign-in mode */}
            </Button>
          </Paper>
        </Container>
      </DialogContent>
    </Dialog>
  );
}

// Add PropTypes for validation
AuthDialog.propTypes = {
  open: PropTypes.bool.isRequired, // Whether the dialog is open
  setOpen: PropTypes.func.isRequired, // Function to toggle dialog open state
  isSignUp: PropTypes.bool.isRequired, // Whether the dialog is in sign-up mode
  setIsSignUp: PropTypes.func.isRequired, // Function to toggle sign-up mode
  darkMode: PropTypes.bool.isRequired, // Whether dark mode is enabled
};

export default AuthDialog;