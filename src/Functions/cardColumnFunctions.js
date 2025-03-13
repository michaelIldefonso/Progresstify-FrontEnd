export const addColumn = () => { // Add a new column
    setColumns([
      ...columns,
      { id: Date.now(), title: "", isEditing: true, cards: [], newCardText: "", isAddingCard: false },
    ]);
  };

export const renameColumn = (columnId, newTitle) => { // Rename a column
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col
      )
    );
  };

export const finalizeColumnTitle = (columnId) => { // Finalize column title
    setColumns(
      columns.map((col) =>
        col.id === columnId && col.title.trim()
          ? { ...col, isEditing: false }
          : col
      )
    );
  };

export const handleColumnDragStart = (event, columnId) => { // Handle column drag start
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

export const handleDrop = (event, targetColumnId, draggingCard, columns, setColumns) => {
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

export const handleTrashDrop = (event, draggingCard, columns, setColumns) => {
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