import React from "react";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { handleCreateWorkspace } from "../WorkspaceFunctions/createWorkspaceFunctions";

const CreateWorkspaceCard = ({ setOpen }) => (
<Card
    onClick={() => handleCreateWorkspace(setOpen)}
    sx={{
    width: 300,
    cursor: "pointer",
    marginTop: 8,
    background: "linear-gradient(135deg, rgb(30, 30, 30, 0.8) 30%, rgb(30, 30, 30) 90%)",
    color: "white",
    transition: "transform 0.3s, box-shadow 0.3s",
    border: 1,
    borderColor: "rgb(30, 30, 30)",
    "&:hover": {
        transform: "scale(1.05)",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
    },
    }}
>
    <CardContent sx={{ textAlign: "center" }}>
        <IconButton
            sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            marginBottom: 2,
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
            }}
        >
            <Add fontSize="large" />
        </IconButton>
        <Typography variant="h5">Create Workspace</Typography>
        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            Click here to create a new workspace.
        </Typography>
    </CardContent>
</Card>
);

export default CreateWorkspaceCard;