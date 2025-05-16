import { useState, useEffect } from "react";
import { CssBaseline, GlobalStyles, Grid, Typography, Skeleton, Box, IconButton, Button, Menu, MenuItem } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CreateWorkspaceCard from "./Components/Workspace/WorkspaceComponents/createWorkspaceCard";
import WorkspaceModal from "./Components/Workspace/WorkspaceComponents/WorkspaceModal";
import WorkspaceList from "./Components/Workspace/WorkspaceComponents/workspaceList";
import { fetchUserData, extractAndStoreTokens } from "./Components/Functions/fetchFunctions";
import { useTimer, handleClose, handleMenu } from "./Components/Functions/eventHandlerFunctions";
import { fetchWorkspaces } from "./Components/Workspace/WorkspaceFunctions/createWorkspaceFunctions";
import { handleLogout } from "./Components/Functions/navigationFunctions";

function Workspaces() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    // Extract and store tokens from URL if present
    extractAndStoreTokens(location);

    let isMounted = true;

    // Fetch user data
    fetchUserData(location, navigate, (user) => {
      if (isMounted) setUser(user);
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