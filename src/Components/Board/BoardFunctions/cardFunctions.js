import { apiClient } from "../../../utils/auth";

// Export a function to initialize apiClient
export const initializeApiClient = (navigate) => apiClient(navigate); // Create an instance of apiClient

// Replace the direct apiClient initialization with a function call
let api;
export const setApiClient = (navigate) => {
  api = initializeApiClient(navigate);
};

// Show a new card in a column
export const showCard = async (columnId, columns, setColumns) => {
  try {
    const response = await api.post(`/api/cards`, {
      column_id: columnId,
      text: "",
      checked: false,
      position: columns.find((col) => col.id === columnId).cards.length || 0,
    });

    const newCard = response.data;

    // Update the column with the new card
    setColumns(
      columns.map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, newCard], newCardText: "", isAddingCard: false }
          : col
      )
    );

    console.log("Card created successfully:", newCard);
  } catch (error) {
    console.error("Failed to create card:", error.message);
  }
};

// Add a card to a column
export const addCard = async (columnId, columns, setColumns, cardText = "") => {
  if (!cardText.trim()) {
    console.error("Cannot add an empty card.");
    return;
  }

  const tempId = Date.now(); // Temporary ID for UI
  const newCard = {
    id: tempId,
    text: cardText,
    checked: false,
    position: columns.find((col) => col.id === columnId)?.cards.length || 0,
  };

  // Optimistically update the UI
  setColumns((prevColumns) =>
    prevColumns.map((col) =>
      col.id === columnId
        ? { ...col, cards: [...col.cards, newCard], isAddingCard: false, newCardText: "" }
        : col
    )
  );

  try {
    const response = await api.post(`/api/cards/create`, {
      column_id: columnId,
      text: cardText,
      checked: newCard.checked,
      position: newCard.position,
    });

    const savedCard = response.data;

    // Replace the temporary card with the saved card
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((card) => (card.id === tempId ? savedCard : card)),
            }
          : col
      )
    );

    console.log("Card saved successfully:", savedCard);
  } catch (error) {
    console.error("Error saving card:", error.message);
    alert("Failed to save card. Please try again.");

    // Revert the UI change
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((card) => card.id !== tempId) }
          : col
      )
    );
  }
};

// Remove a card from a column
export const removeCard = async (columns, setColumns, columnId, cardId) => {
  // Optimistically update the UI
  setColumns(
    columns.map((col) =>
      col.id === columnId
        ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
        : col
    )
  );

  try {
    const response = await api.delete(`/api/cards/${cardId}`);

    console.log("Card deleted successfully.");
  } catch (error) {
    console.error("Error deleting card:", error.message);
    alert("Failed to delete card. Please try again.");

    // Revert the UI change if the API call fails
    setColumns(
      columns.map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, { id: cardId }] }
          : col
      )
    );
  }
};

// Update card input text in a column
export const handleCardInputChange = (columns, setColumns, columnId, text) => {
  setColumns(
    columns.map((col) =>
      col.id === columnId ? { ...col, newCardText: text } : col
    )
  );
};

// Handle the Enter key press for adding a card
export const handleCardInputKeyPress = (event, columnId, columns, setColumns) => {
  if (event.key === "Enter") {
    showCard(columnId, columns, setColumns);
  }
};

// Start dragging a card
export const handleCardDragStart = (event, cardId, columnId, setDraggingCard) => {
  setDraggingCard({ cardId, columnId });
  event.dataTransfer.effectAllowed = "move";
};

// Allow dragging a card over a drop area
export const handleCardDragOver = (event) => {
  event.preventDefault();
};

