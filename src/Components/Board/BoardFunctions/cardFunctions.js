export const ShowPopupCard = (columns, setColumns, columnId) => {
  const column = columns.find((col) => col.id === columnId);
  if (column.newCardText.trim()) {
    handleCreateCard(columnId, column.newCardText, columns, setColumns);
  } else {
    setColumns(
      columns.map((col) => {
        if (col.id === columnId) {
          return { ...col, newCardText: "", isAddingCard: false };
        }
        return col;
      })
    );
  }
};

export const handleCreateCard = async (columnId, cardText, columns, setColumns) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        column_id: columnId,
        text: cardText,
        checked: false,
        position: columns.find((col) => col.id === columnId).cards.length // Assuming position is based on the card's order
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to create card: ${errorText}`);
      throw new Error(`Failed to create card: ${errorText}`);
    }

    const newCard = await response.json();
    setColumns(
      columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            cards: [...col.cards, newCard],
            newCardText: "",
            isAddingCard: false,
          };
        }
        return col;
      })
    );
  } catch (error) {
    console.error('Failed to create card:', error);
  }
};

export const removeCard = (columns, setColumns, columnId, cardId) => {
  setColumns(
    columns.map((col) => {
      if (col.id === columnId) {
        return { ...col, cards: col.cards.filter((card) => card.id !== cardId) };
      }
      return col;
    })
  );
};

export const handleCardInputChange = (columns, setColumns, columnId, text) => {
  setColumns(
    columns.map((col) => (col.id === columnId ? { ...col, newCardText: text } : col))
  );
};

export const handleCardInputKeyPress = (event, columnId, columns, setColumns) => {
  if (event.key === "Enter") {
    ShowPopupCard(columns, setColumns, columnId);
  }
};

export const handleCardDragStart = (event, cardId, columnId, setDraggingCard) => {
  setDraggingCard({ cardId, columnId });
  event.dataTransfer.effectAllowed = "move";
};

export const handleCardDragOver = (event) => {
  event.preventDefault();
};

export const handleCardDrop = (event, targetColumnId, columns, setColumns, draggingCard) => {
  event.preventDefault();
  const { cardId, columnId } = draggingCard;

  if (columnId !== targetColumnId) {
    const sourceColumn = columns.find((col) => col.id === columnId);
    const targetColumn = columns.find((col) => col.id === targetColumnId);
    const card = sourceColumn.cards.find((card) => card.id === cardId);

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

export const handleCheckboxChange = (columnId, cardId, checked, setColumns) => {
  setColumns((prevColumns) =>
    prevColumns.map((column) =>
      column.id === columnId
        ? {
            ...column,
            cards: column.cards.map((card) => (card.id === cardId ? { ...card, checked } : card)),
          }
        : column
    )
  );
};

export const getCard = async (boardId, setColumns, cardsFetchedRef) => {
  if (cardsFetchedRef.current) return; // Skip if cards are already fetched

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cards/boards/${boardId}/cards`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch cards: ${errorText}`);
      throw new Error(`Failed to fetch cards: ${errorText}`);
    }

    const cards = await response.json();

    setColumns((prevColumns) => {
      if (!prevColumns || prevColumns.length === 0) {
        console.warn("Columns are not yet loaded. Skipping card assignment...");
        return prevColumns; // Wait for columns to load
      }

      // Distribute cards to their respective columns
      return prevColumns.map((column) => ({
        ...column,
        cards: cards
          .filter((card) => card.column_id === column.id)
          .map(({ id, text, checked, position }) => ({ id, text, checked, position })),
      }));
    });

    cardsFetchedRef.current = true; // Mark cards as fetched
  } catch (error) {
    console.error('Failed to fetch cards:', error);
  }
};