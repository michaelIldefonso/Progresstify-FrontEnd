const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export const handleCheckboxChange = (columnId, cardId, checked, setColumns) => {
  setColumns(prevColumns =>
    prevColumns.map(column =>
      column.id === columnId
        ? {
            ...column,
            cards: column.cards.map(card =>
              card.id === cardId ? { ...card, checked } : card
            )
          }
        : column
    )
  );
};