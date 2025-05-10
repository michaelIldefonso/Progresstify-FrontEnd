import { apiClient } from "../../../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Base URL for the API
const api = apiClient(); // Create an instance of apiClient

export const loadBoards = async (workspaceId, setBoards, setActiveBoard, id) => {
  try {
    const response = await api.get(`/api/boards/${workspaceId}/boards`);
    const savedBoards = response.data;

    if (Array.isArray(savedBoards)) {
      setBoards(savedBoards);
      if (id) {
        const active = savedBoards.find((d) => d.id === parseInt(id));
        setActiveBoard(active);
      }
    } else {
      console.error("Failed to load boards: response is not an array");
    }
  } catch (error) {
    console.error("Failed to load boards:", error);
  }
};

export const createBoard = async (workspaceId, boards, setBoards, boardName, setBoardName, setModalOpen) => {
  try {
    if (!workspaceId) {
      throw new Error('Workspace ID is required');
    }

    console.log(`Sending request to create board in workspace ${workspaceId} with name ${boardName}`);
    const newBoard = await api.post(`/api/boards/${workspaceId}/boards`, {
      name: boardName,
    });

    console.log('Board created successfully:', newBoard);
    setBoards([...boards, newBoard]);
    setBoardName('');
    setModalOpen(false);
  } catch (error) {
    console.error('Failed to create board:', error);
    alert('Failed to create board: ' + error.message);
  }
};

export const selectBoard = async (board, setActiveBoard, setEditingBoardId, navigate, setLoading) => {
  if (setLoading) setLoading(true); // Ensure setLoading is called only if defined
  setActiveBoard(board);
  setEditingBoardId(null);

  try {
    await navigate(`/board/${board.id}`); // Await the navigation
  } finally {
    if (setLoading) setLoading(false); // Reset loading state after navigation
  }
};

export const handleEditClick = (board, setEditingBoardId, setBoardName) => {
  setEditingBoardId(board.id);
  setBoardName(board.name);
};

export const handleNameChange = (e, setBoardName) => {
  setBoardName(e.target.value);
};

export const handleNameSave = async (workspaceId, board, boards, setBoards, boardName, setEditingBoardId) => {
  try {
    await api.patch(`/api/boards/${workspaceId}/boards/${board.id}`, {
      name: boardName
    });

    setBoards(boards.map(d => d.id === board.id ? { ...d, name: boardName } : d));
    setEditingBoardId(null);
  } catch (error) {
    console.error("Failed to save board name:", error);
  }
};

export const deleteBoard = async (workspaceId, boardId, boards, setBoards) => {
  try {
    await api.delete(`/api/boards/${workspaceId}/boards/${boardId}`);

    setBoards(boards.filter((board) => board.id !== boardId)); // Update state after deletion
  } catch (error) {
    console.error("Failed to delete board:", error);
    alert("Failed to delete board. Please try again.");
  }
};