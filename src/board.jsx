import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Button, Menu, MenuItem, Drawer, List, ListItem, ListItemIcon, ListItemText,
  IconButton, Box, Grid, Paper, TextField, Typography, Card, CardContent, Checkbox, FormControlLabel
} from "@mui/material";
import {
  Dashboard, ListAlt, People, CloudUpload, Add, Delete, Close, DeleteForever, Brightness4,
  Brightness7, Menu as MenuIcon
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";

const Workspace = () => {
  const { id } = useParams(); // Get the id from the route parameters
  const [darkMode, setDarkMode] = useState(true); // Dark mode state
  const [columns, setColumns] = useState([]); // For columns and cards
  const [newMember, setNewMember] = useState("");
  const [members, setMembers] = useState(["Alsim", "Bobby", "Charlie"]);
  const [draggingColumn, setDraggingColumn] = useState(null); // For drag and drop
  const [draggingCard, setDraggingCard] = useState(null); // For drag and drop
  const [anchorEl, setAnchorEl] = useState(null); // For account menu
  const [user, setUser] = useState({ // User data
    userEmail: "user@example.com",
    userId: "12345",
    userOauth_id: "oauth12345",
  });
  const [drawerOpen, setDrawerOpen] = useState(true); // For drawer visibility or list
  const navigate = useNavigate(); // Navigation hook
  const location = useLocation();// Location hook

  const theme = createTheme({ // Custom theme
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#1da7de",
      },
      secondary: {
        main: "#ff4081",
      },
      background: {
        default: darkMode ? "#121212" : "#ffffff",
        paper: darkMode ? "#1e1e1e" : "#f5f5f5",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            margin: "8px 0",
            borderRadius: "24px", // Making buttons rounder
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            borderRadius: "50%", // Making checkboxes round
          },
        },
      },
    },
  });

  useEffect(() => { // Fetch user data 
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
  }, [navigate, location.search]);

  const toggleDarkMode = () => { // Toggle dark mode
    setDarkMode(!darkMode);
  };

  const addColumn = () => { // Add a new column
    setColumns([
      ...columns,
      { id: Date.now(), title: "", isEditing: true, cards: [], newCardText: "", isAddingCard: false },
    ]);
  };

  const renameColumn = (columnId, newTitle) => { // Rename a column
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col
      )
    );
  };

  const finalizeColumnTitle = (columnId) => { // Finalize column title
    setColumns(
      columns.map((col) =>
        col.id === columnId && col.title.trim()
          ? { ...col, isEditing: false }
          : col
      )
    );
  };

  const addCard = (columnId) => {   // Add a new card
    setColumns(
      columns.map((col) => {
        if (col.id === columnId && col.newCardText.trim()) {
          return {
            ...col,
            cards: [...col.cards, { id: Date.now(), text: col.newCardText, checked: false }],
            newCardText: "",
            isAddingCard: false,
          };
        }
        return col;
      })
    );
  };

  const removeCard = (columnId, cardId) => { // Remove a card
    setColumns(
      columns.map((col) => {
        if (col.id === columnId) {
          return { ...col, cards: col.cards.filter((card) => card.id !== cardId) };
        }
        return col;
      })
    );
  };

  const handleCardInputChange = (columnId, text) => { // Handle card input change
    setColumns(
      columns.map((col) => (col.id === columnId ? { ...col, newCardText: text } : col))
    );
  };

  const handleCardInputKeyPress = (event, columnId) => { // Handle card input key press
    if (event.key === "Enter") {
      addCard(columnId);
    }
  };

  const handleColumnDragStart = (event, columnId) => { // Handle column drag start
    setDraggingColumn(columnId);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleCardDragStart = (event, cardId, columnId) => { // Handle card drag start
    setDraggingCard({ cardId, columnId });
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (event, targetColumnId) => { // Handle drop
    event.preventDefault(); // Prevent default behavior
    const { cardId, columnId } = draggingCard; // Get dragging card and column
    if (cardId && columnId !== targetColumnId) {
      setColumns(
        columns.map((col) => {
          if (col.id === columnId) {
            return { ...col, cards: col.cards.filter((card) => card.id !== cardId) };
          }
          if (col.id === targetColumnId) {
            const movedCard = columns
              .find((col) => col.id === columnId)
              .cards.find((card) => card.id === cardId);
            return { ...col, cards: [...col.cards, movedCard] };
          }
          return col;
        })
      );
    }
    setDraggingCard(null); // Reset dragging card
  };

  const handleTrashDrop = (event) => { // Handle trash drop
    event.preventDefault();
    const { cardId, columnId } = draggingCard;
    if (cardId && columnId) {
      setColumns(
        columns.map((col) => {
          if (col.id === columnId) {
            return { ...col, cards: col.cards.filter((card) => card.id !== cardId) };
          }
          return col;
        })
      );
    }
    setDraggingCard(null); // Reset dragging card
  };

  const handleMenu = (event) => { // Handle menu
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => { // Handle close
    setAnchorEl(null);
  };

  const toggleDrawer = () => { // Toggle drawer
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => { // Handle logout
    localStorage.removeItem("token");
    navigate("/"); // Navigate to login
  };

  const navigateHome = () => {
    navigate("/workspace"); // Navigate to home
  };

  const handleCheckboxChange = (columnId, cardId, checked) => { // Handle checkbox change
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((card) =>
                card.id === cardId ? { ...card, checked: checked } : card
              ),
            }
          : col
      )
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box // Main container
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
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              <img src="/hahaha.png" alt="Sitemark" />
            </Typography>
            <Button
              variant="outlined"
              onClick={navigateHome}
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
          }}
        >
          
          <Box sx={{ display: "flex", alignItems: "center", pt: 15 }}>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
            <Typography variant="h6" sx={{ marginLeft: 1 }}>
              {darkMode ? "Dark Mode" : "Light Mode"}
            </Typography>
          </Box>
          <List>
            {/* Add any additional navigation items here */}
          </List>
        </Drawer>
        <Box
          sx={{
            flexGrow: 1,
            padding: 3,
            marginLeft: drawerOpen ? "0px" : "0", /*column*/
            marginTop: "83px",
            transition: "margin-left 0.3s",
          }}
        >
          
          <Button variant="contained" startIcon={<Add />} onClick={addColumn} sx={{ borderRadius: "24px" }}>
            Add Column
          </Button>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            {columns.map((column) => (
              <Grid
                item
                key={column.id}
                xs={12}
                sm={6}
                md={4}
                onDrop={(e) => handleDrop(e, column.id)}
                onDragOver={(e) => e.preventDefault()}
                draggable
                onDragStart={(e) => handleColumnDragStart(e, column.id)}
              >
                <Paper
                  sx={{
                    padding: 2,
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.02)" },
                    borderRadius: "24px", // Rounded corners for paper
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    {column.isEditing ? (
                      <TextField
                        fullWidth
                        placeholder="Enter column name"
                        value={column.title}
                        onChange={(e) => renameColumn(column.id, e.target.value)}
                        onBlur={() => finalizeColumnTitle(column.id)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            finalizeColumnTitle(column.id);
                            e.preventDefault();
                          }
                        }}
                        autoFocus
                        sx={{ borderRadius: "24px" }} // Rounded corners for text field
                      />
                    ) : (
                      <Typography
                        variant="h6"
                        onClick={() =>
                          setColumns(
                            columns.map((col) =>
                              col.id === column.id ? { ...col, isEditing: true } : col
                            )
                          )
                        }
                      >
                        {column.title || "Untitled Column"}
                      </Typography>
                    )}
                    <IconButton onClick={() => setColumns(columns.filter((col) => col.id !== column.id))} sx={{ borderRadius: "24px" }}>
                      <Close />
                    </IconButton>
                  </Box>
                  <Box sx={{ marginTop: 2 }}>
                    {column.isAddingCard && (
                      <TextField
                        fullWidth
                        placeholder="Enter card text and press Enter"
                        value={column.newCardText}
                        onChange={(e) => handleCardInputChange(column.id, e.target.value)}
                        onKeyPress={(e) => handleCardInputKeyPress(e, column.id)}
                        onBlur={() => addCard(column.id)}
                        autoFocus
                        sx={{ marginBottom: 1, borderRadius: "24px" }} // Rounded corners for text field
                      />
                    )}
                    {column.cards.map((card) => (
                      <Card
                        key={card.id}
                        sx={{
                          marginBottom: 1,
                          backgroundColor: "rgba(240, 232, 232, 0.1)", // Making card transparent
                          transition: "transform 0.3s",
                          "&:hover": { transform: "scale(1.02)" },
                          borderRadius: "24px", // Rounded corners for card
                        }}
                        draggable
                        onDragStart={(e) => handleCardDragStart(e, card.id, column.id)}
                      >
                        <CardContent
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderRadius: "24px", // Rounded corners for card content
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={card.checked}
                                onChange={(e) => handleCheckboxChange(column.id, card.id, e.target.checked)}
                                sx={{ borderRadius: "50%" }} // Making checkbox round
                              />
                            }
                            label={<Typography>{card.text}</Typography>}
                          />
                          <IconButton edge="end" onClick={() => removeCard(column.id, card.id)}>
                            <Delete />
                          </IconButton>
                        </CardContent>
                      </Card>
                    ))}
                    <Button
                      variant="text"
                      startIcon={<Add />}
                      onClick={() => setColumns(
                        columns.map((col) =>
                          col.id === column.id ? { ...col, newCardText: "", isAddingCard: true } : col
                        )
                      )}
                      sx={{ borderRadius: "24px", marginTop: 1 }}
                    >
                      Add a card
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              position: "fixed",
              right: 16,
              bottom: 16,
              backgroundColor: "red",
              color: "#fff",
              borderRadius: "50%",
              width: 56,
              height: 56,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onDrop={handleTrashDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <DeleteForever fontSize="large" />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Workspace;