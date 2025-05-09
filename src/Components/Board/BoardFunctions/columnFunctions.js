const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export const finalizeColumnTitle = (columns, setColumns, columnId) => {
  setColumns(
    columns.map((col) =>
      col.id === columnId && col.title.trim()
        ? { ...col, isEditing: false }
        : col
    )
  );
};

export const handleColumnDragStart = (event, columnId, setDraggingColumn) => {
  setDraggingColumn(columnId);
  event.dataTransfer.effectAllowed = "move";
};

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

export const handleAddColumn = async (id, columns, setColumns, columnsContainerRef) => {
  await showColumn(id, columns, setColumns);
  if (columnsContainerRef.current) {
    columnsContainerRef.current.scrollLeft = columnsContainerRef.current.scrollWidth;
  }
};

export const handleColumnsScroll = (e, scrollbarRef) => {
  if (scrollbarRef.current) {
    scrollbarRef.current.scrollLeft = e.target.scrollLeft;
  }
};