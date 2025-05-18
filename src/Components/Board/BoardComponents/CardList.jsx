import PropTypes from "prop-types";
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
  const sortedCards = [...column.cards].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  return (
    <Box
      className="card-list"
      // style for card and scrollbar vertical inside the column
      sx={{
        marginTop: 2,
        maxHeight: "400px",
        overflowY: "auto",
        paddingRight: "10px",
        "&::-webkit-scrollbar": { width: "5px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: darkMode
            ? "rgba(8, 8, 8, 0.5)"
            : "rgba(109, 80, 27, 0.4)",
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
          // style for input field, when you click on it, it will be rounded and have a border color
          sx={{ marginBottom: 1,
                borderRadius: "24px",
                "& .MuiOutlinedInput-root": 
                {
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
      {sortedCards.map((card) => (
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
        // style for add a card hover color change
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

// Add PropTypes for validation
CardList.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isAddingCard: PropTypes.bool.isRequired,
    newCardText: PropTypes.string.isRequired,
    cards: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        checked: PropTypes.bool.isRequired,
        dueDate: PropTypes.string, // Ensure dueDate is a string
      })
    ).isRequired,
  }).isRequired,
  columns: PropTypes.array.isRequired,
  setColumns: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  draggingCard: PropTypes.object,
  setDraggingCard: PropTypes.func,
  isloading: PropTypes.bool, // Add loading prop
};

export default CardList;