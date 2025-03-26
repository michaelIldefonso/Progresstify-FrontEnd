import React from "react";
import { Card as MuiCard, CardContent, IconButton, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { removeCard, handleCheckboxChange, handleCardDragStart } from "../BoardFunctions/cardFunctions";

const Card = ({ card, columnId, columns, setColumns, draggingCard, setDraggingCard, darkMode }) => {
  return (
    <MuiCard sx={{ marginBottom: 1, backgroundColor: "rgba(240, 232, 232, 0.1)", transition: "transform 0.3s", "&:hover": { transform: "scale(1.02)" }, borderRadius: "24px" }} draggable onDragStart={(e) => handleCardDragStart(e, card.id, columnId, setDraggingCard)}>
      <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "24px" }}>
        <FormControlLabel control={<Checkbox checked={card.checked} onChange={(e) => handleCheckboxChange(columnId, card.id, e.target.checked, setColumns)} sx={{ borderRadius: "50%" }} />} label={<Typography sx={{ wordBreak: "break-word" }}>{card.text}</Typography>} />
        <IconButton edge="end" onClick={() => removeCard(columns, setColumns, columnId, card.id)}>
          <Delete />
        </IconButton>
      </CardContent>
    </MuiCard>
  );
};

export default Card;