import { apiClient } from "../../../utils/auth";

const api = apiClient(); // Create an instance of apiClient

export const showColumn = async (boardId, columns, setColumns) => {
  try {
    const response = await api.post(`/api/columns/${boardId}/columns`, {
      title: "",
      order: columns.length,
    });

    const newColumn = response.data;
    setColumns([
      ...columns,
      {
        ...newColumn,
        isEditing: true,
        cards: [],
        newCardText: "",
        isAddingCard: false,
      },
    ]);
  } catch (error) {
    console.error("Failed to create column:", error.response?.data?.message || error.message);
  }
};

export const renameColumn = async (boardId, columns, setColumns, columnId, newTitle) => {
  setColumns(
    columns.map((col) =>
      col.id === columnId ? { ...col, title: newTitle } : col
    )
  );

  try {
    const response = await api.put(`/api/columns/${boardId}/columns/${columnId}`, {
      title: newTitle,
    });

    // Axios automatically throws an error for non-2xx responses, so no need for `response.ok`.
    console.log("Column renamed successfully:", response.data);
  } catch (error) {
    console.error("Failed to rename column:", error.response?.data?.message || error.message);
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
    const response = await api.delete(`/api/columns/${boardId}/columns/${columnId}`);
    console.log("Column deleted successfully:", response.data);
  } catch (error) {
    console.error("Failed to delete column:", error.response?.data?.message || error.message);
  }
};

export const getColumns = async (boardId, setColumns, columnsFetchedRef) => {
  if (!columnsFetchedRef || columnsFetchedRef.current) {
    console.log("Columns fetch skipped because columnsFetchedRef is already true or undefined.");
    return;
  }

  columnsFetchedRef.current = true; // Mark as fetched to prevent duplicate requests

  try {
    const response = await api.get(`/api/columns/${boardId}/columns-with-cards`);

    // Access the data directly from the Axios response
    const columnsWithCards = response.data;

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

    // Handle specific error cases
    console.error("Failed to load columns with cards:", error.response?.data?.message || error.message);
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