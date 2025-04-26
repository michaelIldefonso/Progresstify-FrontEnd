import PropTypes from "prop-types";
import { Card as MuiCard, CardContent, IconButton, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { removeCard, handleCheckboxChange, handleCardDragStart } from "../BoardFunctions/cardFunctions";

const Card = ({ card, columnId, columns, setColumns, setDraggingCard, darkMode }) => {
  return (
    <MuiCard 
    //style for card inside the column
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

            <CardContent   //this is the style for content inside the card
                         sx={{ 
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center", 
                              borderRadius: "10px",
                              padding: "center",
                            }}>

        <FormControlLabel 
        control={<Checkbox checked={card.checked} 
        onChange={(e) => handleCheckboxChange(columnId, card.id, e.target.checked, setColumns)} 
                      //this is the style for checkbox
                  sx={{ 
                        borderRadius: "50%",
                        color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)", // Default color
                        "&.Mui-checked": {
                          color: darkMode ? "rgb(7, 110, 193)" : "rgb(220, 110, 35)", // Color when checked
                        },
                    }} />} label={<Typography 
                      //this is the style for text inside the card
                  sx={{ 
                        wordBreak: "break-word",
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: darkMode ? "#fff" : "#000",
                        textAlign:"center",
                        fontFamily: '"Times New Roman", Times, serif',   
                      }}>
                        {card.text}</Typography>} />

        <IconButton edge="end" onClick={() => removeCard(columns, setColumns, columnId, card.id)}>
          <Delete />
        </IconButton>
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
  }).isRequired,
  columnId: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  setColumns: PropTypes.func.isRequired,
  draggingCard: PropTypes.object,
  setDraggingCard: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

export default Card;