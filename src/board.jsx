import React, { useState, useRef } from "react";
import { Box, Drawer, List, Typography, IconButton, ThemeProvider } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { createCustomTheme } from "./Components/Functions/themeFunctions";
import { useDarkModeEffect, useColumnsEffect, useFetchUserEffect, useFetchColumnsEffect, useScrollBarEffect } from "./Components/Board/BoardFunctions/useBoardEffects";
import AppBarWithMenu from "./Components/Board/BoardComponents/AppbarWithMenu";
import ColumnList from "./Components/Board/BoardComponents/Columnlist";
import CustomScrollbar from "./Components/Board/BoardComponents/CustomScrollbar";
import { handleWheelScroll } from "./Components/Functions/eventHandlerFunctions";

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
  const columnsContainerRef = useRef(null);
  const scrollbarRef = useRef(null);

  useDarkModeEffect(darkMode, setDarkMode);
  useColumnsEffect(columns, setColumns);
  useFetchUserEffect(location, navigate, setUser);
  useFetchColumnsEffect(id, setColumns);
  useScrollBarEffect(columnsContainerRef, scrollbarRef);

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
          <Box
            ref={columnsContainerRef}
            
            sx={{
              display: "flex",
              overflowX: "auto", // Enable horizontal scrolling
              
              padding: "16px", // Optional padding
              width: "100%", // Ensure it takes the full width
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: `${columns.length * 266}px`, // Dynamically set the width based on the number of columns
              }}
            >
              <ColumnList id={id} columns={columns} setColumns={setColumns} draggingCard={draggingCard} setDraggingCard={setDraggingCard} draggingColumn={draggingColumn} setDraggingColumn={setDraggingColumn} darkMode={darkMode} drawerOpen={drawerOpen} />
            </Box>
          </Box>  
          <CustomScrollbar
            columns={columns}
            darkMode={darkMode}
            drawerOpen={drawerOpen}
            columnsContainerRef={columnsContainerRef}
            scrollbarRef={scrollbarRef} // Pass scrollbarRef
          />
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Board;