import React, { useState, useEffect } from "react";
import {
  CssBaseline, GlobalStyles, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Typography, Paper, Button, TextField, Modal, Menu, MenuItem, AppBar, Toolbar
} from "@mui/material";
import { Add, Dashboard as DashboardIcon, Brightness4, Brightness7, Edit, Menu as MenuIcon } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { createCustomTheme } from "./Components/Functions/themeFunctions";
import {
  loadBoards, createBoard, selectBoard, handleEditClick, handleNameChange, handleNameSave
} from "./Components/Functions/dashboardFunctions";
import { handleMenu, handleClose, toggleDrawer } from "./Components/Functions/eventHandlerFunctions";
import { handleLogout } from "./Components/Functions/navigationFunctions";
import axios from "axios";

const Dashboard = () => {
  const { workspaceId } = useParams(); // Extract workspaceId from URL
  // Initialize darkMode state from local storage, or default to true if not set
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true; // Initialize from local storage
  });
  const [drawerOpen, setDrawerOpen] = useState(true); // Drawer state
  const [boards, setBoards] = useState([]); // Boards state
  const [activeBoard, setActiveBoard] = useState(null); // Active board state
  const [editingBoardId, setEditingBoardId] = useState(null); // Editing board state
  const [boardName, setBoardName] = useState(""); // Added name state
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for menu
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    loadBoards(workspaceId, setBoards, setActiveBoard);
  }, [workspaceId]);

  const theme = createCustomTheme(darkMode);

  // Use useEffect to update local storage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode)); // Save mode to local storage
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode); // Toggle dark mode state
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token'); // Retrieve the token from localStorage

    if (!storedToken) {
      navigate("/"); // Redirect to the home page if no token is found
      return;
    }
    axios // fetch user data
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
  }, [navigate]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{ body: { overflow: 'hidden' } }} />
      <AppBar position="fixed" sx={{ zIndex: 1301, backgroundColor: darkMode ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(3px)", boxShadow: "none", }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => toggleDrawer(setDrawerOpen, drawerOpen)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <p>Progresstify</p>
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate("/workspace")}
            sx={{ color: darkMode ? "white" : "black", textTransform: "none" }}
          >
            Home
          </Button>
          {user && (
            <div>
              <Button
                variant="outlined"
                onClick={(e) => handleMenu(e, setAnchorEl)}
                sx={{ color: darkMode ? "white" : "black", textTransform: "none" }}
              >
                Account
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <div>
        <Box
          sx={{
            display: "flex",
            position: "relative",
            backgroundImage: darkMode ? 'url("/stary.jpg")' : 'url("/cloud.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
            width: "100vw",
            overflow: 'hidden', //to hide the damn scroll bar
          }}
        >
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              mt: 8,
              minHeight: "100vh",
            }}
          >
            <Typography variant="h4"> </Typography> {/* Display workspace ID */}
            {activeBoard ? (
              <Typography variant="h4">Board: {activeBoard.name}</Typography>
            ) : (
              <div
                style={{
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  borderRadius: "8px", // Optional: To mimic Paper's rounded corners
                }}
              >
                <Typography variant="h4" sx={{color: "white"}}>Select or Create a Board</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={() => setModalOpen(true)}
                  sx={{ mt: 2, backgroundColor: "transparent", color: "white", border: "1px solid" , fontWeight: "700" }}
                >
                  Create Board
                </Button>
                {boards.map((board) => (
                  <ListItem
                    button
                    key={board.id}
                    onClick={() => selectBoard(board, setActiveBoard, setEditingBoardId, navigate)}
                  >
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    {editingBoardId === board.id ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <TextField
                          value={boardName}
                          onChange={(e) => handleNameChange(e, setBoardName)}
                          onBlur={() => handleNameSave(workspaceId, board, boards, setBoards, boardName, setEditingBoardId)}
                          onKeyPress={(e) => e.key === 'Enter' && handleNameSave(workspaceId, board, boards, setBoards, boardName, setEditingBoardId)}
                          autoFocus
                          sx={{ mb: 1 }}
                        />
                      </Box>
                    ) : (
                      <ListItemText primary={board.name} />
                    )}
                    <IconButton onClick={() => handleEditClick(board, setEditingBoardId, setBoardName)}>
                      <Edit />
                    </IconButton>
                  </ListItem>
                ))}
              </div>
            )}
          </Box>

          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <Paper
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                padding: 4,
              }}
            >
              <Typography variant="h6">Board</Typography>
              <TextField
                label="Board Name"
                fullWidth
                value={boardName}
                onChange={(e) => handleNameChange(e, setBoardName)}
                sx={{ mt: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => createBoard(workspaceId, boards, setBoards, boardName, setBoardName, setModalOpen)}
                sx={{ mt: 2 }}
              >
                Create
              </Button>
            </Paper>
          </Modal>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;