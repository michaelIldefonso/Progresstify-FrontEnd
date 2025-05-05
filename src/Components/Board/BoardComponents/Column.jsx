import { memo } from "react"; 
import PropTypes from "prop-types";
import { Box, Paper, TextField, Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import CardList from "./CardList";
import { renameColumn, finalizeColumnTitle, removeColumn, handleColumnDragStart } from "../BoardFunctions/columnFunctions";
import { handleCardDragOver, handleCardDrop } from "../BoardFunctions/cardFunctions";

// Memoized version of Column
const Column = memo(({ column, id, columns, setColumns, draggingCard, setDraggingCard, setDraggingColumn, darkMode }) => {
  return (
    <Box
      className="column"
      sx={{ display: "inline-block", minWidth: "250px", marginRight: "16px", marginLeft: "10px" }}
      onWheel={(e) => e.stopPropagation()} // Prevent scroll events from propagating to parent elements
      onDrop={(e) => handleCardDrop(e, column.id, columns, setColumns, draggingCard)} // Handle dropping a card onto this column
      onDragOver={(e) => handleCardDragOver(e)} // Allow cards to be dragged over this column
      draggable // Enable the column itself to be draggable
      onDragStart={(e) => handleColumnDragStart(e, column.id, setDraggingColumn)} // Handle starting the drag operation for this column
    >
      {/*styles for Column*/}
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
              onChange={(e) => renameColumn(id, columns, setColumns, column.id, e.target.value)} // Updates the column title as the user types (when clicked)
              onBlur={() => finalizeColumnTitle(columns, setColumns, column.id)} // Finalizes the title when the input loses focus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  finalizeColumnTitle(columns, setColumns, column.id); // Finalizes the title when the Enter key is pressed
                  e.preventDefault(); // Prevents the default behavior of the Enter key
                }
              }}
              // style for input field, when you click on it, it will be rounded and have a border color
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
              variant="h6" // Sets the typography variant to "h6" for the column title
              onClick={() =>
                setColumns(
                  columns.map((col) =>
                    col.id === column.id ? { ...col, isEditing: true } : col // Updates the column state to enable editing mode for this column
                  )
                )
              }
            >
              {column.title || "Untitled Column"}  {/* Displays the column title or "Untitled Column" if empty */}
            </Typography>
          )}
          <IconButton
            onClick={() => removeColumn(id, column.id, columns, setColumns)} // Removes the column when the close button is clicked
            sx={{ borderRadius: "24px" }} // Sets a circular border radius for the button
          >
            <Close />
          </IconButton>
        </Box>
        <CardList
          column={column} // Passes the current column data to the CardList component
          columns={columns} // Passes the entire columns state for managing the board
          setColumns={setColumns} // Function to update the columns state
          darkMode={darkMode} // Passes the dark mode flag for styling
          draggingCard={draggingCard} // Tracks the card currently being dragged
          setDraggingCard={setDraggingCard} // Function to update the dragging card state 
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
  setDraggingColumn: PropTypes.func.isRequired, 
  darkMode: PropTypes.bool.isRequired,
};

export default Column;