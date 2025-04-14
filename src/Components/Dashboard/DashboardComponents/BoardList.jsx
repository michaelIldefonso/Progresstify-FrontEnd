import React from "react";
import { List, ListItem, ListItemIcon, ListItemText, IconButton, TextField, Box, Button, Typography } from "@mui/material";
import { Dashboard as DashboardIcon, Add, Edit } from "@mui/icons-material";

const BoardListComponent = ({
  boards,
  activeBoard,
  editingBoardId,
  boardName,
  setBoardName,
  setModalOpen,
  darkMode,
  setEditingBoardId,
  navigate,
  workspaceId,
  setActiveBoard,
  setBoards,
  selectBoard,
  handleNameChange,
  handleNameSave,
  handleEditClick,
}) => (
  <div
    style={{
      padding: "40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "transparent",
      borderRadius: "8px",
    }}
  >
    <Typography variant="h4" sx={{ color: darkMode ? "white" : "black" }}>
      Select or Create a Board
    </Typography>
    <Button
      variant="contained"
      color="primary"
      startIcon={<Add />}
      onClick={() => setModalOpen(true)}
      sx={{
        mt: 2,
        backgroundColor: "transparent",
        color: darkMode ? "white" : "black",
        border: "1px solid",
        fontWeight: "700",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      Create Board
    </Button>
    {boards.map((board) => (
      <ListItem
        button
        key={board.id}
        onClick={() => selectBoard(board, setActiveBoard, setEditingBoardId, navigate)}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        {editingBoardId === board.id ? (
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <TextField
              value={boardName}
              onChange={(e) => handleNameChange(e, setBoardName)}
              onBlur={() =>
                handleNameSave(workspaceId, board, boards, setBoards, boardName, setEditingBoardId)
              }
              onKeyPress={(e) =>
                e.key === "Enter" &&
                handleNameSave(workspaceId, board, boards, setBoards, boardName, setEditingBoardId)
              }
              autoFocus
              sx={{ mb: 1 }}
            />
          </Box>
        ) : (
          <ListItemText primary={board.name} />
        )}
        <IconButton onClick={() => handleEditClick(board, setEditingBoardId, setBoardName)}>
          <Edit />
        </IconButton>
      </ListItem>
    ))}
  </div>
);

export default BoardListComponent;