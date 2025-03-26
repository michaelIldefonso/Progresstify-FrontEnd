import React, { useState, useEffect, useRef } from "react";
import {
  AppBar, Toolbar, Button, Menu, MenuItem, Drawer, List, ListItemIcon, ListItemText,
  IconButton, Box, Paper, TextField, Typography, Card, CardContent, Checkbox, FormControlLabel
} from "@mui/material";
import {
  Dashboard, ListAlt, People, CloudUpload, Add, Delete, Close, DeleteForever, Brightness4,
  Brightness7, Menu as MenuIcon
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { showColumn, renameColumn, finalizeColumnTitle, addCard, removeCard, handleCardInputChange, handleCardInputKeyPress, handleCheckboxChange } from "./Components/Functions/cardColumnFunctions";
import { createCustomTheme } from "./Components/Functions/themeFunctions";
import { handleMenu, handleClose, toggleDrawer } from "./Components/Functions/eventHandlerFunctions";
import { navigateHome, handleLogout } from "./Components/Functions/navigationFunctions";

const handleColumnDragStart = (e, columnId, setDraggingColumn) => {
  setDraggingColumn(columnId);
  e.dataTransfer.effectAllowed = "move";
};

const handleCardDragStart = (e, cardId, columnId, setDraggingCard) => {
  setDraggingCard({ cardId, columnId });
  e.dataTransfer.effectAllowed = "move";
};

const handleDrop = (e, targetColumnId, draggingCard, columns, setColumns, setDraggingCard) => {
  e.preventDefault();
  if (!draggingCard) return;

  const { cardId, columnId } = draggingCard;

  // Check if the source column and target column are the same
  if (columnId === targetColumnId) {
    setDraggingCard(null);
    return;
  }

  const sourceColumn = columns.find((col) => col.id === columnId);
  const targetColumn = columns.find((col) => col.id === targetColumnId);

  const card = sourceColumn.cards.find((c) => c.id === cardId);

  const updatedSourceCards = sourceColumn.cards.filter((c) => c.id !== cardId);
  const updatedTargetCards = [...targetColumn.cards, card];

  const updatedColumns = columns.map((col) => {
    if (col.id === columnId) {
      return { ...col, cards: updatedSourceCards };
    } else if (col.id === targetColumnId) {
      return { ...col, cards: updatedTargetCards };
    } else {
      return col;
    }
  });

  setColumns(updatedColumns);
  setDraggingCard(null);
};

const handleTrashDrop = (e, draggingCard, columns, setColumns, setDraggingCard) => {
  e.preventDefault();
  if (!draggingCard) return;

  const { cardId, columnId } = draggingCard;
  const sourceColumn = columns.find((col) => col.id === columnId);

  const updatedSourceCards = sourceColumn.cards.filter((c) => c.id !== cardId);

  const updatedColumns = columns.map((col) => {
    if (col.id === columnId) {
      return { ...col, cards: updatedSourceCards };
    } else {
      return col;
    }
  });

  setColumns(updatedColumns);
  setDraggingCard(null);
};

const Workspace = () => {
  const { id } = useParams(); // Get the id from the route parameters
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem("columns");
    return savedColumns ? JSON.parse(savedColumns) : [];
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({
    userEmail: "user@example.com",
    userId: "12345",
    userOauth_id: "oauth12345",
  });
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [draggingColumn, setDraggingColumn] = useState(null);
  const [draggingCard, setDraggingCard] = useState(null);
  const navigate = useNavigate(); // Navigation hook
  const location = useLocation(); // Location hook
  const columnsContainerRef = useRef(null); // Reference for columns container (for horizontal scrolling)
  const scrollbarRef = useRef(null); // Reference for custom scrollbar

  const theme = createCustomTheme(darkMode); // Create custom theme based on dark mode

  // Save dark mode preference to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Save columns state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  // Fetch user data and handle authentication on component mount
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

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/data`, { 
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

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Add a new column and scroll to the end of the columns container
  const handleAddColumn = async () => {
    await showColumn(id, columns, setColumns);
    if (columnsContainerRef.current) {
      columnsContainerRef.current.scrollLeft = columnsContainerRef.current.scrollWidth;
    }
  };

  // Handle wheel scroll to move columns and scrollbar simultaneously
  const handleWheelScroll = (e) => {
    if (!e.target.closest('.column')) {
      if (columnsContainerRef.current && scrollbarRef.current) {
        columnsContainerRef.current.scrollLeft += e.deltaY;
        scrollbarRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  // Handle scroll event for the custom scrollbar
  const handleScrollbarScroll = (e) => {
    if (columnsContainerRef.current) {
      columnsContainerRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  // Handle scroll event for columns to move scrollbar simultaneously
  const handleColumnsScroll = (e) => {
    if (scrollbarRef.current) {
      scrollbarRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div onWheel={handleWheelScroll}> {/* Handle wheel scroll to move columns and scrollbar */}
        <Box // Main container
          sx={{
            display: "flex",
            position: "relative",
            backgroundImage: darkMode ? 'url("/stary.jpg")' : 'url("/cloud.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
            width: "100vw",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "fixed",
            top: 0,
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            backgroundColor: "transparent",
            zIndex: 1301,
          }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => toggleDrawer(setDrawerOpen, drawerOpen)}
              sx={{ mr: 2, color: "white" }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <img src="/hahaha.png" alt="Sitemark" />
            </Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/workspace")}
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
                      marginRight: "40px"
                    }}
                  >
                    Account
                  </Button>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
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
            </div>
          </div>

          <Drawer
            variant="persistent"
            anchor="left"
            open={drawerOpen}
            sx={{
              position: "fixed",
              width: 240,
              flexShrink: 0,
              zIndex: 1300,
              "& .MuiDrawer-paper": {
                width: 240,
                boxSizing: "border-box",
                zIndex: 1300,
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

          {/* COLUMN AREA */}
          
          <Box
            sx={{
              flexGrow: 1,
              padding: 3,
              marginLeft: drawerOpen ? "240px" : "16px", // Adjusted based on drawer state
              marginTop: "140px",
              transition: "margin-left 0.3s",
              overflow: "hidden",
            }}
          >
            <div style={{ height: "calc(100% - 60px)", overflow: "hidden" }}> {/* Wrapping the Box component inside a div */}
              <Box
                sx={{
                  position: "fixed", // Keep the button fixed on the screen
                  top: "120px", // Adjust the top position if necessary
                  left: drawerOpen ? "240px" : "16px", // Adjust the left position based on sidebar state
                  zIndex: 1200, // Ensure it stays on top of other content
                  transition: "left 0.3s", // Smooth transition for when sidebar opens/closes
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddColumn}
                  sx={{ borderRadius: "24px", marginLeft: "24px" }}
                >
                  Add Column
                </Button>
              </Box>

              {/* Horizontal Scrollable Area for Columns */}
              <Box
                ref={columnsContainerRef}
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  height: "100%",
                  paddingTop: 2,
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  "-ms-overflow-style": "none",  /* IE and Edge */
                  "scrollbar-width": "none",  /* Firefox */
                }}
                onScroll={handleColumnsScroll} // Add scroll event handler to sync with custom scrollbar
              >
                {columns.map((column) => (
                  <Box
                    key={column.id}
                    className="column"
                    sx={{
                      display: "inline-block",
                      minWidth: "250px",
                      marginRight: "16px",
                    }}
                    onWheel={(e) => {
                      e.stopPropagation(); // Prevent the event from propagating to the parent
                    }}
                    onDrop={(e) => handleDrop(e, column.id, draggingCard, columns, setColumns, setDraggingCard)} //card dissappearing fix
                    onDragOver={(e) => e.preventDefault()}
                    draggable
                    onDragStart={(e) => handleColumnDragStart(e, column.id, setDraggingColumn)}
                  >
                    <Paper
                      sx={{
                        padding: 2,
                        transition: "transform 0.3s",
                        "&:hover": { transform: "scale(1.02)" },
                        borderRadius: "24px",
                        marginBottom: "10px",
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        {column.isEditing ? (
                          <TextField
                            fullWidth
                            placeholder="Enter column name"
                            value={column.title}
                            onChange={(e) => renameColumn(id, columns, setColumns, column.id, e.target.value)} // Pass boardId (id)
                            onBlur={() => finalizeColumnTitle(columns, setColumns, column.id)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                finalizeColumnTitle(columns, setColumns, column.id);
                                e.preventDefault();
                              }
                            }}
                            // autoFocus
                            sx={{ borderRadius: "24px" }}
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
                        {/* inside the column scrollbar vertical */}
                      <Box
                        sx={{
                          marginTop: 2,
                          maxHeight: "400px", // Set a fixed height for the cards area
                          overflowY: "auto", // Enable vertical scrolling
                          paddingRight: "10px", // Add padding to make space for the vertical scrollbar
                          "&::-webkit-scrollbar": {
                            width: "5px", // Customize scrollbar width for Webkit browsers
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: darkMode ? "rgba(8, 8, 8, 0.5)" : "rgba(255, 253, 253, 0.5)", // Customize scrollbar thumb based on theme
                            borderRadius: "8px",
                          },
                          "&::-webkit-scrollbar-track": {
                            backgroundColor: "transparent", // Customize scrollbar track
                          },
                        }}
                      >
                        {column.isAddingCard && (
                          <TextField
                            fullWidth
                            placeholder="Enter card text and press Enter"
                            value={column.newCardText}
                            onChange={(e) => handleCardInputChange(columns, setColumns, column.id, e.target.value)}
                            onKeyPress={(e) => handleCardInputKeyPress(e, column.id, columns, setColumns)}
                            onBlur={() => addCard(columns, setColumns, column.id)}
                            autoFocus
                            sx={{ marginBottom: 1, borderRadius: "24px" }}
                          />
                        )}
                        {column.cards.map((card) => (
                          <Card
                            key={card.id}
                            sx={{
                              marginBottom: 1,
                              backgroundColor: "rgba(240, 232, 232, 0.1)",
                              transition: "transform 0.3s",
                              "&:hover": { transform: "scale(1.02)" },
                              borderRadius: "24px",
                            }}
                            draggable
                            onDragStart={(e) => handleCardDragStart(e, card.id, column.id, setDraggingCard)}
                          >
                            <CardContent
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderRadius: "24px",
                              }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={card.checked}
                                    onChange={(e) => handleCheckboxChange(column.id, card.id, e.target.checked, setColumns)}
                                    sx={{ borderRadius: "50%" }}
                                  />
                                }
                                label={<Typography sx={{ wordBreak: "break-word" }}>{card.text}</Typography>}
                              />
                              <IconButton edge="end" onClick={() => removeCard(columns, setColumns, column.id, card.id)}>
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
                  </Box>
                ))}
              </Box>
            </div> {/* Closing the wrapping div here */}
          </Box>

          {/* Custom scrollbar */}
          <Box
            ref={scrollbarRef}
            sx={{
              position: "fixed",
              bottom: 0,
              left: drawerOpen ? "240px" : "16px", // Adjusted based on drawer state
              right: 0,
              zIndex: 1000,
              height: "20px",
              overflowX: "auto",
              scrollbarWidth: "thin", // Thin scrollbar for Firefox
              "&::-webkit-scrollbar": {
                height: "5px", // Thin scrollbar for Webkit browsers
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: darkMode ? "rgba(8, 8, 8, 0.5)" : "rgba(255, 253, 253, 0.5)", // Customize scrollbar thumb based on theme
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent", // Customize scrollbar track
              },
            }}
            onScroll={handleScrollbarScroll} // Add scroll event handler to sync with columns
          >
            <Box sx={{ width: columns.length * 266 + 'px', height: '1px' }} /> {/* Dummy content to make the scrollbar functional */}
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Workspace;