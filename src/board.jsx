import React, { useState, useRef } from "react";
import { Box, Drawer, List, Typography, IconButton, ThemeProvider } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { createCustomTheme } from "./Components/Functions/themeFunctions";
import { useDarkModeEffect, useColumnsEffect, useFetchUserEffect, useFetchColumnsEffect } from "./Components/Board/BoardFunctions/useBoardEffects";
import AppBarWithMenu from "./Components/Board/BoardComponents/AppbarWithMenu";
import ColumnList from "./Components/Board/BoardComponents/Columnlist";
import CustomScrollbar from "./Components/Board/BoardComponents/CustomScrollbar";

const Board = () => {
  const { id } = useParams();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem("columns");
    return savedColumns ? JSON.parse(savedColumns) : [];
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [draggingColumn, setDraggingColumn] = useState(null);
  const [draggingCard, setDraggingCard] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = createCustomTheme(darkMode);

  useDarkModeEffect(darkMode, setDarkMode);
  useColumnsEffect(columns, setColumns);
  useFetchUserEffect(location, navigate, setUser);
  useFetchColumnsEffect(id, setColumns);

  return (
    <ThemeProvider theme={theme}>
      <div onWheel={(e) => handleWheelScroll(e, columnsContainerRef, scrollbarRef)}>
        <Box sx={{ display: "flex", position: "relative", backgroundImage: darkMode ? 'url("/stary.jpg")' : 'url("/cloud.jpg")', backgroundSize: "cover", backgroundPosition: "center", minHeight: "100vh", width: "100vw", overflow: "hidden" }}>
          <AppBarWithMenu darkMode={darkMode} setDarkMode={setDarkMode} anchorEl={anchorEl} setAnchorEl={setAnchorEl} user={user} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
          <Drawer variant="persistent" anchor="left" open={drawerOpen} sx={{ position: "fixed", width: 240, flexShrink: 0, zIndex: 1300, "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box", zIndex: 1300 } }}>
            <Box sx={{ display: "flex", alignItems: "center", pt: 15 }}>
              <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
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
                        <IconButton
                          onClick={() => removeColumn(id, column.id, columns, setColumns)} // Call removeColumn with boardId, columnId, columns, and setColumns
                          sx={{ borderRadius: "24px" }}
                        >
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

export default Board;