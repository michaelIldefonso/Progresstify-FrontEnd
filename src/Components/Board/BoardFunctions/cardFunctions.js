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
      col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
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
export const removeCard = (columns, setColumns, columnId, cardId) => {
  setColumns(
    columns.map((col) =>
      col.id === columnId
        ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
        : col
    )
  );
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
export const handleCheckboxChange = (columnId, cardId, checked, setColumns) => {
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
};

// Fetch all cards for a board
export const getCard = async (boardId, setColumns, cardsFetchedRef) => {
  if (cardsFetchedRef.current) {
    console.log("Cards fetch skipped because cardsFetchedRef is already true.");
    return;
  }

  cardsFetchedRef.current = true; // Mark as fetched to prevent duplicate requests
  console.log("Starting fetch for cards...");

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No authentication token found!");

    const response = await fetch(`${API_BASE_URL}/api/cards/boards/${boardId}/cards`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cards: ${await response.text()}`);
    }

    const cards = await response.json();
    console.log("Cards fetched successfully:", cards);

    // Update columns with the fetched cards
    setColumns((prevColumns) =>
      prevColumns.map((col) => ({
        ...col,
        cards: cards
          .filter((card) => card.column_id === col.id)
          .map(({ id, text, checked, position }) => ({ id, text, checked, position })),
      }))
    );
  } catch (error) {
    cardsFetchedRef.current = false; // Revert if fetch fails
    console.error("Error while fetching cards:", error.message);
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