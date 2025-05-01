import {
  Dialog,
  DialogTitle,
  DialogContent,
  Container,
  Paper,
  Button,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import PropTypes from "prop-types"; // Import PropTypes
import FacebookIcon from "@mui/icons-material/Facebook"; // Import FacebookIcon
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AuthDialog({ open, setOpen, isSignUp, setIsSignUp, darkMode }) {
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

            <Button
              fullWidth
              onClick={() => window.open(`${API_BASE_URL}/auth/google`, "_self")}
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{
                fontSize: "1.25rem", 
                padding: "12px 16px", 
                height: "50px", 
                color: darkMode ? "white" : "black",
                borderColor: darkMode ? "white" : "black",
                textTransform: "none",
                marginBottom: "10px",
              }}
            >
              Sign in with Google
            </Button>

            <Button
              fullWidth
              onClick={() => window.open(`${API_BASE_URL}/auth/facrbook`, "_self")}
              variant="outlined"
              startIcon={<FacebookIcon />}
              sx={{
                fontSize: "1.25rem", 
                padding: "12px 16px", 
                height: "50px",
                color: darkMode ? "white" : "black",
                borderColor: darkMode ? "white" : "black",
                textTransform: "none",
                marginBottom: "10px",
              }}
            >
              Sign in with Facbook
            </Button>

            <Button
              fullWidth
              onClick={() => window.open(`${API_BASE_URL}/auth/GitHub`, "_self")}
              variant="outlined"
              startIcon={<GitHubIcon />}
              sx={{
                fontSize: "1.25rem", 
                padding: "12px 16px", 
                height: "50px",
                color: darkMode ? "white" : "black",
                borderColor: darkMode ? "white" : "black",
                textTransform: "none",
                marginBottom: "10px",
              }}
            >
              Sign in with Github
            </Button>

            <Button
              fullWidth
              onClick={() => window.open(`${API_BASE_URL}/auth/Twitter`, "_self")}
              variant="outlined"
              startIcon={<TwitterIcon />}
              sx={{
                fontSize: "1.25rem", 
                padding: "12px 16px", 
                height: "50px",
                color: darkMode ? "white" : "black",
                borderColor: darkMode ? "white" : "black",
                textTransform: "none",
                marginBottom: "10px",
              }}
            >
              Sign in with Twitter
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