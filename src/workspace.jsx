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
  IconButton,
  Modal,
  TextField,
  Paper,
  Grid,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { handleMenu, handleClose } from "./Components/Functions/eventHandlerFunctions";
import { handleLogout } from "./Components/Functions/navigationFunctions";
import { handleCreateWorkspace, handleCloseModal, handleSubmit, handleDescriptionChange } from "./Components/Functions/createWorkspaceFunctions";

function Workspaces() {
  const navigate = useNavigate(); // Navigation hook
  const location = useLocation(); // Location hook
  const [user, setUser] = useState(null); // User state
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for menu
  const [open, setOpen] = useState(false); // Modal state
  const [workspaceName, setWorkspaceName] = useState(""); // Workspace name state
  const [workspaceDescription, setWorkspaceDescription] = useState(""); // Workspace description state
  const [descriptionError, setDescriptionError] = useState(""); // Description error state
  const [workspaces, setWorkspaces] = useState([]); //  Workspaces state

  useEffect(() => {
    // Check if token is present in the URL and store it in localStorage
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token"); // Get token from URL

    if (token) {
      localStorage.setItem("token", token); // Store token in localStorage
    }

    const storedToken = localStorage.getItem("token"); // Get token from localStorage

    if (!storedToken) { 
      // If no token is found, redirect to the login page
      console.error("No token found, redirecting...");
      navigate("/");
      return;
    }

    axios
      // Fetch workspaces and user data using the stored token
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/workspaces`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setWorkspaces(response.data))
      .catch((error) => console.error("Error fetching workspaces:", error));

    axios
      // fetch user data
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/data`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setUser(response.data))
      .catch((error) => {
        console.error("Error fetching user data:", error);
        navigate("/"); // Redirect to login page if user data fetch fails
      });
  }, [navigate, location.search]); 

  return (
    <div
      style={{
        backgroundColor: "#0a0f1e",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: 'url("/blue.jpg")', // Add background image here
        backgroundSize: "cover",
        backgroundPosition: "center",
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
                onClick={(event) => handleMenu(event, setAnchorEl)}
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
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorEl)}
                onClose={() => handleClose(setAnchorEl)}
              >
                <MenuItem disabled>{`Email: ${user.userEmail}`}</MenuItem>
                <MenuItem disabled>{`ID: ${user.userId}`}</MenuItem>
                <MenuItem disabled>{`OAuth ID: ${user.userOauth_id}`}</MenuItem>
                <MenuItem onClick={() => handleLogout(navigate)}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>

      {/* Create Workspace Card */}
      <Card
        onClick={() => handleCreateWorkspace(setOpen)}
        sx={{
          width: 300,
          cursor: "pointer",
          marginTop: 8,
          background: "linear-gradient(135deg, rgb(30, 30, 30) 30%, rgb(30, 30, 30) 90%)",
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
          <Typography variant="h5">Create Workspace</Typography>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            Click here to create a new workspace.
          </Typography>
        </CardContent>
      </Card>

      {/* Modal for Creating Workspace */}
      <Modal open={open} onClose={() => handleCloseModal(setOpen)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "rgb(30, 30, 30)",
            boxShadow: 24,
            p: 4,
            color: "white",
          }}
        >
          <Typography variant="h6" component="h2">
            Create Workspace
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Workspace Name"
            fullWidth
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            InputLabelProps={{
              style: { color: 'white' }, // Set label color to white
            }}
            InputProps={{
              style: { color: 'white' }, // Set input text color to white
            }}
          />
          <TextField
            margin="dense"
            label="Workspace Description"
            fullWidth
            multiline
            rows={4}
            value={workspaceDescription}
            onChange={(e) => handleDescriptionChange(e, setWorkspaceDescription, setDescriptionError)}
            error={descriptionError !== ""}
            helperText={descriptionError}
            InputLabelProps={{
              style: { color: 'white' }, // Set label color to white
            }}
            InputProps={{
              style: { color: 'white' }, // Set input text color to white
            }}
          />
          <Button
            onClick={() =>
              handleSubmit(
                workspaceName,
                workspaceDescription,
                setWorkspaces,
                workspaces,
                setOpen,
                setWorkspaceName,
                setWorkspaceDescription
              )
            }
            variant="contained"
            sx={{ mt: 2 }}
          >
            Create
          </Button>
        </Paper>
      </Modal>

      {/* Workspaces List */}
      <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
        {workspaces.length > 0 ? (
          workspaces.map((ws) => (
            <Grid item key={ws.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  cursor: "pointer",
                  backgroundColor: "rgb(30, 30, 30)",
                  color: "white",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.05)", boxShadow: 3 },
                }}
                onClick={() => navigate(`/dashboard`)} // Updated to navigate to Dashboard
              >
                <CardContent>
                  <Typography variant="h6">{ws.name}</Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    {ws.description || "No description available"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ color: "white", mt: 4 }}>
            No workspaces found.
          </Typography>
        )}
      </Grid>
    </div>
  );
}

export default Workspaces;