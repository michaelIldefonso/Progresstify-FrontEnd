import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Box,
  IconButton,
  Modal,
  TextField,
  Paper
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
    }

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.error("No token found, redirecting...");
      navigate("/");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/data`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        console.log("API Response:", response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        navigate("/");
      });
  }, [navigate, location.search]);

  const handleCreateWorkspace = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    console.log("Workspace Name:", workspaceName);
    console.log("Workspace Description:", workspaceDescription);
    setOpen(false);
    navigate("/workspace");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setWorkspaceDescription(value);
      setDescriptionError("");
    } else {
      setDescriptionError("Description exceeds 200 characters limit.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#0a0f1e",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AppBar position="absolute" sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <img src="/hahaha.png" alt="Sitemark" />
          </Typography>
          {user && (
            <div>
              <Button
                variant="outlined"
                onClick={handleMenu}
                sx={{
                  color: "black",
                  textTransform: "none",
                  backgroundColor: "#30A8DB",
                  boxShadow: 3,
                }}
              >
                Account
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>{`Email: ${user.userEmail}`}</MenuItem>
                <MenuItem disabled>{`ID: ${user.userId}`}</MenuItem>
                <MenuItem disabled>{`OAuth ID: ${user.userOauth_id}`}</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <Card
        onClick={handleCreateWorkspace}
        sx={{
          width: 300,
          cursor: "pointer",
          marginTop: 8,
          background: "linear-gradient(135deg, #1e3c72 30%, #2a5298 90%)",
          color: "white",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <IconButton
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              marginBottom: 2,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <Add fontSize="large" />
          </IconButton>
          <Typography variant="h5" component="div">
            Create Workspace
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            Click here to create a new workspace.
          </Typography>
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            maxHeight: "80vh", // Limit the height
            overflowY: "auto", // Enable scrolling
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Workspace
          </Typography>
          <TextField
            fullWidth
            label="Workspace Name"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            multiline
            label="Workspace Description"
            value={workspaceDescription}
            onChange={handleDescriptionChange}
            sx={{ marginBottom: 2 }}
            error={!!descriptionError}
            helperText={descriptionError}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Paper>
      </Modal>
    </div>
  );
}

export default Home;