import { useState, useRef, useEffect } from "react";
import { Box, ThemeProvider, Skeleton } from "@mui/material";
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

    getUpcomingTasks(1).then(tasks => {
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
            {showNotification && (
              <div
                style={{
                  position: "fixed",
                  bottom: 24,
                  right: 24,
                  zIndex: 9999,
                  background: "#fffbe6",
                  border: "1px solid #ffe58f",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  padding: "12px 18px",
                  borderRadius: "8px",
                  minWidth: "240px",
                  maxWidth: "320px",
                  fontSize: "15px",
                  color: "#8d6c00"
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  <strong>Reminder:</strong> Tasks due tomorrow!
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: "14px" }}>
                  {dueTomorrow.map((task) => (
                    <li key={task.id}>
                      <b>{task.title || task.text}</b>{" "}
                      <span style={{ color: "#b38f00", fontSize: "12px" }}>
                        (Due: {new Date(task.due_date).toLocaleDateString()})
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleClose}
                  style={{
                    marginTop: 8,
                    background: "#ffe58f",
                    border: "none",
                    borderRadius: "6px",
                    padding: "3px 12px",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "#a07b00",
                    float: "right"
                  }}
                >
                  Dismiss
                </button>
              </div>
            )}
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