import React from "react";
import { Grid, Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { handleDeleteWorkspace } from "../WorkspaceFunctions/createWorkspaceFunctions";

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
                    handleDeleteWorkspace(ws.id, setWorkspaces);
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

export default WorkspaceList;