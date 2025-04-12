const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Show a new card in a column
export const showCard = async (columnId, columns, setColumns) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No authentication token found!");

    const response = await fetch(`${API_BASE_URL}/api/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        column_id: columnId,
        text: "",
        checked: false,
        position: columns.find((col) => col.id === columnId).cards.length || 0,
      }),
    });

    if (!response.ok) throw new Error(`Failed to create card: ${await response.text()}`);

    const newCard = await response.json();

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

  const token = localStorage.getItem('token');
  if (!token) {
    alert("You are not authenticated. Please log in.");
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
    const response = await fetch(`${API_BASE_URL}/api/cards/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        column_id: columnId,
        text: cardText,
        checked: newCard.checked,
        position: newCard.position,
      }),
    });

    if (!response.ok) throw new Error(`Failed to save card: ${await response.text()}`);

    const savedCard = await response.json();

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
  const token = localStorage.getItem('token');
  if (!token) {
    alert("You are not authenticated. Please log in.");
    return;
  }

  // Optimistically update the UI
  setColumns(
    columns.map((col) =>
      col.id === columnId
        ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
        : col
    )
  );

  try {
    const response = await fetch(`${API_BASE_URL}/api/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Failed to delete card: ${await response.text()}`);

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
export const handleCardDrop = (event, targetColumnId, columns, setColumns, draggingCard) => {
  event.preventDefault();
  const { cardId, columnId } = draggingCard;

  if (columnId !== targetColumnId) {
    const sourceColumn = columns.find((col) => col.id === columnId);
    const targetColumn = columns.find((col) => col.id === targetColumnId);
    const card = sourceColumn.cards.find((card) => card.id === cardId);

    // Update columns after drag and drop
    setColumns(
      columns.map((col) => {
        if (col.id === columnId) {
          return { ...col, cards: col.cards.filter((card) => card.id !== cardId) };
        } else if (col.id === targetColumnId) {
          return { ...col, cards: [...col.cards, card] };
        }
        return col;
      })
    );
  }
};

// Handle checkbox toggle in a card
export const handleCheckboxChange = async (columnId, cardId, checked, setColumns) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("You are not authenticated. Please log in.");
    return;
  }

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
    const response = await fetch(`${API_BASE_URL}/api/cards/${cardId}/checked`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ checked }),
    });

    if (!response.ok) throw new Error(`Failed to update card: ${await response.text()}`);

    const updatedCard = await response.json();
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