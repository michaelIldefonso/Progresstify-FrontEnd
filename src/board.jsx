import { useState, useRef, useEffect } from "react";
import { Box, ThemeProvider, Skeleton, Button, Paper, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { createCustomTheme, useDarkModeEffect } from "./Components/Functions/themeFunctions";
import { useColumnsEffect, useScrollBarEffect } from "./Components/Board/BoardFunctions/useBoardEffects";
import { fetchUserData } from "./Components/Functions/fetchFunctions";
import AppBarWithMenu from "./Components/AppBar/AppbarWithMenu";
import ColumnList from "./Components/Board/BoardComponents/Columnlist";
import CustomScrollbar from "./Components/Board/BoardComponents/CustomScrollbar";
import { handleWheelScroll, useTimer, handleClose } from "./Components/Functions/eventHandlerFunctions";
import { getUpcomingTasks } from "./Components/Board/BoardFunctions/cardFunctions";

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
  const [showNotification, setShowNotification] = useState(false);
  const [dueTomorrow, setDueTomorrow] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = createCustomTheme(darkMode);
  const columnsContainerRef = useRef(null);
  const scrollbarRef = useRef(null);
  const loading = !useTimer(2000); // 2 seconds delay


  useDarkModeEffect(darkMode, setDarkMode);
  useColumnsEffect(columns, setColumns);
  // Use isMounted pattern for user fetch
  useEffect(() => {
    let isMounted = true;
    // Assuming fetchUserData accepts a callback
    fetchUserData(location, navigate, (user) => {
      if (isMounted) setUser(user);
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
  }, [location, navigate, getUpcomingTasks]);

  // Use isMounted pattern for columns fetch
  useEffect(() => {
    let isMounted = true;
    // Assuming getColumns accepts a callback
    if (typeof id !== 'undefined') {
      // Import getColumns if not already
      import('./Components/Board/BoardFunctions/columnFunctions').then(({ getColumns }) => {
        getColumns(id, (columns) => {
          if (isMounted) setColumns(columns);
        });
      });
    }
    return () => {
      isMounted = false;
    };
  }, [id]);
  useScrollBarEffect(columnsContainerRef, scrollbarRef);

  return (
    
    <ThemeProvider theme={theme}>
      <div onWheel={(e) => handleWheelScroll(e, columnsContainerRef, scrollbarRef)}>
        <Box
          sx={{
            display: "flex",
            position: "relative",
            backgroundImage: darkMode ? 'url("/room2.jpg")' : 'url("/room1.jpg")',
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
            <>
            <Box>
              {!showNotification && (
                <Button
                  onClick={() => setShowNotification(true)}
                  sx={{
                    position: "fixed",
                    top: 84,
                    right: 24,
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
                  Show Reminder
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
                              <Box component="span" sx={{ color: "#3b82f6", fontWeight: "bold" }}>
                                {task.title}
                              </Box>
                              {': '}
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
              <AppBarWithMenu
                darkMode={darkMode}
                toggleDarkMode={() => setDarkMode((prevMode) => !prevMode)}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                user={user}
              />

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
                <Box
                  sx={{
                    display: "flex",
                    width: `${columns.length * 266}px`, // Dynamically set the width based on the number of columns
                  }}
                >
                  <ColumnList
                    id={id}
                    columns={columns}
                    setColumns={setColumns}
                    draggingCard={draggingCard}
                    setDraggingCard={setDraggingCard}
                    draggingColumn={draggingColumn}
                    setDraggingColumn={setDraggingColumn}
                    darkMode={darkMode}
                  />
                </Box>
              </Box>
              <CustomScrollbar
                columns={columns}
                darkMode={darkMode}
                columnsContainerRef={columnsContainerRef}
                scrollbarRef={scrollbarRef} // Pass scrollbarRef
              />
            </>
          )}
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Board;