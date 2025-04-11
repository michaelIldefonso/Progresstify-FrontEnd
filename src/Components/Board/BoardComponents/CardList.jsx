import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, TextField, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import Card from "./Card";
import { handleCardInputChange, handleCardInputKeyPress, addCard, getCard } from "../BoardFunctions/cardFunctions";

const CardList = ({ column, columns, setColumns, darkMode, draggingCard, setDraggingCard }) => {
  const { id: boardId } = useParams();
  const cardsFetchedRef = useRef(false); // Shared flag to track if cards are fetched

  useEffect(() => {
    if (columns.length > 0 && !cardsFetchedRef.current) {
      const allColumnsHaveIds = columns.every((col) => col.id); // Ensure all columns have valid IDs
      if (allColumnsHaveIds) {
        console.log("Fetching cards for the first time...");
        getCard(boardId, setColumns, cardsFetchedRef); // Fetch cards only once for the board
      } else {
        console.log("Some columns do not have valid IDs yet.");
      }
    } else {
      console.log("Columns are empty or cards have already been fetched.");
    }
  }, [boardId, columns, setColumns]);

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
          backgroundColor: darkMode ? "rgba(8, 8, 8, 0.5)" : "rgba(255, 253, 253, 0.5)",
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
          onChange={(e) => handleCardInputChange(columns, setColumns, column.id, e.target.value)}
          onKeyPress={(e) => handleCardInputKeyPress(e, column.id, columns, setColumns)}
          onBlur={() => handleCreateCard(column.id, column.newCardText, columns, setColumns)} // Updated to use handleCreateCard
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
        onClick={() =>
          setColumns(
            columns.map((col) =>
              col.id === column.id ? { ...col, newCardText: "", isAddingCard: true } : col
            )
          )
        }
        sx={{ borderRadius: "24px", marginTop: 1 }}
      >
        Add a card
      </Button>
    </Box>
  );
};

export default CardList;