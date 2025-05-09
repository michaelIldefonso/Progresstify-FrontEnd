import { Modal, Paper, Typography, TextField, Button } from "@mui/material";
import PropTypes from "prop-types";

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
        backgroundColor: darkMode ? "rgba(0, 0, 0, 0.9)" : "rgba(255, 255, 255, 0.9)",
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
// Add PropTypes for validation
BoardModalComponent.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  boardName: PropTypes.string.isRequired,
  setBoardName: PropTypes.func.isRequired,
  createBoard: PropTypes.func.isRequired,
  workspaceId: PropTypes.string.isRequired,
  boards: PropTypes.array.isRequired,
  setBoards: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};
export default BoardModalComponent;