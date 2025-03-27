import React from "react";
import { Box, Paper, TextField, Typography, IconButton, Button } from "@mui/material";
import { Close, Add } from "@mui/icons-material";
import CardList from "./CardList";
import { renameColumn, finalizeColumnTitle, removeColumn, handleColumnDragStart } from "../BoardFunctions/columnFunctions";
import { handleCardDragOver, handleCardDrop, handleCardDragStart } from "../BoardFunctions/cardFunctions";

const Column = ({ column, id, columns, setColumns, draggingCard, setDraggingCard, draggingColumn, setDraggingColumn, darkMode }) => {
  return (
    <Box
      className="column"
      sx={{ display: "inline-block", minWidth: "250px", marginRight: "16px" }}
      onWheel={(e) => e.stopPropagation()}
      onDrop={(e) => handleCardDrop(e, column.id, columns, setColumns, draggingCard)}
      onDragOver={(e) => handleCardDragOver(e)}
      draggable
      onDragStart={(e) => handleColumnDragStart(e, column.id, setDraggingColumn)}
    >
      <Paper
        sx={{ padding: 2, transition: "transform 0.3s", "&:hover": { transform: "scale(1.02)" }, borderRadius: "24px", marginBottom: "10px" }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {column.isEditing ? (
            <TextField
              fullWidth
              placeholder="Enter column name"
              value={column.title}
              onChange={(e) => renameColumn(id, columns, setColumns, column.id, e.target.value)}
              onBlur={() => finalizeColumnTitle(columns, setColumns, column.id)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  finalizeColumnTitle(columns, setColumns, column.id);
                  e.preventDefault();
                }
              }}
              sx={{ borderRadius: "24px" }}
            />
          ) : (
            <Typography variant="h6" onClick={() => setColumns(columns.map((col) => col.id === column.id ? { ...col, isEditing: true } : col))}>
              {column.title || "Untitled Column"}
            </Typography>
          )}
          <IconButton onClick={() => removeColumn(id, column.id, columns, setColumns)} sx={{ borderRadius: "24px" }}>
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
};

export default Column;