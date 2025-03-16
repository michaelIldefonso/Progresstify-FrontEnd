import React, { useState, useEffect } from "react";
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Typography, Paper, Button, TextField, Modal, AppBar, Toolbar, Menu, MenuItem
} from "@mui/material";
import { Add, Dashboard as DashboardIcon, Brightness4, Brightness7, Edit, Menu as MenuIcon } from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { createCustomTheme } from "./Components/Functions/themeFunctions";
import {
  loadBoards, createBoard, selectBoard, handleEditClick, handleNameChange, handleNameSave
} from "./Components/Functions/dashboardFunctions";
import { handleMenu, handleClose, toggleDrawer } from "./Components/Functions/eventHandlerFunctions";
import { handleLogout } from "./Components/Functions/navigationFunctions";

const Dashboard = () => {
  const { workspaceId } = useParams(); // Extract workspaceId from URL
  const [darkMode, setDarkMode] = useState(true); // Dark mode state
  const [drawerOpen, setDrawerOpen] = useState(true); // Drawer state
  const [boards, setBoards] = useState([]); // Boards state
  const [activeBoard, setActiveBoard] = useState(null); // Active board state
  const [editingBoardId, setEditingBoardId] = useState(null); // Editing board state
  const [boardName, setBoardName] = useState(""); // Added name state
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [user, setUser] = useState({ // User data state
    userEmail: "user@example.com",
    userId: "12345",
    userOauth_id: "oauth12345",
  });
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for menu
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    loadBoards(workspaceId, setBoards, setActiveBoard);
  }, [workspaceId]);

  const theme = createCustomTheme(darkMode);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          position: "relative",
          backgroundImage: darkMode ? 'url("/stary.jpg")' : 'url("/cloud.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <AppBar 
          position="fixed"
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => toggleDrawer(setDrawerOpen, drawerOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              <img src="/hahaha.png" alt="Sitemark" />
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate("/workspace")} // Use the navigate function
              sx={{
                color: "black",
                textTransform: "none",
                backgroundColor: "#30A8DB",
                boxShadow: 3,
                mr: 2,
              }}
            >
              Home
            </Button>
            {user && (
              <div>
                <Button
                  variant="outlined"
                  onClick={(e) => handleMenu(e, setAnchorEl)}
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
        <Drawer
          variant="persistent"
          anchor="left"
          open={drawerOpen}
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
            },
          }} //line 144 niremove ung image line 145 dun inudjust location nung darkmode sa margintop
        >
          <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", pt: 2 }}>
            
            <Box sx={{ display: "flex", alignItems: "center", marginTop: 14 }}>
              <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <Brightness4 /> : <Brightness7 />}
              </IconButton>
              <Typography variant="h6" sx={{ }}>
                {darkMode ? "Dark Mode" : "Light Mode"}
              </Typography>
            </Box>
          </Box>
          <List>
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
            <ListItem button onClick={() => setModalOpen(true)}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Create Board" />
            </ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            minHeight: "100vh",
          }}
        >
          <Typography variant="h4">Workspace ID: {workspaceId}</Typography> {/* Display workspace ID */}
          {activeBoard ? (
            <Typography variant="h4">Board: {activeBoard.name}</Typography>
          ) : (
            <Paper
              elevation={3}
              sx={{
                p: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">Select or Create a Board</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => setModalOpen(true)}
                sx={{ mt: 2 }}
              >
                Create Board
              </Button>
            </Paper>
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
    </ThemeProvider>
  );
};

export default Dashboard;