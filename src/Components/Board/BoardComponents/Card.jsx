import PropTypes from "prop-types";
import { useState } from "react";
import dayjs from "dayjs"; // Import Day.js
import { Card as MuiCard, CardContent, IconButton, Typography, Checkbox, FormControlLabel, Menu, MenuItem, TextField, Button } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers"; // Import DatePicker
import { removeCard, handleCheckboxChange, handleCardDragStart, handleDueDateChange, renameCard } from "../BoardFunctions/cardFunctions";
import { handleMenu, handleClose, isValidText } from "../../Functions/eventHandlerFunctions";
import { useNavigate } from "react-router-dom";


const Card = ({ card, columnId, columns, setColumns, setDraggingCard, darkMode }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(card.text);
  const handleEditSave = () => {
    if (isValidText(editText)) {
      renameCard(card.id, editText, columns, setColumns, columnId);
      setEditing(false);
    } else {
      alert("Card text cannot be empty!");
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
          alignItems: "flex-start",
          borderRadius: "10px",
          padding: "center",
        }}
      >
        <div style={{ flex: 1 }}>
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
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => {
                  setEditText(card.text);
                  setEditing(true);
                }}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    setEditText(card.text);
                    setEditing(true);
                  }
                }}
              >
                {card.text}
              </Typography>
            }
          />
          {editing && (
            <div style={{ marginTop: 8, width: "100%" }}>
              <TextField
                value={editText}
                onChange={e => setEditText(e.target.value)}
                size="small"
                autoFocus
                fullWidth
                sx={{
                  backgroundColor: darkMode ? "#222" : "#fff",
                  borderRadius: "8px",
                  input: { color: darkMode ? "#fff" : "#000" },
                }}
                onBlur={handleEditSave}
                onKeyDown={e => {
                  if (e.key === "Enter") handleEditSave();
                  if (e.key === "Escape") {
                    setEditText(card.text);
                    setEditing(false);
                  }
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onMouseDown={e => e.preventDefault()}
                  onClick={handleEditSave}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    setEditText(card.text);
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
        <div>
          <IconButton edge="end" onClick={(e) => handleMenu(e, setAnchorEl)}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleClose(setAnchorEl)}
            PaperProps={{
              sx: {
                backgroundColor: darkMode ? "rgba(15, 15, 20, 0.95)" : "rgb(234, 170, 102)",
                color: darkMode ? "#fff" : "#000",
                borderRadius: "15px",
                minWidth: 220,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                p: 1,
              },
            }}
          >
            <MenuItem sx={{ borderRadius: "10px", mb: 1 }}>
              <DatePicker
                label="Due Date"
                value={card.dueDate ? dayjs(card.dueDate) : null}
                onChange={(newDate) => handleDueDateChange(newDate, card, columnId, setColumns, navigate)}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      backgroundColor: darkMode ? "#222" : "#fff",
                      borderRadius: "8px",
                      input: { color: darkMode ? "#fff" : "#000" },
                      width: "170px",
                    },
                  },
                }}
              />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setEditText(card.text);
                handleClose(setAnchorEl);
                setTimeout(() => setEditing(true), 0);
              }}
              sx={{
                borderRadius: "10px",
                color: darkMode ? "#fff" : "#000",
                "&:hover": {
                  backgroundColor: darkMode ? "rgba(220, 110, 35, 0.15)" : "rgba(220, 110, 35, 0.08)",
                },
              }}
            >
              Rename Card
            </MenuItem>
            <MenuItem
              onClick={() => removeCard(columns, setColumns, columnId, card.id)}
              sx={{
                borderRadius: "10px",
                color: darkMode ? "#fff" : "#000",
                "&:hover": {
                  backgroundColor: darkMode ? "rgba(220, 110, 35, 0.15)" : "rgba(220, 110, 35, 0.08)",
                },
              }}
            >
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