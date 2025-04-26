import { memo } from "react"; // Removed unused React import
import PropTypes from "prop-types";
import { Box, Paper, TextField, Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import CardList from "./CardList";
import { renameColumn, finalizeColumnTitle, removeColumn, handleColumnDragStart } from "../BoardFunctions/columnFunctions";
import { handleCardDragOver, handleCardDrop } from "../BoardFunctions/cardFunctions";

// Memoized version of Column
const Column = memo(({ column, id, columns, setColumns, draggingCard, setDraggingCard, darkMode }) => {
  return (
    <Box
      className="column"
      sx={{ display: "inline-block", minWidth: "250px", marginRight: "16px", marginLeft: "10px" }}
      onWheel={(e) => e.stopPropagation()}
      onDrop={(e) => handleCardDrop(e, column.id, columns, setColumns, draggingCard)}
      onDragOver={(e) => handleCardDragOver(e)}
      draggable
      onDragStart={(e) => handleColumnDragStart(e, column.id)}
    >
      <Paper
        sx={{
          padding: 2,
          transition: "transform 0.3s",
          willChange: "transform",
          "&:hover": { transform: "scale(1.02)" },
          borderRadius: "24px",
          marginBottom: "10px",
          backgroundColor: darkMode ? "rgb(0, 0, 0, 0.9)" : "rgb(255, 219, 150, 0.9)",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {column.isEditing ? (
            <TextField
              fullWidth
              placeholder="Enter column name"
              value={column.title}
              onChange={(e) => renameColumn(id, columns, setColumns, column.id, e.target.value)}
              onBlur={() => finalizeColumnTitle(columns, setColumns, column.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  finalizeColumnTitle(columns, setColumns, column.id);
                  e.preventDefault();
                }
              }}
              sx={{
                borderRadius: "24px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: darkMode ? "rgb(7, 110, 193)" : "rgb(220, 110, 35)", // Default border color
                  },
                  "&:hover fieldset": {
                    borderColor: darkMode ? "rgb(5, 90, 160)" : "rgb(200, 90, 30)", // Hover border color
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: darkMode ? "rgb(7, 110, 193)" : "rgb(220, 110, 35)", // Focused border color
                  },
                },
              }}
            />
          ) : (
            <Typography
              variant="h6"
              onClick={() =>
                setColumns(
                  columns.map((col) =>
                    col.id === column.id ? { ...col, isEditing: true } : col
                  )
                )
              }
            >
              {column.title || "Untitled Column"}
            </Typography>
          )}
          <IconButton
            onClick={() => removeColumn(id, column.id, columns, setColumns)}
            sx={{ borderRadius: "24px" }}
          >
            <Close />
          </IconButton>
        </Box>
        <CardList
          column={column}
          columns={columns}
          setColumns={setColumns}
          darkMode={darkMode}
          draggingCard={draggingCard}
          setDraggingCard={setDraggingCard}
        />
      </Paper>
    </Box>
  );
});

// Add display name for debugging
Column.displayName = "Column";

// Add PropTypes validation
Column.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    isEditing: PropTypes.bool.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  setColumns: PropTypes.func.isRequired,
  draggingCard: PropTypes.object,
  setDraggingCard: PropTypes.func,
  darkMode: PropTypes.bool.isRequired,
};

export default Column;