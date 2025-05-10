import { useState, useEffect } from "react";

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
  // Allow vertical scrolling inside card lists
  if (e.target.closest(".card-list")) {
    
    return; // Do nothing and allow the default vertical scrolling
  }

  // Horizontal scrolling logic
  if (columnsContainerRef.current && scrollbarRef.current) {
    const delta = e.deltaY; // Use vertical wheel movement to scroll horizontally
    columnsContainerRef.current.scrollLeft += delta;
    scrollbarRef.current.scrollLeft = columnsContainerRef.current.scrollLeft; // Sync scrollbarRef
    
  }
};

export const handleScrollbarScroll = (event, columnsContainerRef) => {
  if (columnsContainerRef.current) {
    columnsContainerRef.current.scrollLeft = event.target.scrollLeft;
    
  }
};

export const handleChange = (e, formData, setFormData) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

export const handleSubmit = (e, isSignUp, formData, setOpen) => {
  e.preventDefault();
  if (isSignUp && formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  alert(`${isSignUp ? "Sign Up" : "Login"} successful!`);
  setOpen(false);
  // Navigate("/workspace"); // Uncomment this when using a router
};

export const handleScheduleDueDate = () => {
  handleMenuClose();
  // Implement scheduling logic here
  const dueDate = prompt("Enter the due date (e.g., YYYY-MM-DD):");
  if (dueDate) {
    // You can update the card's due date here
    alert(`Scheduled Due Date: ${dueDate}`);
  }
};

export const useTimer = (delay = 2000) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);
  return isReady;
}