import { useState, useEffect } from "react";
import {
  CssBaseline, GlobalStyles, Box, Skeleton, ThemeProvider, Button, Paper, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { createCustomTheme } from "./Components/Functions/themeFunctions";
import {
  loadBoards, createBoard, selectBoard, handleEditClick, handleNameChange, handleNameSave, deleteBoard
} from "./Components/Dashboard/DashboardFunctions/dashboardFunctions";
import { handleMenu, handleClose, useTimer } from "./Components/Functions/eventHandlerFunctions";
import { handleLogout } from "./Components/Functions/navigationFunctions";
import { fetchUserData } from "./Components/Functions/fetchFunctions";
import { useDarkModeEffect } from "./Components/Functions/themeFunctions";
import AppbarWithMenu  from "./Components/AppBar/AppbarWithMenu";
import BoardList  from "./Components/Dashboard/DashboardComponents/BoardList";
import BoardModal  from "./Components/Dashboard/DashboardComponents/BoardModal";
import { getUpcomingTasks } from "./Components/Board/BoardFunctions/cardFunctions";


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
  const loading = !useTimer(2000); // Loading state for 2 seconds
  const [showNotification, setShowNotification] = useState(false);
  const [dueTomorrow, setDueTomorrow] = useState([]);



  useEffect(() => {
    let isMounted = true;
    loadBoards(workspaceId, (boards) => {
      if (isMounted) setBoards(boards);
    }, (activeBoard) => {
      if (isMounted) setActiveBoard(activeBoard);
    });
    getUpcomingTasks(2).then(tasks => {
          if (tasks.length > 0) {
            setDueTomorrow(tasks);
            setShowNotification(true);
          }
        });
    return () => {
      isMounted = false;
    };
  }, [workspaceId]);


  useEffect(() => {
    let isMounted = true;
    fetchUserData(undefined, navigate, (user) => {
      if (isMounted) setUser(user);
    });
    return () => {
      isMounted = false;
    };
  }, [navigate]); // Removed 'location' from dependencies

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
        {loading ? (
          // Skeleton Loader
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100vh",
            }}
          >
            <Skeleton height={50} width={300} style={{ marginBottom: "1rem" }} />
            <Skeleton height={30} width={200} style={{ marginBottom: "1rem" }} />
            <Skeleton height={400} width={600} />
          </Box>
        ) : (
          
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              mt: 8,
              minHeight: "100vh",
            }}
          >
            <Box>
              {!showNotification && (
                <Button
                  onClick={() => setShowNotification(true)}
                  sx={{
                    position: "fixed",
                    top: 55,
                    right: 0,
                    zIndex: 9999,
                    bgcolor: "#1e3a8a",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: "8px",
                    px: 2.5,
                    py: 1,
                    fontSize: "15px",
                    textTransform: "none",
                    boxShadow: "0 1px 4px rgba(30,58,138,0.10)",
                    "&:hover": { bgcolor: "#2563eb" }
                  }}
                  variant="contained"
                >
                  🔔
                </Button>
              )}

              {/* Your Notification Paper */}
              {showNotification && (
                <Paper
                  elevation={8}
                  sx={{
                    position: "fixed",
                    top: 85,
                    right: 24,
                    zIndex: 9999,
                    background: "rgba(30, 58, 138, 0.35)",
                    border: "1px solid #60a5fa",
                    boxShadow: "0 2px 16px rgba(30, 58, 138, 0.15)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    p: "16px 22px",
                    borderRadius: "14px",
                    minWidth: "260px",
                    maxWidth: "340px",
                    fontSize: "15px",
                    color: "#f9fafb"
                  }}
                >
                  <Typography fontWeight={700} mb={1} fontSize="16px" letterSpacing={0.5}>
                    <span style={{ color: "#60a5fa" }}>🔔</span> <strong>Reminder:</strong> Tasks due dates that are close.
                  </Typography>
                  <List dense disablePadding sx={{ fontSize: "15px", pl: 2 }}>
                    {dueTomorrow.map((task) => (
                      <ListItem key={task.id} disableGutters sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={
                            <Box component="span">
                              {'(Workspace: '}
                              <Box component="span" sx={{ color: "#3b82f6", fontWeight: "bold" }}>
                                {task.workspace_name}
                              </Box>
                              {' | Board: '}
                              <Box component="span" sx={{ color: "#3b82f6", fontWeight: "bold" }}>
                                {task.board_name}
                              </Box>
                              {' | Column: '}
                              <Box component="span" sx={{ color: "#3b82f6", fontWeight: "bold" }}>
                                {task.title}
                              </Box>
                              {') Task: '}
                              <Box component="span" sx={{ fontWeight: "bold", color: "#f9fafb" }}>
                                {task.text}
                              </Box>
                              <Box component="span" sx={{ color: "#facc15", fontSize: "13px" }}>
                                {" "} (Due: {new Date(task.due_date).toLocaleDateString()})
                              </Box>
                            </Box>
                          }
                          sx={{ m: 0 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    onClick={() => setShowNotification(false)}
                    sx={{
                      mt: 2,
                      bgcolor: "rgba(96, 165, 250, 0.15)",
                      border: "1px solid #60a5fa",
                      borderRadius: "7px",
                      px: 3,
                      py: 0.5,
                      color: "#fff",
                      fontWeight: 600,
                      float: "right",
                      fontSize: "14px",
                      textTransform: "none",
                      boxShadow: "0 1px 4px rgba(30,58,138,0.06)",
                      "&:hover": {
                        bgcolor: "rgba(96, 165, 250, 0.25)"
                      }
                    }}
                    size="small"
                    variant="contained"
                  >
                    Dismiss
                  </Button>
                </Paper>
              )}
            </Box>
            {activeBoard ? null : (
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
        )}
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