import { useState, useRef } from "react";
import { Box, ThemeProvider } from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { createCustomTheme } from "./Components/Functions/themeFunctions";
import { useColumnsEffect, useFetchUserEffect, useFetchColumnsEffect, useScrollBarEffect } from "./Components/Board/BoardFunctions/useBoardEffects";
import AppBarWithMenu from "./Components/mainComponents/AppbarWithMenu";
import ColumnList from "./Components/Board/BoardComponents/Columnlist";
import CustomScrollbar from "./Components/Board/BoardComponents/CustomScrollbar";
import { handleWheelScroll } from "./Components/Functions/eventHandlerFunctions";
import { useDarkModeEffect } from "./Components/Functions/themeFunctions";

const Board = () => { // Workspace board
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
      {/* Main container for the board */}
      <div onWheel={(e) => handleWheelScroll(e, columnsContainerRef, scrollbarRef)}>
        <Box sx={{ display: "flex",
                   position: "relative", 
                   backgroundImage: darkMode ? 'url("/room2.jpg")' : 'url("/room1.jpg")',
                   backgroundSize: "cover",
                   backgroundPosition: "center", 
                   minHeight: "100vh", width: "100vw", 
                   overflow: "hidden" 
                }}>

          {/* App bar with menu component */}          
          <AppBarWithMenu 
            darkMode={darkMode} 
            toggleDarkMode={() => setDarkMode((prevMode) => !prevMode)} // Fix the prop name
            anchorEl={anchorEl} 
            setAnchorEl={setAnchorEl} 
            user={user} 
          />
      
          {/* Container for the columns */}
          <Box
            ref={columnsContainerRef}
            
            sx={{
              display: "flex",
              overflowY: "auto", 
              
              padding: "16px", // Optional padding
              width: "100%", // Ensure it takes the full width
              scrollbarWidth: "none", // Hide scrollbar (Firefox)

              "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar (Webkit Browsers)
            }}
          >
            {/* Inner container for the column list */}
            <Box
              sx={{
                display: "flex",
                width: `${columns.length * 266}px`, // Dynamically set the width based on the number of columns
              }}
            >
              <ColumnList id={id} columns={columns} setColumns={setColumns} 
              draggingCard={draggingCard} setDraggingCard={setDraggingCard} 
              draggingColumn={draggingColumn} setDraggingColumn={setDraggingColumn} darkMode={darkMode} />
            </Box>
          </Box>  

          {/* Custom scrollbar component */}
          <CustomScrollbar
            columns={columns}
            darkMode={darkMode}
            columnsContainerRef={columnsContainerRef}
            scrollbarRef={scrollbarRef} // Pass scrollbarRef
          />
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Board;