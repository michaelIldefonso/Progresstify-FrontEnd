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
            : "rgba(255, 253, 253, 0.5)",
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
          sx={{ marginBottom: 1, borderRadius: "24px" }}
        />
      )}
      {column.cards.map((card) => (
        <Card
          key={card.id}
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
        sx={{ borderRadius: "24px", marginTop: 1 }}
      >
        Add a card
      </Button>
    </Box>
  );
};

export default CardList;