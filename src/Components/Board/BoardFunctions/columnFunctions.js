const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Fetches the base URL for API requests from environment variables

// Adds a new column to the board by sending a POST request and updates the columns state with the new column in editing mode
export const showColumn = async (boardId, columns, setColumns) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/columns/${boardId}/columns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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

// Renames a column by updating its title locally and sending a PUT request to persist the change on the server
export const renameColumn = async (boardId, columns, setColumns, columnId, newTitle) => {
  setColumns(
    columns.map((col) =>
      col.id === columnId ? { ...col, title: newTitle } : col
    )
  );

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/columns/${boardId}/columns/${columnId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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

// Finalizes the column title by disabling the editing state if the title is non-empty
export const finalizeColumnTitle = (columns, setColumns, columnId) => {
  setColumns(
    columns.map((col) =>
      col.id === columnId && col.title.trim()
        ? { ...col, isEditing: false }
        : col
    )
  );
};

// Handles the start of a column drag event by setting the dragged column's ID and enabling the move effect
export const handleColumnDragStart = (event, columnId, setDraggingColumn) => {
  setDraggingColumn(columnId);
  event.dataTransfer.effectAllowed = "move";
};

// Removes a column from the state and sends a DELETE request to the server to persist the change
export const removeColumn = async (boardId, columnId, columns, setColumns) => {
  setColumns(columns.filter((col) => col.id !== columnId));

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/columns/${boardId}/columns/${columnId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to delete column: ${errorText}`);
      throw new Error(`Failed to delete column: ${errorText}`);
    }
  } catch (error) {
    console.error('Failed to delete column:', error);
  }
};

// Fetches columns and their associated cards for a specific board and updates the state while avoiding redundant fetches
export const getColumns = async (boardId, setColumns, columnsFetchedRef) => {
  if (!columnsFetchedRef || columnsFetchedRef.current) {
    console.log("Columns fetch skipped because columnsFetchedRef is already true or undefined.");
    return;
  }

  columnsFetchedRef.current = true; // Mark as fetched to prevent duplicate requests

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/api/columns/${boardId}/columns-with-cards`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load columns with cards: ${await response.text()}`);
    }

    const columnsWithCards = await response.json();
    setColumns(
      columnsWithCards.map((col) => ({
        ...col,
        cards: col.cards.map((card) => ({
          ...card,
          dueDate: card.due_date, // Map `due_date` to `dueDate`
        })),
        isEditing: false,
        newCardText: "",
        isAddingCard: false,
      }))
    );
  } catch (error) {
    if (columnsFetchedRef) columnsFetchedRef.current = false; // Revert if fetch fails
    console.error("Failed to load columns with cards:", error);
  }
};

// Adds a new column and scrolls to the end of the container to display it
export const handleAddColumn = async (id, columns, setColumns, columnsContainerRef) => {
  await showColumn(id, columns, setColumns);
  if (columnsContainerRef.current) {
    columnsContainerRef.current.scrollLeft = columnsContainerRef.current.scrollWidth;
  }
};

// Synchronizes the scroll position of the custom scrollbar with the main container's horizontal scroll
export const handleColumnsScroll = (e, scrollbarRef) => {
  if (scrollbarRef.current) {
    scrollbarRef.current.scrollLeft = e.target.scrollLeft;
  }
};