import { useState, useEffect } from "react";
import {
  CssBaseline, GlobalStyles, Box, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { createCustomTheme } from "./Components/Functions/themeFunctions";
import {
  loadBoards, createBoard, selectBoard, handleEditClick, handleNameChange, handleNameSave, deleteBoard
} from "./Components/Dashboard/DashboardFunctions/dashboardFunctions";
import { handleMenu, handleClose,} from "./Components/Functions/eventHandlerFunctions";
import { handleLogout } from "./Components/Functions/navigationFunctions";
import { fetchUserData } from "./Components/Functions/fetchFunctions";
import { useDarkModeEffect } from "./Components/Functions/themeFunctions";
import AppbarWithMenu  from "./Components/AppBar/AppbarWithMenu";
import BoardList  from "./Components/Dashboard/DashboardComponents/BoardList";
import BoardModal  from "./Components/Dashboard/DashboardComponents/BoardModal";


const Dashboard = () => {
  const { workspaceId } = useParams(); // Extract workspaceId from URL
  // Initialize darkMode state from local storage, or default to true if not set
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true; // Initialize from local storage
  });
  const [boards, setBoards] = useState([]); // Boards state
  const [activeBoard, setActiveBoard] = useState(null); // Active board state
  const [editingBoardId, setEditingBoardId] = useState(null); // Editing board state
  const [boardName, setBoardName] = useState(""); // Added name state
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for menu
  const navigate = useNavigate(); // Navigation hook
   // Define loading state

  useEffect(() => {
    loadBoards(workspaceId, setBoards, setActiveBoard);
  }, [workspaceId]);

  useEffect(() => {
    fetchUserData(location, navigate, setUser);
  }, [navigate]);

  const theme = createCustomTheme(darkMode);

  // Use useEffect to update local storage whenever darkMode changes
  useDarkModeEffect(darkMode, setDarkMode);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode); // Toggle dark mode state
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{ body: { overflow: "hidden" } }} />
      <AppbarWithMenu
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        navigate={navigate} 
        user={user}
        anchorEl={anchorEl}
        handleMenu={handleMenu}
        handleClose={handleClose}
        handleLogout={handleLogout}
        setAnchorEl={setAnchorEl}
       
      />
      <Box
        sx={{
          display: "flex",
          position: "relative",
          backgroundImage: darkMode
            ? 'url("/doggosleepin-lofiD.png")'
            : 'url("/doggosleepin-lofiL.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <Box component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, mt: 8, 
          minHeight: "100vh" 
          }}>
          {activeBoard ? (
            null
          ) : (
            <BoardList
              boards={boards}
              activeBoard={activeBoard}
              editingBoardId={editingBoardId}
              boardName={boardName}
              setBoardName={setBoardName}
              setModalOpen={setModalOpen}
              darkMode={darkMode}
              setEditingBoardId={setEditingBoardId}
              navigate={navigate}
              workspaceId={workspaceId}
              setActiveBoard={setActiveBoard}
              setBoards={setBoards}
              selectBoard={selectBoard}
              handleNameChange={handleNameChange}
              handleNameSave={handleNameSave}
              handleEditClick={handleEditClick}
              deleteBoard={deleteBoard}
            />
          )}
        </Box>
        <BoardModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          boardName={boardName}
          setBoardName={setBoardName}
          createBoard={createBoard}
          workspaceId={workspaceId}
          boards={boards}
          setBoards={setBoards}
          darkMode={darkMode}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;