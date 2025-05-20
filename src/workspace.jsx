import { useState, useEffect } from "react";
import { CssBaseline, GlobalStyles, Grid, Typography, Skeleton, Box, IconButton, Button, Menu, MenuItem, Paper, List, ListItemText, ListItem } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CreateWorkspaceCard from "./Components/Workspace/WorkspaceComponents/createWorkspaceCard";
import WorkspaceModal from "./Components/Workspace/WorkspaceComponents/WorkspaceModal";
import WorkspaceList from "./Components/Workspace/WorkspaceComponents/workspaceList";
import { fetchUserData, extractAndStoreTokens } from "./Components/Functions/fetchFunctions";
import { useTimer, handleClose, handleMenu } from "./Components/Functions/eventHandlerFunctions";
import { fetchWorkspaces } from "./Components/Workspace/WorkspaceFunctions/createWorkspaceFunctions";
import { handleLogout, navigateToAccountDetails } from "./Components/Functions/navigationFunctions";
import { getUpcomingTasks } from "./Components/Board/BoardFunctions/cardFunctions";

function Workspaces() {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const [showNotification, setShowNotification] = useState(false);
  const [dueTomorrow, setDueTomorrow] = useState([]);

  useEffect(() => {
    // Extract and store tokens from URL if present
    extractAndStoreTokens(location);

    let isMounted = true;

    // Fetch user data (removed setUser since user is not used)
    fetchUserData(location, navigate, () => {});

    getUpcomingTasks(2).then(tasks => {
          if (tasks.length > 0) {
            setDueTomorrow(tasks);
            setShowNotification(true);
          }
        });
    // Fetch workspaces
    fetchWorkspaces(navigate, (workspaces) => {
      if (isMounted) setWorkspaces(workspaces);
    });

    return () => {
      isMounted = false;
    };
  }, [location, navigate]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const loading = !useTimer(2000); // 2 seconds delay

  return (
    <div>
      <CssBaseline />
      <GlobalStyles styles={{ body: { overflow: "hidden" } }} />
      <div
        style={{
          backgroundColor: darkMode ? "#0a0f1e" : "#f0f0f0",
          backgroundImage: darkMode
            ? 'url("/darkroomrtx.png")'
            : 'url("/couch1.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
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
            <div
              style={{
                position: "absolute",
                top: 0,
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: "10px 20px",
                backgroundColor: "transparent",
              }}
            >
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={(e) => handleMenu(e, setAnchorEl)}
                  sx={{ color: darkMode ? "#fff" : "#fff", textTransform: "none" }}
                >
                  Account
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  keepMounted
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  open={Boolean(anchorEl)}
                  onClose={() => handleClose(setAnchorEl)}
                >
                  <MenuItem onClick={() => navigateToAccountDetails(navigate)}>Account Details</MenuItem>
                  <MenuItem onClick={() => handleLogout(navigate)}>Logout</MenuItem>
                </Menu>
                <IconButton onClick={toggleDarkMode} sx={{ color: darkMode ? "#fff" : "#fff" }}>
                  {darkMode ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
              </div>
            </div>

            <CreateWorkspaceCard setOpen={setOpen} />

            <WorkspaceModal
              open={open}
              setOpen={setOpen}
              workspaceName={workspaceName}
              setWorkspaceName={setWorkspaceName}
              workspaceDescription={workspaceDescription}
              setWorkspaceDescription={setWorkspaceDescription}
              descriptionError={descriptionError}
              setDescriptionError={setDescriptionError}
              setWorkspaces={setWorkspaces}
              workspaces={workspaces}
            />

            <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
              {workspaces.length > 0 ? (
                <WorkspaceList
                  workspaces={workspaces}
                  setWorkspaces={setWorkspaces}
                  navigate={navigate}
                />
              ) : (
                <Typography variant="body1" sx={{ color: "white", mt: 4 }}>
                  No workspaces found.
                </Typography>
              )}
            </Grid>
          </>
        )}
      </div>
    </div>
  );
}

export default Workspaces;