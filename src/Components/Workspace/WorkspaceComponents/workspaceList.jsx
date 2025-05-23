import { Grid, Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { handleDeleteWorkspace } from "../WorkspaceFunctions/workspacesFunctions";
import PropTypes from "prop-types";

const WorkspaceList = ({ workspaces, setWorkspaces, navigate }) => (
    <>
        {workspaces.map((ws) => (
        <Grid item key={ws.id} xs={12} sm={6} md={4} lg={3}>
            <Card
            onClick={() => navigate(`/dashboard/${ws.id}`)}
            sx={{
                cursor: "pointer",
                backgroundColor: "rgb(30, 30, 30, 0.5)",
                color: "white",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.05)", boxShadow: 3 },
            }}
            >
            <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">{ws.name}</Typography>
                <IconButton
                    onClick={(e) => {
                    e.stopPropagation();
                    const confirmation = window.prompt("Type 'Confirm' to delete this workspace. This action cannot be undone.");
                    // Accept only exact 'Confirm' (case-sensitive, capital C)
                    if (confirmation === "Confirm") {
                        handleDeleteWorkspace(ws.id, setWorkspaces);
                    } else if (confirmation !== null) {
                        window.alert("Incorrect input. Workspace was not deleted. Please type 'Confirm' exactly to proceed.");
                    }
                    }}
                    sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                    }}
                >
                    <Delete />
                </IconButton>
                </Box>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                {ws.description || "No description available"}
                </Typography>
            </CardContent>
            </Card>
        </Grid>
        ))}
    </>
);

WorkspaceList.propTypes = {
  workspaces: PropTypes.array.isRequired,
  setWorkspaces: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default WorkspaceList;