// Handle dropping a card into a new column
export const handleCardDrop = async (event, targetColumnId, columns, setColumns, draggingCard) => {
  event.preventDefault();
  const { cardId, columnId } = draggingCard;

  const sourceColumn = columns.find((col) => col.id === columnId);
  const targetColumn = columns.find((col) => col.id === targetColumnId);
  const card = sourceColumn.cards.find((card) => card.id === cardId);

  if (!card) {
    console.error("Card not found in source column.");
    return;
  }

  // card put into the same column not disappearing fix
  if (sourceColumn.id === targetColumn.id) {
    console.log("Card dropped back into the same column, no updates needed.");
    return;
  }

  // Calculate the new position
  const targetCards = targetColumn.cards;
  let newPosition;

  if (targetCards.length === 0) {
    newPosition = 0; // First card in the column
  } else {
    // Find the index where the card is dropped
    const dropIndex = targetCards.findIndex((c) => c.id === draggingCard.dropTargetId);

    if (dropIndex === -1) {
      // If dropped at the end
      newPosition = targetCards[targetCards.length - 1].position + 1;
    } else {
      // Calculate the position between the adjacent cards
      const prevPosition = dropIndex > 0 ? targetCards[dropIndex - 1].position : 0;
      const nextPosition = targetCards[dropIndex].position;
      newPosition = parseFloat(((prevPosition + nextPosition) / 2).toFixed(2)); // Ensure numeric with 2 decimal places
    }
  }

  // Ensure newPosition is a valid number
  if (isNaN(newPosition)) {
    console.error("Invalid position calculated:", newPosition);
    alert("Failed to calculate a valid position for the card.");
    return;
  }

  // Convert position to a number explicitly
  newPosition = Number(newPosition);

  // Optimistically update the UI
  const updatedColumns = columns.map((col) => {
    if (col.id === columnId) {
      return { ...col, cards: col.cards.filter((card) => card.id !== cardId) };
    } else if (col.id === targetColumnId) {
      return { ...col, cards: [...col.cards, { ...card, position: newPosition }] };
    }
    return col;
  });

  setColumns(updatedColumns);

  try {
    const response = await api.patch(`/api/cards/${cardId}/move`, {
      column_id: targetColumnId,
      position: newPosition,
    });

    const updatedCard = response.data;
    console.log("Card position updated successfully:", updatedCard);
  } catch (error) {
    console.error("Error updating card position:", error.message);
    alert("Failed to update card position. Please try again.");

    // Revert the UI change if the API call fails
    setColumns(columns);
  }
};

// Handle checkbox toggle in a card
export const handleCheckboxChange = async (columnId, cardId, checked, setColumns) => {
  // Optimistically update the UI
  setColumns((prevColumns) =>
    prevColumns.map((col) =>
      col.id === columnId
        ? {
            ...col,
            cards: col.cards.map((card) =>
              card.id === cardId ? { ...card, checked } : card
            ),
          }
        : col
    )
  );

  try {
    const response = await api.patch(`/api/cards/${cardId}/checked`, { checked });

    const updatedCard = response.data;
    console.log("Card checked status updated successfully:", updatedCard);
  } catch (error) {
    console.error("Error updating card checked status:", error.message);
    alert("Failed to update card checked status. Please try again.");

    // Revert the UI change if the API call fails
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((card) =>
                card.id === cardId ? { ...card, checked: !checked } : card
              ),
            }
          : col
      )
    );
  }
};

// Start adding a card
export const startAddingCard = (columnId, columns, setColumns) => {
  setColumns(
    columns.map((col) =>
      col.id === columnId ? { ...col, newCardText: "", isAddingCard: true } : col
    )
  );
};

// Update a card's due date
export const updateCardDueDate = async (cardId, dueDate, columns, setColumns, columnId) => {
  try {
    const response = await api.patch(
      `/api/cards/${cardId}/due-date`,
      { dueDate }
    );

    const updatedCard = response.data;

    // Update the state
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((card) =>
                card.id === cardId ? { ...card, dueDate: updatedCard.dueDate } : card
              ),
            }
          : col
      )
    );
  } catch (error) {
    console.error("Error updating due date:", error);
  }
};