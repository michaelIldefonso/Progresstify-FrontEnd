const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const showColumn = async (boardId, columns, setColumns) => { // Add a new column
  try {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    const response = await fetch(`${API_BASE_URL}/api/columns/${boardId}/columns`, { // Adjusted URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the token in the headers
      },
      body: JSON.stringify({ title: "", order: columns.length })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to create column: ${errorText}`);
      throw new Error(`Failed to create column: ${errorText}`);
    }

    const newColumn = await response.json();
    setColumns([...columns, { ...newColumn, isEditing: true, cards: [], newCardText: "", isAddingCard: false }]);
  } catch (error) {
    console.error('Failed to create column:', error);
  }
};

export const renameColumn = async (boardId, columns, setColumns, columnId, newTitle) => { // Rename a column
  setColumns(
    columns.map((col) =>
      col.id === columnId ? { ...col, title: newTitle } : col
    )
  );

  try {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    const response = await fetch(`${API_BASE_URL}/api/columns/${boardId}/columns/${columnId}`, { // Adjusted URL
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the token in the headers
      },
      body: JSON.stringify({ title: newTitle })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to rename column: ${errorText}`);
      throw new Error(`Failed to rename column: ${errorText}`);
    }
  } catch (error) {
    console.error('Failed to rename column:', error);
  }
};

export const finalizeColumnTitle = (columns, setColumns, columnId) => { // Finalize column title
  setColumns(
    columns.map((col) =>
      col.id === columnId && col.title.trim()
        ? { ...col, isEditing: false }
        : col
    )
  );
};

export const handleColumnDragStart = (event, columnId, setDraggingColumn) => { // Handle column drag start
  setDraggingColumn(columnId);
  event.dataTransfer.effectAllowed = "move";
};

export const addCard = (columns, setColumns, columnId) => {
  setColumns(
    columns.map((col) => {
      if (col.id === columnId && col.newCardText.trim()) {
        return {
          ...col,
          cards: [...col.cards, { id: Date.now(), text: col.newCardText, checked: false }],
          newCardText: "",
          isAddingCard: false,
        };
      }
      return col;
    })
  );
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
    addCard(columns, setColumns, columnId);
  }
};

export const handleCardDragStart = (event, cardId, columnId, setDraggingCard) => {
  setDraggingCard({ cardId, columnId });
  event.dataTransfer.effectAllowed = "move";
};

export const handleDrop = (event, targetColumnId, draggingCard, columns, setColumns, setDraggingCard) => {
  event.preventDefault();
  const { cardId, columnId } = draggingCard;
  if (cardId && columnId !== targetColumnId) {
    setColumns(
      columns.map((col) => {
        if (col.id === columnId) {
          return { ...col, cards: col.cards.filter((card) => card.id !== cardId) };
        }
        if (col.id === targetColumnId) {
          const movedCard = columns
            .find((col) => col.id === columnId)
            .cards.find((card) => card.id === cardId);
          return { ...col, cards: [...col.cards, movedCard] };
        }
        return col;
      })
    );
  }
  setDraggingCard(null);
};

export const handleTrashDrop = (event, draggingCard, columns, setColumns, setDraggingCard) => {
  event.preventDefault();
  const { cardId, columnId } = draggingCard;
  if (cardId && columnId) {
    setColumns(
      columns.map((col) => {
        if (col.id === columnId) {
          return { ...col, cards: col.cards.filter((card) => card.id !== cardId) };
        }
        return col;
      })
    );
  }
  setDraggingCard(null);
};

export const handleCheckboxChange = (columnId, cardId, checked, setColumns) => {
  setColumns((prevColumns) =>
    prevColumns.map((col) =>
      col.id === columnId
        ? {
          ...col,
          cards: col.cards.map((card) =>
            card.id === cardId ? { ...card, checked: checked } : card
          ),
        }
        : col
    )
  );
};