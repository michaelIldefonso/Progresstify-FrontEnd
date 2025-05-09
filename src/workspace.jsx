import { useState, useEffect } from "react";
import { CssBaseline, GlobalStyles, Grid, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AppBarWithMenu from "./Components/AppBar/AppbarWithMenu";
import CreateWorkspaceCard from "./Components/Workspace/WorkspaceComponents/createWorkspaceCard";
import WorkspaceModal from "./Components/Workspace/WorkspaceComponents/WorkspaceModal";
import WorkspaceList from "./Components/Workspace/WorkspaceComponents/workspaceList";
import { fetchUserData, fetchWorkspaces } from "./Components/Functions/fetchFunctions";

function Workspaces() {
  // Hooks
  // useState is a React hook that allows you to add state to your functional components.
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    // Fetch user data
    fetchUserData(location, navigate, setUser);

    // Fetch workspaces
    fetchWorkspaces(navigate, setWorkspaces);
  }, [location, navigate]);

  return (
    <div>
      <CssBaseline />
      <GlobalStyles styles={{ body: { overflow: "hidden" } }} />
      <div
        style={{
          backgroundColor: "#0a0f1e",
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: 'url("/12mb.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
        }}
      >
        {/* AppBarWithMenu is a custom component that renders the app bar with a menu. It takes user, anchorEl, setAnchorEl, and navigate as props. */}
        <AppBarWithMenu user={user} anchorEl={anchorEl} setAnchorEl={setAnchorEl} navigate={navigate} />

        {/* CreateWorkspaceCard is a custom component that renders a card for creating a workspace. It takes setOpen as a prop to control the modal state. */}
        <CreateWorkspaceCard setOpen={setOpen} />

        <WorkspaceModal
        // WorkspaceModal is a custom component that renders a modal for creating or editing a workspace. It takes various props to control its behavior.
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
        {/* The Grid component is a layout component from Material-UI that allows for responsive grid layouts. It is used here to create a grid of workspaces. */}
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
          {workspaces.length > 0 ? (
            <WorkspaceList workspaces={workspaces} setWorkspaces={setWorkspaces} navigate={navigate} />
          ) : (
            <Typography variant="body1" sx={{ color: "white", mt: 4 }}>
              No workspaces found.
            </Typography>
          )}
        </Grid>
      </div>
    </div>
  );
}

export default Workspaces;