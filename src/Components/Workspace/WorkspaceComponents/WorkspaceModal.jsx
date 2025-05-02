import React from "react";
import { Modal, Paper, Typography, TextField, Button } from "@mui/material";
import { handleCloseModal, handleSubmit, handleDescriptionChange } from "../WorkspaceFunctions/createWorkspaceFunctions";

const WorkspaceModal = ({
    open,
    setOpen,
    workspaceName,
    setWorkspaceName,
    workspaceDescription,
    setWorkspaceDescription,
    descriptionError,
    setDescriptionError,
    setWorkspaces,
    workspaces,
}) => (
    <Modal open={open} onClose={() => handleCloseModal(setOpen)}>
        <Paper
        sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "rgb(30, 30, 30)",
            boxShadow: 24,
            p: 4,
            color: "white",
        }}
        >
        <Typography variant="h6" component="h2">
            Create Workspace
        </Typography>
        <TextField
            autoFocus
            margin="dense"
            label="Workspace Name"
            fullWidth
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
        />
        <TextField
            margin="dense"
            label="Workspace Description"
            fullWidth
            multiline
            rows={4}
            value={workspaceDescription}
            onChange={(e) => handleDescriptionChange(e, setWorkspaceDescription, setDescriptionError)}
            error={descriptionError !== ""}
            helperText={descriptionError}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
        />
        <Button
            onClick={() =>
            handleSubmit(
                workspaceName,
                workspaceDescription,
                setWorkspaces,
                workspaces,
                setOpen,
                setWorkspaceName,
                setWorkspaceDescription
            )
            }
            variant="contained"
            sx={{ mt: 2 }}
        >
            Create
        </Button>
        </Paper>
    </Modal>
);

export default WorkspaceModal;