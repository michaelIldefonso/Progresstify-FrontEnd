import PropTypes from "prop-types";
import { useState } from "react";
import dayjs from "dayjs"; // Import Day.js
import { Card as MuiCard, CardContent, IconButton, Typography, Checkbox, FormControlLabel, Menu, MenuItem, TextField } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers"; // Import DatePicker
import { removeCard, handleCheckboxChange, handleCardDragStart } from "../BoardFunctions/cardFunctions";
import { handleMenu, handleClose } from "../../Functions/eventHandlerFunctions";

const Card = ({ card, columnId, columns, setColumns, setDraggingCard, darkMode }) => {
  const [anchorEl, setAnchorEl] = useState(null);


  const handleDueDateChange = async (newDate) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cards/${card.id}/due-date`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dueDate: newDate.toISOString() }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update due date");
      }
  
      const updatedCard = await response.json();
  
      // Update the state with the new due date
      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.id === columnId
            ? {
                ...col,
                cards: col.cards.map((c) =>
                  c.id === card.id ? { ...c, dueDate: updatedCard.card.due_date } : c
                ),
              }
            : col
        )
      );
    } catch (error) {
      console.error("Failed to update due date:", error);
    }
  };

  return (
    <MuiCard
      sx={{
        marginBottom: 1,
        backgroundColor: darkMode ? "rgba(15, 15, 20, 0.78)" : "rgb(234, 170, 102)",
        willChange: "transform",
        transition: "transform 0.3s",
        "&:hover": { transform: "scale(1.005)" },
        borderRadius: "15px",
        marginTop: "5px",
        height: "auto",
      }}
      draggable
      onDragStart={(e) => handleCardDragStart(e, card.id, columnId, setDraggingCard)}
    >
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "10px",
          padding: "center",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={card.checked}
              onChange={(e) =>
                handleCheckboxChange(columnId, card.id, e.target.checked, setColumns)
              }
              sx={{
                borderRadius: "50%",
                color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                "&.Mui-checked": {
                  color: darkMode ? "rgb(7, 110, 193)" : "rgb(220, 110, 35)",
                },
              }}
            />
          }
          label={
            <Typography
              sx={{
                wordBreak: "break-word",
                fontSize: "18px",
                fontWeight: "bold",
                color: darkMode ? "#fff" : "#000",
                textAlign: "center",
                fontFamily: '"Times New Roman", Times, serif',
              }}
            >
              {card.text}
            </Typography>
          }
        />

        <div>
          <DatePicker
            label="Due Date"
            value={card.dueDate ? dayjs(card.dueDate) : null} // Ensure `dueDate` is a Day.js object
            onChange={(newDate) => handleDueDateChange(newDate, card.id)}
            renderInput={(params) => <TextField {...params} />}
          />
          <IconButton edge="end" onClick={(e) => handleMenu(e, setAnchorEl)}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleClose(setAnchorEl)}
          >
            <MenuItem onClick={() => removeCard(columns, setColumns, columnId, card.id)}>
              Remove Card
            </MenuItem>
          </Menu>
        </div>
      </CardContent>
    </MuiCard>
  );
};

// Add PropTypes for validation
Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    dueDate: PropTypes.string, // Add dueDate to PropTypes
  }).isRequired,
  columnId: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  setColumns: PropTypes.func.isRequired,
  draggingCard: PropTypes.object,
  setDraggingCard: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

export default Card;