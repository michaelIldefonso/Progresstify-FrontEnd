import React from "react";
import { Box, TextField, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import Card from "./Card";
import { handleCardInputChange, addCard, startAddingCard } from "../BoardFunctions/cardFunctions";

const CardList = ({
  column,
  columns,
  setColumns,
  darkMode,
  draggingCard,
  setDraggingCard,
}) => {
  return (
    <Box
      className="card-list"
      sx={{
        marginTop: 2,
        maxHeight: "400px",
        overflowY: "auto",
        paddingRight: "10px",
        "&::-webkit-scrollbar": { width: "5px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: darkMode
            ? "rgba(8, 8, 8, 0.5)"
            : "rgba(175, 114, 1, 0.88)",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
      }}
    >
      {column.isAddingCard && (
        <TextField
          fullWidth
          placeholder="Enter card text and press Enter"
          value={column.newCardText}
          onChange={(e) =>
            handleCardInputChange(columns, setColumns, column.id, e.target.value)
          }
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              addCard(column.id, columns, setColumns, column.newCardText);
            }
          }}
          onBlur={() => {
            if (column.newCardText.trim()) {
              addCard(column.id, columns, setColumns, column.newCardText);
            }
          }}
          autoFocus
          sx={{ marginBottom: 1,
                borderRadius: "24px",
                "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: darkMode ? "rgba(15, 15, 20, 0.78)" : "rgb(241, 128, 41)", // Default border color
      },
      "&:hover fieldset": {
        borderColor: darkMode ? "rgba(15, 15, 20, 0.9)" : "rgb(241, 128, 41)", // Slightly darker on hover
      },
      "&.Mui-focused fieldset": {
        borderColor: darkMode ? "rgba(15, 15, 20, 1)" : "rgb(241, 128, 41)", // Stronger color on focus
      },
    },

              }}
        />
      )}
      {column.cards.map((card) => (
        <Card
          key={`${column.id}-${card.id}`} // Ensure unique keys by combining column ID and card ID
          card={card}
          columnId={column.id}
          columns={columns}
          setColumns={setColumns}
          draggingCard={draggingCard}
          setDraggingCard={setDraggingCard}
          darkMode={darkMode}
        />
      ))}
      <Button
        variant="text"
        startIcon={<Add />}
        onClick={() => startAddingCard(column.id, columns, setColumns)}
        sx={{ borderRadius: "24px", 
              marginTop: 1, 
              color: darkMode ? "rgb(9, 137, 241)" : "rgb(29, 13, 1)", // Default text color
    "&:hover": {
      color: darkMode ? "rgb(7, 110, 193)" : "rgb(220, 110, 35)", // Hover text color
    },
    "&:active": {
      color: darkMode ? "rgb(5, 90, 160)" : "rgb(200, 90, 30)", // Text color when clicked
    },
    "&.Mui-focusVisible": {
      color: darkMode ? "rgb(5, 90, 160)" : "rgb(200, 90, 30)", // Text color when focused
    },
           }}
      >
        Add a card
      </Button>
    </Box>
  );
};

export default CardList;