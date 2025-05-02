import React, { useState, useEffect } from "react";
import { CssBaseline, GlobalStyles, Grid, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AppBarWithMenu from "./Components/mainComponents/AppbarWithMenu";
import CreateWorkspaceCard from "./Components/Workspace/WorkspaceComponents/createWorkspaceCard";
import WorkspaceModal from "./Components/Workspace/WorkspaceComponents/WorkspaceModal";
import WorkspaceList from "./Components/Workspace/WorkspaceComponents/workspaceList";
import { fetchUserData, fetchWorkspaces } from "./Components/Functions/fetchFunctions";

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
        <AppBarWithMenu user={user} anchorEl={anchorEl} setAnchorEl={setAnchorEl} navigate={navigate} />

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