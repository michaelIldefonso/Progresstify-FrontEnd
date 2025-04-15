import React from "react";
import { Card as MuiCard, CardContent, IconButton, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { removeCard, handleCheckboxChange, handleCardDragStart } from "../BoardFunctions/cardFunctions";

const Card = ({ card, columnId, columns, setColumns, draggingCard, setDraggingCard, darkMode }) => {
  return (
    <MuiCard 
    sx={{ marginBottom: 1, 
          backgroundColor: darkMode ? "rgba(15, 15, 20, 0.78)":"rgb(234, 170, 102)",
          willChange: "transform", 
          transition: "transform 0.3s", 
          "&:hover": { transform: "scale(1.005)" }, 
          borderRadius: "15px",
          marginTop: "5px",
          height: "auto",

         }} 
          draggable onDragStart={(e) => handleCardDragStart(e, card.id, columnId, setDraggingCard)}>

      <CardContent sx={{ display: "flex",
                         justifyContent: "space-between",
                         alignItems: "center", 
                         borderRadius: "10px",
                         padding: "center",
                         fontFamily: '"Times New Roman", Times, serif',
                         
                         
                      }}>

        <FormControlLabel control={<Checkbox checked={card.checked} onChange={(e) => handleCheckboxChange(columnId, card.id, e.target.checked, setColumns)} 
                  sx={{ borderRadius: "50%" }} />} label={<Typography 
                  sx={{ wordBreak: "break-word",
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: darkMode ? "#fff" : "#000",
                        textAlign:"center",
                        fontFamily: '-apple-system',   
                      }}>
                        {card.text}</Typography>} />

        <IconButton edge="end" onClick={() => removeCard(columns, setColumns, columnId, card.id)}>
          <Delete />
        </IconButton>
      </CardContent>
    </MuiCard>
  );
};

export default Card;