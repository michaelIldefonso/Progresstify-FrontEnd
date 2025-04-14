import React from "react";
import { Modal, Paper, Typography, TextField, Button } from "@mui/material";

const BoardModalComponent = ({
  modalOpen,
  setModalOpen,
  boardName,
  setBoardName,
  createBoard,
  workspaceId,
  boards,
  setBoards,
  darkMode,
}) => (
  <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
    <Paper
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        padding: 4,
      }}
    >
      <Typography variant="h6">Board</Typography>
      <TextField
        label="Board Name"
        fullWidth
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          createBoard(workspaceId, boards, setBoards, boardName, setBoardName, setModalOpen)
        }
        sx={{ mt: 2 }}
      >
        Create
      </Button>
    </Paper>
  </Modal>
);

export default BoardModalComponent;