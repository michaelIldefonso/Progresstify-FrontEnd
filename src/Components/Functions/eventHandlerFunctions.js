export const handleMenu = (event, setAnchorEl) => {
    setAnchorEl(event.currentTarget);
  };
  
  export const handleClose = (setAnchorEl) => {
    setAnchorEl(null);
  };
  
  export const toggleDrawer = (setDrawerOpen, drawerOpen) => {
    setDrawerOpen(!drawerOpen);
  };
  
  export const handleDrop = (e, targetColumnId, draggingCard, columns, setColumns, setDraggingCard) => {
    e.preventDefault();
    if (!draggingCard) return;
  
    const { cardId, columnId } = draggingCard;
  
    // Check if the source column and target column are the same
    if (columnId === targetColumnId) {
      setDraggingCard(null);
      return;
    }
  
    const sourceColumn = columns.find((col) => col.id === columnId);
    const targetColumn = columns.find((col) => col.id === targetColumnId);
  
    const card = sourceColumn.cards.find((c) => c.id === cardId);
  
    const updatedSourceCards = sourceColumn.cards.filter((c) => c.id !== cardId);
    const updatedTargetCards = [...targetColumn.cards, card];
  
    const updatedColumns = columns.map((col) => {
      if (col.id === columnId) {
        return { ...col, cards: updatedSourceCards };
      } else if (col.id === targetColumnId) {
        return { ...col, cards: updatedTargetCards };
      } else {
        return col;
      }
    });
  
    setColumns(updatedColumns);
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

export const handleWheelScroll = (e, columnsContainerRef, scrollbarRef) => {
  if (!e.target.closest('.column')) {
    if (columnsContainerRef.current && scrollbarRef.current) {
      columnsContainerRef.current.scrollLeft += e.deltaY;
      scrollbarRef.current.scrollLeft += e.deltaY;
    }
  }
};

export const handleScrollbarScroll = (e, columnsContainerRef) => {
  if (columnsContainerRef.current) {
    columnsContainerRef.current.scrollLeft = e.target.scrollLeft;
  }
};