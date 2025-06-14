import { ListItem, ListItemIcon, ListItemText, IconButton, TextField, Box, Button, Typography } from "@mui/material";
import { Dashboard as DashboardIcon, Add, Edit, Delete } from "@mui/icons-material";
import PropTypes from "prop-types";

const BoardListComponent = ({
  boards,
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
  deleteBoard, // Ensure deleteBoard is passed as a prop
}) => {

  return (
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
          borderRadius: "15px",
          mt: 2,
          backgroundColor: "transparent",
          color: darkMode ? "white" : "black",
          border: "1px solid",
          fontWeight: "700",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          mb: "30px",
          "&:hover": {
              backgroundColor: darkMode ? "rgba(0, 0, 0, 0.25)" : "rgba(240, 240, 240, 0.47)", // Hover effect
            },
        }}
      >
        Create Board
      </Button>
      {boards.map((board) => (
        <ListItem
          component="div"
          key={board.id || board.name} // Ensure each child has a unique key, fallback to name if id is missing
          onClick={() => selectBoard(board, setActiveBoard, setEditingBoardId, navigate)}
          sx={{
          mt: "3px",
          backgroundColor: "transparent",
          color: darkMode ? "white" : "black",
          border: "1px solid",
          borderRadius: "15px",
          fontWeight: "700",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
            "&:hover": {
              backgroundColor: darkMode ? "rgba(0, 0, 0, 0.25)" : "rgba(240, 240, 240, 0.47)", // Hover effect
            },
          }}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleNameSave(workspaceId, board, boards, setBoards, boardName, setEditingBoardId);
                    e.target.blur(); // Optional: remove focus after saving
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                sx={{ mb: 1 }}
              />
            </Box>
          ) : (
            <ListItemText primary={board.name} />
          )}
          <IconButton
            onClick={e => {
              e.stopPropagation();
              handleEditClick(board, setEditingBoardId, setBoardName);
            }}
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              const confirmation = window.prompt("Type 'Confirm' to delete this board. This action cannot be undone.");
              // Accept only exact 'Confirm' (case-sensitive, capital C)
              if (confirmation === "Confirm") {
                deleteBoard(workspaceId, board.id, boards, setBoards);
              } else if (confirmation !== null) {
                window.alert("Incorrect input. Board was not deleted. Please type 'Confirm' exactly to proceed.");
              }
            }}
          >
            <Delete />
          </IconButton>
        </ListItem>
      ))}
    </div>
  );
};

// Add PropTypes for validation
BoardListComponent.propTypes = {
  boards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeBoard: PropTypes.object,
  editingBoardId: PropTypes.string,
  boardName: PropTypes.string.isRequired,
  setBoardName: PropTypes.func.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  setEditingBoardId: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  workspaceId: PropTypes.string.isRequired,
  setActiveBoard: PropTypes.func.isRequired,
  setBoards: PropTypes.func.isRequired,
  selectBoard: PropTypes.func.isRequired,
  handleNameChange: PropTypes.func.isRequired,
  handleNameSave: PropTypes.func.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  deleteBoard: PropTypes.func.isRequired,
};

export default BoardListComponent;